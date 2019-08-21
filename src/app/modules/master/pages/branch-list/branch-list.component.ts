import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { BranchService } from '../../services/branch.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { BranchUploadModalComponent } from '../../components/branch-upload-modal/branch-upload-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { Branch } from '../../models/branch';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: []
})
export class BranchListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps};

  branchColumns: string[] = [
    'number',
    'branchName',
    'branchCode',
    'branchType',
    'address',
    'province',
    'action'
  ]

  branches: Branch[] = [];
  search = '';
  closeText = '';
  loading = false;
  isFocusedInput = false;
  allowEdit = false;
  allowCreate = false;
  allowDelete = false;

  private table: any;
  @ViewChild('branchesTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    private modal: MatDialog,
    private overlay: Overlay,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('BranchListComponent | ngOnInit');
    this.allowCreate = false;
    this.allowEdit = false;
    this.allowDelete = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.branchLocation)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.lazyLoadData()
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.allowDelete = this.authService.getFeatureDeletePrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  //delete
  onDelete(branch) {
    console.log("BranchListComponent | onDelete")
    if(this.allowDelete){
      const modalRef = this.modal.open(ConfirmationModalComponent, {
        width: '260px',
        data: {
          title: 'deleteConfirmation',
          content: {
            string: 'branchListScreen.deleteConfirmation',
            data: {
              name: branch.name
            }
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          let delBranch = Object.assign({}, branch);
          delBranch.is_deleted = true;
          this.branchService.updateBranch(delBranch).subscribe(
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
      this.authService.blockPageAction()
    }
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('BranchListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('BranchListComponent | onSearch');
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  // handle upload modal
  onUpload() {
    console.log('BranchListComponent | onUpload');
    if(this.allowCreate){
      const modalRef = this.modal.open(BranchUploadModalComponent, {
        width: '80%',
        maxHeight: '100%',
        maxWidth: '500px',
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.onSearch()
        }
      })
    } else {
      this.authService.blockPageAction()
    }
  }
  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('BranchListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.branchService.getBranchList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (data: any) => {
          try {
            console.table(data);
            this.branches = data.data;
            this.paginatorProps.length = data.count;
          } catch (error) {
            console.table(error);
            this.branches = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
          } 
        },
        error => {
          try {
            console.table(error);
            this.branches = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'branchListScreen.loadFailed',
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
          if (this.table) {
            this.table.renderRows();
          }
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
