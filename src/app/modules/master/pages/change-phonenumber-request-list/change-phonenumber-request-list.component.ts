import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangePhonenumberRequestService } from '../../services/change-phonenumber-request.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { RemarkInputModalComponent } from '../../components/remark-input-modal/remark-input-modal.component';
import { ChangePhoneNumberRequest } from '../../models/change-phone-number-request';

@Component({
  selector: 'app-change-phonenumber-request-list',
  templateUrl: './change-phonenumber-request-list.component.html',
  styleUrls: ['./change-phonenumber-request-list.component.scss']
})
export class ChangePhonenumberRequestListComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }
  action = {
    approved: 'Accepted',
    rejected: 'Rejected'
  }
  status = {
    closed: 'Closed'
  }

  requestColumns: string[] = [
    'selection',
    'requestDate',
    'customerName',
    'requestDuration',
    'oldPhoneNumber',
    'newPhoneNumber',
    'lastUpdated',
    'actionsStatus',
    'remark'
  ]

  requests: ChangePhoneNumberRequest[] = [];
  search = '';
  closeText = '';
  loading = false;
  isFocusedInput = false;
  now: Date = new Date();
  selectableRequestCount = 0;
  selectedRequests = [];

  private table: any;
  @ViewChild('requestsTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private requestService: ChangePhonenumberRequestService,
    private snackBar: MatSnackBar,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    console.log('ChangePhonenumberRequestListComponent | ngOnInit');
    this.lazyLoadData()
    this.now = new Date();
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('ChangePhonenumberRequestListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('ChangePhonenumberRequestListComponent | onSearch');
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  // handle checkbox change for each row to select or deselect request
  onChangeSelect(e, request) {
    console.log('ChangePhonenumberRequestListComponent | onChangeSelect');
    if (e.checked) {
      request.isSelected = true;
      this.selectedRequests.push(request);
    } else {
      request.isSelected = false;
      let index = this.selectedRequests.findIndex(el => {
        return el.id === request.id;
      })
      if (index > -1) {
        this.selectedRequests.splice(index, 1)
      }
    }
    console.log(this.selectedRequests)
  }

  // handle checkbox change for to select all or deselect all requests
  onChangeSelectAll(e) {
    console.log('ChangePhonenumberRequestListComponent | onChangeSelectAll');
    if (e.checked) {
      for (let i = 0; i < this.requests.length; i++) {
        let req: any = this.requests[i]
        if (req.status === null || req.status === '') {
          if (typeof req.isSelected !== 'undefined') {
            if (!req.isSelected) {
              req.isSelected = true;
              this.selectedRequests.push(req)
            }
          }
        }
      }
    } else {
      this.deselectAll()
    }
  }

  deselectAll(){
    this.selectedRequests = [];
    for (let i = 0; i < this.requests.length; i++) {
      let req: any = this.requests[i]
      if (req.status === null || req.status === '') {
        if (typeof req.isSelected !== 'undefined') {
          req.isSelected = false
        }
      }
    }
  }

  // reject one request
  rejectRequest(request) {
    console.log('ChangePhonenumberRequestListComponent | rejectRequest');
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'changePhonenumberRequestListScreen.confirmationModal.reject.title',
        content: {
          string: 'changePhonenumberRequestListScreen.confirmationModal.reject.content',
          data: null
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let rejectedRequest = new ChangePhoneNumberRequest();
        rejectedRequest.id = request.id
        rejectedRequest.status = this.status.closed;
        rejectedRequest.action = this.action.rejected;
        this.requestService.bulkUpdateRequest(rejectedRequest).subscribe(
          response => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'changePhonenumberRequestListScreen.rejectSuccess',
                  data: null
                }
              }
            })
            this.lazyLoadData();
          }, error => {
            try {
              console.table(error);
              this.loading = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'changePhonenumberRequestListScreen.rejectFailed',
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
        )
      }
    })
  }

  // approve one request
  approveRequest(request) {
    console.log('ChangePhonenumberRequestListComponent | approveRequest');
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'changePhonenumberRequestListScreen.confirmationModal.approve.title',
        content: {
          string: 'changePhonenumberRequestListScreen.confirmationModal.approve.content',
          data: null
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let approvedRequest = new ChangePhoneNumberRequest();
        approvedRequest.id = request.id
        approvedRequest.status = this.status.closed;
        approvedRequest.action = this.action.approved;
        this.requestService.bulkUpdateRequest(approvedRequest).subscribe(
          response => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'changePhonenumberRequestListScreen.approveSuccess',
                  data: null
                }
              }
            })
            this.lazyLoadData();
          }, error => {
            try {
              console.table(error);
              this.loading = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'changePhonenumberRequestListScreen.approveFailed',
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
        )
      }
    })
  }

  //reject selected requests,
  bulkRejectRequest() {
    console.log('ChangePhonenumberRequestListComponent | bulkRejectRequest');
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'changePhonenumberRequestListScreen.confirmationModal.reject.title',
        content: {
          string: 'changePhonenumberRequestListScreen.confirmationModal.reject.content',
          data: null
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let rejectedRequests = this.selectedRequests.map(el => {
          let req = new ChangePhoneNumberRequest()
          req.id = el.id;
          req.status = this.status.closed;
          req.action = this.action.rejected;
          return req;
        });
        this.requestService.bulkUpdateRequest(rejectedRequests).subscribe(
          response => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'changePhonenumberRequestListScreen.bulkRejectSuccess',
                  data: {
                    totalRequest: this.selectedRequests.length
                  }
                }
              }
            })
            this.lazyLoadData();
          }, error => {
            try {
              console.table(error);
              this.loading = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'changePhonenumberRequestListScreen.bulkRejectFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                    data: {
                      totalRequest: this.selectedRequests.length
                    }
                  }
                }
              })
            } catch (error) {
              console.log(error)
            }
          }
        )
      }
    })
  }

  //approve selected requests
  bulkApproveRequest() {
    console.log('ChangePhonenumberRequestListComponent | bulkApproveRequest');
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'changePhonenumberRequestListScreen.confirmationModal.approve.title',
        content: {
          string: 'changePhonenumberRequestListScreen.confirmationModal.approve.content',
          data: null
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let approvedRequests = this.selectedRequests.map(el => {
          let req = new ChangePhoneNumberRequest()
          req.id = el.id;
          req.status = this.status.closed;
          req.action = this.action.approved;
          return req;
        });
        this.requestService.bulkUpdateRequest(approvedRequests).subscribe(
          response => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'changePhonenumberRequestListScreen.bulkApproveSuccess',
                  data: {
                    totalRequest: this.selectedRequests.length
                  }
                }
              }
            })
            this.lazyLoadData();
          }, error => {
            try {
              console.table(error);
              this.loading = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'changePhonenumberRequestListScreen.bulkApproveFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                    data: {
                      totalRequest: this.selectedRequests.length
                    }
                  }
                }
              })
            } catch (error) {
              console.log(error)
            }
          }
        )
      }
    })
  }

  // count number of request that not yet approved or rejected
  countSelectableRequest() {
    console.log('ChangePhonenumberRequestListComponent | countSelectableRequest');
    this.selectableRequestCount = 0;
    this.requests = this.requests.map(el => {
      let request = el;
      if (request.status === null) {
        request = Object.assign({ isSelected: false }, request)
        this.selectableRequestCount += 1;
      }
      return request;
    })
  }

  // show modal to edit remark for rejected request
  editRemark(request) {
    console.log('ChangePhonenumberRequestListComponent | editRemark');
    const modalRef = this.modal.open(RemarkInputModalComponent, {
      data: {
        request: request
      }
    })

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.lazyLoadData();
      }
    })
  }

// count duration from now to request request date
  getDurationText(request: ChangePhoneNumberRequest) {
    console.log('ChangePhonenumberRequestListComponent | getDuration');
    let duration = { 
      day: request.request_age_days, 
      hour: request.request_age_hours, 
      min: request.request_age_minutes
    }
    if (duration.day > 0) {
      return {
        text: 'duration.fromDayToMin',
        duration: duration
      }
    } else if (duration.hour > 0) {
      return {
        text: 'duration.fromHourToMin',
        duration: duration
      }
    } else {
      return {
        text: 'duration.inMin',
        duration: duration
      }
    } 
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('ChangePhonenumberRequestListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.requestService.getRequestList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (response: any) => {
          try {
            console.table(response);
            this.requests = response.data;
            this.paginatorProps.length = response.count;
            this.selectedRequests = [];
            this.countSelectableRequest();
            this.now = new Date();
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
                title: 'changePhonenumberRequestListScreen.loadFailed',
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
