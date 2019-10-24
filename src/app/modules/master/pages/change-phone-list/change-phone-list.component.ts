import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangePhoneService } from '../../services/change-phone.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { RemarkInputModalComponent } from '../../components/remark-input-modal/remark-input-modal.component';
import { ChangePhone } from '../../models/change-phone';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-change-phone-list',
  templateUrl: './change-phone-list.component.html',
  styleUrls: ['./change-phone-list.component.scss']
})
export class ChangePhoneListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps };
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
    'contractNo',
    'actionsStatus',
    'remark'
  ]

  requests: ChangePhone[] = [];
  search = '';
  closeText = '';
  loading = false;
  isFocusedInput = false;
  now: Date = new Date();
  selectableRequestCount = 0;
  selectedRequests = [];
  allowEdit = false;

  private table: any;
  @ViewChild('requestsTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private requestService: ChangePhoneService,
    private snackBar: MatSnackBar,
    private modal: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('ChangePhoneListComponent | ngOnInit');
    this.now = new Date();
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.changePhoneNumber)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.lazyLoadData()
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('ChangePhoneListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('ChangePhoneListComponent | onSearch');
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  // handle checkbox change for each row to select or deselect request
  onChangeSelect(e, request) {
    console.log('ChangePhoneListComponent | onChangeSelect');
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
    console.log('ChangePhoneListComponent | onChangeSelectAll');
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

  deselectAll() {
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
    console.log('ChangePhoneListComponent | rejectRequest');
    this.updateSingleRequest(request,
      'changePhonenumberRequestListScreen.confirmationModal.reject.title',
      'changePhonenumberRequestListScreen.confirmationModal.reject.content',
      this.action.rejected,
      'changePhonenumberRequestListScreen.rejectSuccess',
      'changePhonenumberRequestListScreen.rejectFailed',
      'changePhonenumberRequestListScreen.totalRequestFailed'
    )
  }

  // approve one request
  approveRequest(request) {
    console.log('ChangePhoneListComponent | approveRequest');
    this.updateSingleRequest(request,
      'changePhonenumberRequestListScreen.confirmationModal.approve.title',
      'changePhonenumberRequestListScreen.confirmationModal.approve.content',
      this.action.approved,
      'changePhonenumberRequestListScreen.approveSuccess',
      'changePhonenumberRequestListScreen.approveFailed',
      'changePhonenumberRequestListScreen.totalRequestFailed'
    )
  }

  // handle how to update single request based on aciton type
  updateSingleRequest(request, modalTitle, modalContent, action, successText, errorTitle, errorText){
    console.log('ChangePhoneListComponent | updateSingleRequest');
    let updateRequest = new ChangePhone();
    updateRequest.id = request.id
    updateRequest.status = this.status.closed;
    updateRequest.action = action;
    this.updateRequest(updateRequest, modalTitle, modalContent, successText, errorTitle, errorText)
  }

  // handle how to update several requests based on aciton type
  bulkUpdateRequest(modalTitle, modalContent, action, successText, errorTitle, errorText){
    console.log('ChangePhoneListComponent | updateSingleRequest');
    let updateRequests = this.selectedRequests.map(el => {
      let req = new ChangePhone()
      req.id = el.id;
      req.status = this.status.closed;
      req.action = action;
      return req;
    });
    this.updateRequest(updateRequests, modalTitle, modalContent, successText, errorTitle, errorText)
  }

  // call update request api
  updateRequest(requests, modalTitle, modalContent, successText, errorTitle, errorText) {
    if (this.allowEdit) {
      const modalRef = this.modal.open(ConfirmationModalComponent, {
        width: '260px',
        data: {
          title: modalTitle,
          content: {
            string: modalContent,
            data: null
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading = true;
          this.requestService.bulkUpdateRequest(requests).subscribe(
            response => {
              try {
                this.loading = false;
                let data = response.data
                if (data.fail_count === 0) {
                  this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                    data: {
                      title: 'success',
                      content: {
                        text: successText,
                        data: null
                      }
                    }
                  })
                } else {
                  this.authService.openSnackbarError(errorTitle,
                    errorText,
                    {
                      totalRequest: data.fail_count
                    })
                }
                if (data.success_count > 0) {
                  this.lazyLoadData();
                }
              } catch (error) {
                console.table(error)
              }
            }, error => {
              this.loading = false;
              this.authService.handleApiError(errorTitle, error)
            }
          )
        }
      })
    } else {
      this.authService.blockPageAction()
    }
  }

  //reject selected requests
  bulkRejectRequest() {
    console.log('ChangePhoneListComponent | bulkRejectRequest');
    this.bulkUpdateRequest(
      'changePhonenumberRequestListScreen.confirmationModal.reject.title',
      'changePhonenumberRequestListScreen.confirmationModal.reject.content',
      this.action.rejected,
      'hangePhonenumberRequestListScreen.bulkRejectSuccess',
      'changePhonenumberRequestListScreen.bulkRejectFailed',
      'changePhonenumberRequestListScreen.totalRequestFailed'
    )
  }

  //approve selected requests
  bulkApproveRequest() {
    console.log('ChangePhoneListComponent | bulkApproveRequest');
    this.bulkUpdateRequest(
      'changePhonenumberRequestListScreen.confirmationModal.approve.title',
      'changePhonenumberRequestListScreen.confirmationModal.approve.content',
      this.action.approved,
      'hangePhonenumberRequestListScreen.bulkApproveSuccess',
      'changePhonenumberRequestListScreen.bulkApproveFailed',
      'changePhonenumberRequestListScreen.totalRequestFailed'
    )
  }

  // count number of request that not yet approved or rejected
  countSelectableRequest() {
    console.log('ChangePhoneListComponent | countSelectableRequest');
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
    console.log('ChangePhoneListComponent | editRemark');
    if (this.allowEdit) {
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
    } else {
      this.authService.blockPageAction()
    }
  }

  // count duration from now to request request date
  getDurationText(request: ChangePhone) {
    console.log('ChangePhoneListComponent | getDuration');
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
    console.log('ChangePhoneListComponent | lazyLoadData');
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
          } catch (error) {
            console.table(error);
            this.requests = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
            this.selectedRequests = [];
            this.countSelectableRequest();
          }
        },
        error => {
          try {
            console.table(error);
            this.requests = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
            this.selectedRequests = [];
            this.countSelectableRequest();
            this.authService.handleApiError('changePhonenumberRequestListScreen.loadFailed', error);
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
