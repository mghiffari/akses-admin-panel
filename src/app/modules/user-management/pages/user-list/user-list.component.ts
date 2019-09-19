import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User, UserForm } from '../../models/user';
import { AccountService } from 'src/app/shared/services/account.service';
import { PageService } from 'src/app/shared/services/page.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { UserDetailsModalComponent } from '../../components/user-details-modal/user-details-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-test',
  templateUrl: './user-list.component.html',
  styleUrls: []
})
export class UserListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps};

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
  roles = [];
  allowCreate = false;
  allowDelete = false;
  allowEdit = false;

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
    private pageService: PageService,
    private snackBar: MatSnackBar,
    private modal: MatDialog,
    private authService: AuthService
  ) {
    console.log('UserComponent | constructor');
  }

  //angular on init
  ngOnInit() {
    console.log('UserComponent | ngOnInit');
    let prvg = this.authService.getFeaturePrivilege(constants.features.user)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.allowDelete = this.authService.getFeatureDeletePrvg(prvg)
      this.loading = true;
      this.pageService.getRoleList().subscribe(
        response => {
          try {
            console.table('data', response)
            this.lazyLoadData();
            this.roles = response.data;
          } catch (error) {
            console.error(error)
          } 
        },
        error => {
          try {
            console.table(error);
            this.loading = false;
            let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'userListScreen.failedToGetRoles',
                content: {
                  text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })              
          } catch (error) {
            console.table(error)
          }
        }
      );
    } else {
      this.authService.blockOpenPage()
    }  
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
    if(this.allowDelete){
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
      modalRef.afterClosed().subscribe(result => {
        if(result){
          this.loading = true;
          let delUser = Object.assign(new UserForm(), user);
          delUser.is_deleted = true;
          delUser.groupId = user.pgroup.group_id;
          this.accountService.updateUser(delUser).subscribe(
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
                      text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
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
      this.authService.blockPageAction()
    }
  }

  // handle click edit button
  onEdit(user){
    console.log('UserComponent | onEdit');
    if(this.allowEdit){
      const modalRef = this.modal.open(UserDetailsModalComponent, {
        width: '80%',
        minWidth: '260px',
        maxWidth: '400px',
        data: {
          isCreate: false,
          editedUser: {...user},
          roles: this.roles
        }
      });
      modalRef.afterClosed().subscribe(result => {
        if(result) {
          this.lazyLoadData();
        }
      });
    } else {
      this.authService.blockPageAction()
    }
  };

  // handle click create link
  onCreate(){
    console.log('UserComponent | onCreate');
    if(this.allowCreate){
      this.modal.open(UserDetailsModalComponent, {
        width: '80%',
        minWidth: '260px',
        maxWidth: '400px',
        data: {
          isCreate: true,
          roles: this.roles
        }
      })
    } else {
      this.authService.blockPageAction()
    }
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
          } catch (error) {
            console.log(error)
            this.paginatorProps.pageIndex = 0
            this.paginatorProps.length = 0
            this.users = []
          }
        },
        error => {
          try {            
            console.table(error);
            this.paginatorProps.pageIndex = 0
            this.paginatorProps.length = 0
            this.users = []
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
          if (this.table) {
            this.table.renderRows();
          }
          if (this.searchInput && isFocusedInput) {
            setTimeout(() => {
              this.searchInput.nativeElement.focus();
            });
          }
        }
      )
  }

}