import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: []
})
export class NotificationListComponent implements OnInit {
  now = new Date();
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }

  notifColumns: string[] = [
    'number',
    'title',
    'schedule',
    'lastEdited',
    'sent',
    'clicked',
    'type',
    'action'
  ]

  notifications: Notification[] = [];
  search = '';
  closeText = '';
  loading = false;
  isFocusedInput = false;

  private table: any;
  @ViewChild('notifsTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private notifService: NotificationService,
    private snackBar: MatSnackBar,
    private modal: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('NotificationListComponent | ngOnInit');
    this.lazyLoadData()
  }

  //delete
  onDelete(notif) {
    console.log("NotificationListComponent | onDelete")
    if(this.isEditableNotif(notif)){
      const modalRef = this.modal.open(ConfirmationModalComponent, {
        width: '260px',
        data: {
          title: 'deleteConfirmation',
          content: {
            string: 'notificationListScreen.deleteConfirmation',
            data: {
              title: notif.title
            }
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          this.notifService.deleteNotif(notif.id).subscribe(
            (data: any) => {
              try {
                console.table(data);
                this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                  data: {
                    title: 'success',
                    content: {
                      text: 'dataDeleted',
                      data: null
                    }
                  }
                })
                this.lazyLoadData()
              } catch (error) {
                console.table(error)
              }
            },
            error => {
              try {
                console.table(error);
                this.loading = false;
                let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                  data: {
                    title: 'failedToDelete',
                    content: {
                      text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                      data: null
                    }
                  }
                })
              } catch (error) {
                console.table(error)
              }
            }
          )
        }
      })
    } else {
      this.table.renderRows()
    }
  }

  // edit button handler
  onEdit(notif){
    console.log('NotificationListComponent | onEdit')
    if(this.isEditableNotif(notif)){
      this.router.navigate(['/notifications/update', notif.id])
    } else {
      this.table.renderRows();
      this.editNotifError();
    }
  }

  // refresh button handler
  onRefresh(notif){
    console.log('NotificationListComponent | onRefresh')
    // this.loading = true;
    // this.notifService.getNotifById(notif.id).subscribe(
    //   response => {
    //     try {
    //       console.table(response)
    //       this.loading = false;
    //       notif = response.data;
    //       if (this.table) {
    //         this.table.renderRows();
    //       }      
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }, error => {
    //     try {
    //       console.table(error)
    //       this.loading = false;
    //       this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //         data: {
    //           title: 'failedToRefreshData',
    //           content: {
    //             text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //             data: null
    //           }
    //         }
    //       })
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    // )
  }
  // show error if to be edited notification data is not valid eq: immediate notif & notif <= 1 hr
  editNotifError(){
    console.log('NotificationListComponent | editNotifError')
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'error',
        content: {
          text: 'notificationDetailsScreen.cantUpdate.minDuration',
          data: null
        }
      }
    })
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('NotificationListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('NotificationListComponent | onSearch');
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  //check whether notifcation is editable
  isEditableNotif(notif){
    console.log('NotificationListComponent | onSearch');
    if(notif.scheduled_flg){
      return CustomValidation.durationFromNowValidation(new Date(notif.schedule_sending))
    } else {
      return false;
    }
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('NotificationListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.notifService.getNotifList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (data: any) => {
          try {
            console.table(data);
            this.notifications = data.data;
            this.paginatorProps.length = data.count;
            this.now = new Date()
            if (this.table) {
              this.table.renderRows();
            }
          } catch (error) {
            console.table(error);
          }
        },
        error => {
          try {
            console.table(error);
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'notificationListScreen.loadFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.log(error)
          }
        }
      ).add(
        () => {
          this.loading = false;
          if (this.searchInput && isFocusedInput) {
            setTimeout(() => {
              this.searchInput.nativeElement.focus();
            });
          }
        }
      )
  }
}
