import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangePhonenumberRequestService } from '../../services/change-phonenumber-request.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ChangePhonenumberRequestRejectedRemarkInputModalComponent } from '../../components/change-phonenumber-request-rejected-remark-input-modal/change-phonenumber-request-rejected-remark-input-modal.component';

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

  requests = [
    {
      id: 'id1',
      requestDate: new Date(2019, 3, 4, 12, 1, 5),
      customerName: "Customer Name 1",
      oldPhoneNumber: "081231231231",
      newPhoneNumber: "087637456734",
      lastUpdatedDate: new Date(2019, 3, 4, 13, 2, 40),
      lastUpdatedBy: 'Name 1',
      status: null,
      remark: ''
    },
    {
      id: 'id5',
      requestDate: new Date(2019, 3, 3, 12, 1, 5),
      customerName: "Customer Name 1",
      oldPhoneNumber: "081231231231",
      newPhoneNumber: "087637456734",
      lastUpdatedDate: new Date(2019, 3, 3, 13, 2, 40),
      lastUpdatedBy: 'Name 1',
      status: null,
      remark: ''
    },
    {
      id: 'id2',
      requestDate: new Date(2019, 1, 2, 12, 1, 5),
      customerName: "Customer Name 3",
      oldPhoneNumber: "081231231231",
      newPhoneNumber: "087637456734",
      lastUpdatedDate: new Date(2019, 3, 3, 13, 2, 40),
      lastUpdatedBy: 'Name 2',
      status: "approved",
      remark: ''
    },
    {
      id: 'id3',
      requestDate: new Date(2019, 2, 3, 12, 1, 5),
      customerName: "Customer Name 4",
      oldPhoneNumber: "081231231231",
      newPhoneNumber: "087637456734",
      lastUpdatedDate: new Date(2019, 3, 3, 13, 2, 40),
      lastUpdatedBy: 'Name 3',
      status: "rejected",
      remark: null
    },
    {
      id: 'id4',
      requestDate: new Date(2019, 2, 4, 12, 1, 5),
      customerName: "Customer Name 5",
      oldPhoneNumber: "081231231231",
      newPhoneNumber: "087637456734",
      lastUpdatedDate: new Date(2019, 3, 3, 13, 2, 40),
      lastUpdatedBy: 'Name 4',
      status: "rejected",
      remark: "test"
    }
  ];
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
    // this.lazyLoadData()
    this.selectedRequests = [];
    this.countSelectableRequest();
    this.now = new Date();
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('ChangePhonenumberRequestListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    // this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('ChangePhonenumberRequestListComponent | onSearch');
    // if (this.paginatorProps.pageIndex !== 0) {
    //   //this will call paginator change
    //   this.paginatorProps.pageIndex = 0;
    // } else {
    //   this.lazyLoadData();
    // }
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
      // if (result) {
      //   this.loading = true;
      //   let rejectedRequest = Object.assign({}, request);
      //   rejectedRequest.status = 'rejected';
      //   this.requestService.updateRequest(rejectedRequest).subscribe(
      //     result => {
      //       this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      //         data: {
      //           title: 'success',
      //           content: {
      //             text: 'changePhonenumberRequestListScreen.rejectSuccess',
      //             data: null
      //           }
      //         }
      //       })
      //       this.lazyLoadData();
      //     }, error => {
      //       try {
      //         console.table(error);
      //         this.loading = false;
      //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      //           data: {
      //             title: 'changePhonenumberRequestListScreen.rejectFailed',
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
      //   )
      // }
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
    // modalRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loading = true;
    //     let approvedRequest = Object.assign({}, request);
    //     approvedRequest.status = 'approve';
    //     this.requestService.updateRequest(approvedRequest).subscribe(
    //       result => {
    //         this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //           data: {
    //             title: 'success',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.approveSuccess',
    //               data: null
    //             }
    //           }
    //         })
    //         this.lazyLoadData();
    //       }, error => {
    //         try {
    //           console.table(error);
    //           this.loading = false;
    //           this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //             data: {
    //               title: 'changePhonenumberRequestListScreen.approveFailed',
    //               content: {
    //                 text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //                 data: null
    //               }
    //             }
    //           })
    //         } catch (error) {
    //           console.log(error)
    //         }
    //       }
    //     )
    //   }
    // })
  }

  //reject selected requests, count total success and error
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
    // modalRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loading = true;
    //     let countError = 0;
    //     let rejectTasks = [];
    //     for (let i = 0; i < this.selectedRequests.length; i++) {
    //       let rejectedRequest = Object.assign({}, this.selectedRequests[i])
    //       rejectedRequest.status = 'reject';
    //       rejectTasks.push(
    //         this.requestService.updateRequest(rejectedRequest).pipe(map(res => res), catchError(e => of(e)))
    //       )
    //     }
    //     forkJoin(rejectTasks).subscribe(result => {
    //       console.table(result)
    //       for (let res of result) {
    //         if (result instanceof HttpErrorResponse) {
    //           countError += 1;
    //         }
    //       }
    //       if (countError === 0) {
    //         this.lazyLoadData()
    //         this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //           data: {
    //             title: 'changePhonenumberRequestListScreen.rejectSuccess',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.allRejectSuccess',
    //               data: {
    //                 totalRequest: this.selectedRequests.length
    //               }
    //             }
    //           }
    //         })
    //       } else if (countError === this.selectedRequests.length) {
    //         this.loading = false;
    //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //           data: {
    //             title: 'changePhonenumberRequestListScreen.rejectFailed',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.allRejectFailed',
    //               data: {
    //                 totalRequest: this.selectedRequests.length
    //               }
    //             }
    //           }
    //         })
    //       } else {
    //         this.lazyLoadData()
    //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //           data: {
    //             title: 'changePhonenumberRequestListScreen.rejectFailed',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.partialRejectFailed',
    //               data: {
    //                 errorCount: countError,
    //                 successCount: this.selectedRequests.length - countError
    //                 totalRequest: this.selectedRequests.length
    //               }
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
  }

  //approve selected requests, count total success and error
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
    // modalRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loading = true;
    //     let countError = 0;
    //     let approveTasks = [];
    //     for (let i = 0; i < this.selectedRequests.length; i++) {
    //       let rejectedRequest = Object.assign({}, this.selectedRequests[i])
    //       rejectedRequest.status = 'approve';
    //       approveTasks.push(
    //         this.requestService.updateRequest(rejectedRequest).pipe(map(res => res), catchError(e => of(e)))
    //       )
    //     }
    //     forkJoin(approveTasks).subscribe(result => {
    //       console.table(result)
    //       for (let res of result) {
    //         if (result instanceof HttpErrorResponse) {
    //           countError += 1;
    //         }
    //       }
    //       if (countError === 0) {
    //         this.lazyLoadData()
    //         this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //           data: {
    //             title: 'changePhonenumberRequestListScreen.approveSuccess',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.allApproveSuccess',
    //               data: {
    //                 totalRequest: this.selectedRequests.length
    //               }
    //             }
    //           }
    //         })
    //       } else if (countError === this.selectedRequests.length) {
    //         this.loading = false;
    //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //           data: {
    //             title: 'changePhonenumberRequestListScreen.approveFailed',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.allApproveFailed',
    //               data: {
    //                 totalRequest: this.selectedRequests.length
    //               }
    //             }
    //           }
    //         })
    //       } else {
    //         this.lazyLoadData()
    //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //           data: {
    //             title: 'changePhonenumberRequestListScreen.approveFailed',
    //             content: {
    //               text: 'changePhonenumberRequestListScreen.partialApproveFailed',
    //               data: {
    //                 errorCount: countError,
    //                 successCount: this.selectedRequests.length - countError
    //                 totalRequest: this.selectedRequests.length
    //               }
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
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
    const modalRef = this.modal.open(ChangePhonenumberRequestRejectedRemarkInputModalComponent, {
      data: {
        request: request
      }
    })

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        // this.lazyLoadData()
      }
    })
  }

// count duration from now to request request date
  getDuration(requestDate) {
    console.log('ChangePhonenumberRequestListComponent | getDuration');
    let duration = { day: 0, hour: 0, min: 0, sec: 0 }
    let remaining = (this.now.getTime() - requestDate.getTime()) / 1000;
    duration.day = Math.floor(remaining / 86400);
    remaining = remaining % 86400;
    duration.hour = Math.floor(remaining / 3600);
    remaining = remaining % 3600;
    duration.min = Math.floor(remaining / 60);
    remaining = remaining % 60;
    duration.sec = remaining;
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
    } else if (duration.min > 0) {
      return {
        text: 'duration.inMin',
        duration: duration
      }
    } else {
      return {
        text: 'duration.sec',
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
        (result: any) => {
          try {
            console.table(result);
            this.requests = result.data;
            this.paginatorProps.length = result.count;
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
