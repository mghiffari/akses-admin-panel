import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

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

  notifications = [
    {
      title: "Harcilnas",
      schedule: "Langsung",
      time: new Date(2019, 4, 9, 12, 15, 0, 0),
      modified_by: 'user@mail.com',
      modified_dt: new Date(2019, 4, 9, 10, 24, 0, 0),
      created_by: 'user@mail.com',
      created_dt: new Date(2019, 4, 2, 15, 42, 0, 0),
      sent: 1723
    },
    {
      title: "Promo Natal",
      schedule: "Terjadwal",
      time: new Date(2019, 11, 24, 13, 30, 0, 0),
      modified_by: '',
      modified_dt: null,
      created_by: 'user@mail.com',
      created_dt: new Date(2019, 4, 8, 7, 55, 0, 0),
      sent: 0
    }
  ];
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
    // private notifService: NotificationService,
    private snackBar: MatSnackBar,
    private modal: MatDialog,
  ) { }

  ngOnInit() {
    console.log('NotificationListComponent | ngOnInit');
    // this.lazyLoadData()
  }

  //delete
  onDelete(notif) {
    console.log("NotificationListComponent | onDelete")
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
    // modalRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loading = true;
    //     let delNotif = Object.assign({}, notif);
    //     delNotif.is_deleted = true;
    //     this.notifService.updateNotif(delNotif).subscribe(
    //       (data: any) => {
    //         try {
    //           console.table(data);
    //           this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //             data: {
    //               title: 'success',
    //               content: {
    //                 text: 'dataDeleted',
    //                 data: null
    //               }
    //             }
    //           })
    //           this.lazyLoadData()
    //         } catch (error) {
    //           console.table(error)
    //         }
    //       },
    //       error => {
    //         try {
    //           console.table(error);
    //           this.loading = false;
    //           let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //             data: {
    //               title: 'failedToDelete',
    //               content: {
    //                 text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //                 data: null
    //               }
    //             }
    //           })
    //         } catch (error) {
    //           console.table(error)
    //         }
    //       }
    //     )
    //   }
    // })
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

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('NotificationListComponent | lazyLoadData');
    // let isFocusedInput = this.isFocusedInput;
    // this.loading = true;
    // this.notifService.getNotifList(
    //   this.paginatorProps.pageIndex + 1,
    //   this.paginatorProps.pageSize,
    //   this.search).subscribe(
    //     (data: any) => {
    //       try {
    //         console.table(data);
    //         this.notifications = data.data;
    //         this.paginatorProps.length = data.count;
    //         this.now = new Date()
    //         if (this.table) {
    //           this.table.renderRows();
    //         }
    //       } catch (error) {
    //         console.table(error);
    //       }
    //     },
    //     error => {
    //       try {
    //         console.table(error);
    //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //           data: {
    //             title: 'notificationListScreen.loadFailed',
    //             content: {
    //               text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //               data: null
    //             }
    //           }
    //         })
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }
    //   ).add(
    //     () => {
    //       this.loading = false;
    //       if (this.searchInput && isFocusedInput) {
    //         setTimeout(() => {
    //           this.searchInput.nativeElement.focus();
    //         });
    //       }
    //     }
    //   )
  }
}
