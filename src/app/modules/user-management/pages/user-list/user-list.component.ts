import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { AccountService } from 'src/app/shared/services/account.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { UserDetailsModalComponent } from '../../components/user-details-modal/user-details-modal.component';

@Component({
  selector: 'app-test',
  templateUrl: './user-list.component.html',
  styleUrls: []
})
export class UserListComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }

  userColumns: string[] = [
    'number',
    'firstname',
    'lastname',
    'email',
    'createdDate',
    'role',
    'action',
  ]

  users: User[] = [];
  search = '';
  loading = false;
  isFocusedInput = false;
  roles = ['superadmin', 'admin', 'visitor'];

  private table: any;
  @ViewChild('userTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  //constructor
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private modal: MatDialog
  ) {
    console.log('UserComponent | constructor');
  }

  //angular on init
  ngOnInit() {
    console.log('UserComponent | ngOnInit');
    this.lazyLoadData()
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('UserComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('UserComponent | onSearch');
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  //delete
  onDelete(user: User){
    console.log("UserComponent | onDelete")
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'deleteConfirmation',
        content: {
          string: 'userListScreen.deleteConfirmation',
          data: {
            name: user.firstname + ' ' + user.lastname
          }
        }
      }
    })
    // modalRef.afterClosed().subscribe(result => {
    //   if(result){
    //     this.loading = true;
    //     let delUser = Object.assign(new User(), user);
    //     delUser.is_deleted = true;
    //     this.accountService.updateUser(delUser).subscribe(
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
    //                 text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
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

  // handle click edit button
  onEdit(user){
    console.log('UserComponent | onEdit');
    this.modal.open(UserDetailsModalComponent, {
      width: '80%',
      minWidth: '260px',
      maxWidth: '400px',
      data: {
        isCreate: false,
        editedUser: {...user},
        roles: this.roles
      }
    })
  }

  // handle click create link
  onCreate(){
    console.log('UserComponent | onCreate');
    this.modal.open(UserDetailsModalComponent, {
      width: '80%',
      minWidth: '260px',
      maxWidth: '400px',
      data: {
        isCreate: true,
        roles: this.roles
      }
    })
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('UserComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.accountService.getUserList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (data: any) => {
          try {            
            console.table(data);
            this.users = data.data;
            this.paginatorProps.length = data.count;
            if (this.table) {
              this.table.renderRows();
            }
          } catch (error) {
            console.log(error)
          }
        },
        error => {
          try {            
            console.table(error);
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'userListScreen.loadFailed',
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