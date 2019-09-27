import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { constants } from 'src/app/shared/common/constants';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { ApprovalService } from 'src/app/shared/services/approval.service';
import { ApprovalTab } from 'src/app/shared/models/approval-tab';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { WarningSnackbarComponent } from 'src/app/shared/components/warning-snackbar/warning-snackbar.component';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps };
  loading = false;
  filterForm: FormGroup = new FormGroup({
    startDate: new FormControl(null, CustomValidation.maxToday),
    endDate: new FormControl(null, CustomValidation.maxToday),
    search: new FormControl('')
  }, {
      validators: [CustomValidation.dateRangeValidaton, CustomValidation.dateRangeRequiredValidaton]
    })
  selectedTabIndex = -1;
  allowPublish = true;
  approvalType = constants.approvalType
  featureTags = constants.features
  approvalStatus = constants.approvalStatus
  now = new Date()
  tabs = [
    {
      type: this.approvalType.specialOffer,
      featureName: this.featureTags.specialOffer,
      title: 'approvalListScreen.tabsTitle.specialOffer',
      count: null,
      allowPublish: false,
      tableColumns: [
        'checkbox',
        'preview',
        'title',
        'endDate',
        'createdDate',
        'actions',
        'detailsLink'
      ]
    }
  ]
  shownTabs = []
  selectedRows = [];
  data = [];
  isFocusedStartDate = false;
  isFocusedEndDate = false;
  isFocusedSearch = false;
  shouldFocusStartDate = false;
  shouldFocusEndDate = false;
  shouldFocusSearch = false;

  private table: any;
  @ViewChild('table') set tabl(table: ElementRef) {
    this.table = table;
  }

  private startDateInput: ElementRef;
  @ViewChild('startDateInput') set startDateInpt(input: ElementRef) {
    this.startDateInput = input;
  }

  private endDateInput: ElementRef;
  @ViewChild('endDateInput') set endDateInpt(input: ElementRef) {
    this.endDateInput = input;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searchInpt(input: ElementRef) {
    this.searchInput = input;
  }

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private approvalService: ApprovalService,
    private specialOfferService: SpecialOfferService
  ) { }

  ngOnInit() {
    console.log('ApprovalListComponent | ngOnInit');
    this.initTabs()
  }

  // start date form control getter
  get startDate() {
    return this.filterForm.get('startDate')
  }

  // start date form control getter
  get endDate() {
    return this.filterForm.get('endDate')
  }

  // start date form control getter
  get search() {
    return this.filterForm.get('search')
  }

  // call api to get tabs
  initTabs() {
    console.log('ApprovalListComponent | resetPage')
    this.loading = true
    this.filterForm.disable({ emitEvent: false })
    this.filterForm.reset({ emitEvent: false })
    this.filterForm.valueChanges.subscribe(value => {
      console.log('valueChanges')
      if (this.filterForm.valid) {
        this.loadData()
      } else {
        this.resetPage()
        this.resetTable()
        if (this.filterForm.errors && this.filterForm.errors.dateRange) {
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'invalidForm',
              content: {
                text: 'forms.date.errorRange',
                data: null
              }
            }
          })
        }
      }
    })

    this.approvalService.getApprovalTabs().subscribe(
      response => {
        try {
          console.table(response)
          this.shownTabs = []
          let tabs: ApprovalTab[] = response.data
          for (let tabData of this.tabs) {
            let tab = tabs.find((el) => {
              return el.unique_tag === tabData.type
            })
            if (tab && this.authService.getPublishPrvg(tabData.featureName)) {
              let showTab = { ...tabData }
              showTab.allowPublish = true
              showTab.count = tab.count
              this.shownTabs.push(showTab)
            }
          }
          if (this.shownTabs.length <= 0) {
            this.loading = false
            this.filterForm.enable({ emitEvent: false })
            this.authService.blockOpenPage()
          } else {
            this.selectedTabIndex = 0
            this.loadData(false)
          }
        } catch (error) {
          console.error(error)
          this.loading = false
          this.filterForm.enable({ emitEvent: false })
        }
      }, error => {
        try {
          console.table(error)
          this.loading = false
          this.filterForm.enable({ emitEvent: false })
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'approvalListScreen.getTabsFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.error(error)
          this.loading = false
          this.filterForm.enable({ emitEvent: false })
        }
      }
    )
  }

  // set page to first page and empty table
  resetPage() {
    console.log('ApprovalListComponent | resetPage')
    this.paginatorProps.pageIndex = 0
    this.paginatorProps.length = 0;
  }

  // empty table
  resetTable() {
    console.log('ApprovalListComponent | resetPage')
    this.data = []
    if (this.table) {
      this.table.renderRows()
    }
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('ApprovalListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.loadData()
  }

  // event handler for changing tab
  onChangeTabIndex(index) {
    console.log('ApprovalListComponent | onChangeTabIndex');
    this.shouldFocusEndDate = this.isFocusedEndDate
    this.shouldFocusSearch = this.isFocusedSearch
    this.shouldFocusStartDate = this.isFocusedStartDate
    this.loading = true
    this.selectedTabIndex = index;
    this.paginatorProps.pageSize = 10
    this.resetPage()
    // the value change subscription will call load data
    this.filterForm.reset();
  }

  // handle checkbox change for each row to select or deselect request
  onChangeSelect(e, row) {
    console.log('ApprovalListComponent | onChangeSelect');
    if (e.checked) {
      row.isSelected = true
      this.selectedRows.push(row);
    } else {
      row.isSelected = false
      let idx = this.selectedRows.findIndex(el => {
        return el.id === row.id;
      })
      if (idx > -1) {
        this.selectedRows.splice(idx, 1)
      }
    }
  }

  // handle checkbox change for to select or deselect all row
  onChangeSelectAll(e) {
    console.log('ApprovalListComponent | onChangeSelectAll');
    if (e.checked) {
      for (let i = 0; i < this.data.length; i++) {
        let dataRow: any = this.data[i]
        if (dataRow.isSelected !== undefined) {
          if (!dataRow.isSelected) {
            dataRow.isSelected = true;
            this.selectedRows.push(dataRow)
          }
        }
      }
    } else {
      this.deselectAll()
    }
  }

  // deselect all rows
  deselectAll() {
    console.log('ApprovalListComponent | deselectAll');
    this.selectedRows = [];
    for (let i = 0; i < this.data.length; i++) {
      let dataRow: any = this.data[i]
      if (dataRow.isSelected !== undefined) {
        dataRow.isSelected = false
      }
    }
  }

  // approve selected rows
  approveSelectedData() {
    console.log('ApprovalListComponent | approveSelectedData')
    if (this.isSelectedTabSpecialOffer()) {
      this.approveSelectedSpecialOffer()
    }
  }

  // reject selected rows
  rejectSelectedData() {
    console.log('ApprovalListComponent | rejectSelectedData')
    if (this.isSelectedTabSpecialOffer()) {
      this.rejectSelectedSpecialOffer()
    }
  }

  // check special offer active status before reject
  rejectSpecialOffer(offer) {
    console.log('ApprovalListComponent | rejectSpecialOffer')
    if (this.isActiveSpecialOffer(offer)) {
      this.bulkRejectSpecialOffer([offer],
        'approvalListScreen.successReject.specialOffer',
        'approvalListScreen.rejectFailed.specialOffer',
        '')
    } else {
      const warnSnackbar = this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: {
          title: 'approvalListScreen.specialOfferNotActive.title.single',
          content: {
            text: 'approvalListScreen.specialOfferNotActive.content'
          }
        }
      })
      warnSnackbar.afterDismissed().subscribe(() => {
        this.bulkRejectSpecialOffer([offer],
          'approvalListScreen.successReject.specialOffer',
          'approvalListScreen.rejectFailed.specialOffer',
          '')
      })
    }
  }

  // check all special offer active status before approving
  rejectSelectedSpecialOffer() {
    console.log('ApprovalListComponent | approveSelectedSpecialOffer')
    let isAllActive = true
    for (let row of this.selectedRows) {
      isAllActive = (isAllActive && this.isActiveSpecialOffer(row))
      if (!isAllActive) {
        break
      }
    }
    if (isAllActive) {
      this.bulkRejectSpecialOffer(this.selectedRows,
        'approvalListScreen.successBulkReject.specialOffer',
        'approvalListScreen.bulkRejectFailed.specialOffer',
        'approvalListScreen.totalFailed.specialOffer')
    } else {
      const warnSnackbar = this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: {
          title: 'approvalListScreen.specialOfferNotActive.title.bulk',
          content: {
            text: 'approvalListScreen.specialOfferNotActive.content'
          }
        }
      })
      warnSnackbar.afterDismissed().subscribe(() => {
        this.bulkRejectSpecialOffer(this.selectedRows,
          'approvalListScreen.successBulkReject.specialOffer',
          'approvalListScreen.bulkRejectFailed.specialOffer',
          'approvalListScreen.totalFailed.specialOffer')
      })
    }
  }

  // call bulk approve special offer api
  bulkRejectSpecialOffer(data, successText, errorText, totalFailedText) {
    console.log('ApprovalListComponent | bulkRejectSpecialOffer')
    this.loading = true
    data = data.map(el => {
      return { ...el, status: this.approvalStatus.rejected }
    })
    this.specialOfferService.bulkRejectSpecialOffer(data).subscribe(
      response => {
        try {
          console.table(response)
          if (response.data.rowUpdated < data.length) {
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: errorText,
                content: {
                  text: totalFailedText,
                  data: {
                    totalFailed: data.length
                  }
                }
              }
            })
          } else {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: successText,
                  data: null
                }
              }
            })
          }
          this.loadData()
        } catch (error) {
          console.error(error)
          this.loading = false;
        }
      }, error => {
        try {
          console.table(error)
          this.loading = false
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: errorText,
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.error(error)
        }
      }
    )
  }

  // check special offer active status before approving
  approveSpecialOffer(offer) {
    console.log('ApprovalListComponent | rejectSpecialOffer')
    if (this.isActiveSpecialOffer(offer)) {
      this.bulkApproveSpecialOffer([offer],
        'approvalListScreen.successApprove.specialOffer',
        'approvalListScreen.approveFailed.specialOffer',
        '')
    } else {
      const warnSnackbar = this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: {
          title: 'approvalListScreen.specialOfferNotActive.title.single',
          content: {
            text: 'approvalListScreen.specialOfferNotActive.content'
          }
        }
      })
      warnSnackbar.afterDismissed().subscribe(() => {
        this.bulkApproveSpecialOffer([offer],
          'approvalListScreen.successApprove.specialOffer',
          'approvalListScreen.approveFailed.specialOffer',
          '')
      })
    }
  }

  // check all special offer active status before approving
  approveSelectedSpecialOffer() {
    console.log('ApprovalListComponent | approveSelectedSpecialOffer')
    let isAllActive = true
    for (let row of this.selectedRows) {
      isAllActive = (isAllActive && this.isActiveSpecialOffer(row))
      if (!isAllActive) {
        break
      }
    }
    if (isAllActive) {
      this.bulkApproveSpecialOffer(this.selectedRows,
        'approvalListScreen.successBulkApprove.specialOffer',
        'approvalListScreen.bulkApproveFailed.specialOffer',
        'approvalListScreen.totalFailed.specialOffer')
    } else {
      const warnSnackbar = this.snackBar.openFromComponent(WarningSnackbarComponent, {
        data: {
          title: 'approvalListScreen.specialOfferNotActive.title.bulk',
          content: {
            text: 'approvalListScreen.specialOfferNotActive.content'
          }
        }
      })
      warnSnackbar.afterDismissed().subscribe(() => {
        this.bulkApproveSpecialOffer(this.selectedRows,
          'approvalListScreen.successBulkApprove.specialOffer',
          'approvalListScreen.bulkApproveFailed.specialOffer',
          'approvalListScreen.totalFailed.specialOffer')
      })
    }
  }

  // call bulk approve special offer api
  bulkApproveSpecialOffer(data, successText, errorText, totalFailedText) {
    console.log('ApprovalListComponent | bulkApproveSpecialOffer')
    this.loading = true
    data = data.map(el => {
      return { ...el, status: this.approvalStatus.approved }
    })
    this.specialOfferService.bulkApproveSpecialOffer(data).subscribe(
      response => {
        try {
          console.table(response)
          if (response.data.rowUpdated < data.length) {
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: errorText,
                content: {
                  text: totalFailedText,
                  data: {
                    totalFailed: data.length
                  }
                }
              }
            })
          } else {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: successText,
                  data: null
                }
              }
            })
          }
          this.loadData()
        } catch (error) {
          console.error(error)
          this.loading = false;
        }
      }, error => {
        try {
          console.table(error)
          this.loading = false
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: errorText,
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.error(error)
        }
      }
    )
  }

  // method to check whether special offer is active before approval
  isActiveSpecialOffer(specialOffer) {
    let now = new Date()
    now.setSeconds(0, 0)
    return new Date(specialOffer.end_date).getTime() > now.getTime()
  }

  // conditioning load data based on selected tab type
  loadData(shouldRefreshCount = true) {
    console.log('ApprovalListComponent | loadData');
    if (shouldRefreshCount) {
      if (!this.loading) {
        this.shouldFocusEndDate = this.isFocusedEndDate
        this.shouldFocusSearch = this.isFocusedSearch
        this.shouldFocusStartDate = this.isFocusedStartDate
        this.loading = true
        this.filterForm.disable({ emitEvent: false })
      }
      this.approvalService.getApprovalTabs().subscribe(
        response => {
          try {
            let tabs: ApprovalTab[] = response.data
            for (let i = 0; i < this.shownTabs.length; i++) {
              let tabData = this.shownTabs[i]
              let tab = tabs.find((el) => {
                return el.unique_tag === tabData.type
              })
              if (tab) {
                tabData.count = tab.count
              }
            }
          } catch (error) {
            console.error(error)
          }
        }, error => {
          try {
            console.table(error)
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'approvalListScreen.refreshCountFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.error(error)
          }
        }
      ).add(() => {
        if (this.isSelectedTabSpecialOffer()) {
          this.loadSpecialOffer()
        }
      })
    } else {
      if (this.isSelectedTabSpecialOffer()) {
        this.loadSpecialOffer()
      }
    }
  }

  // load special offer list
  loadSpecialOffer() {
    console.log('ApprovalListComponent | loadSpecialOffer');
    if (!this.loading) {
      this.shouldFocusEndDate = this.isFocusedEndDate
      this.shouldFocusSearch = this.isFocusedSearch
      this.shouldFocusStartDate = this.isFocusedStartDate
      this.loading = true
      this.filterForm.disable({ emitEvent: false })
    }
    const formDataValue = this.filterForm.getRawValue()
    this.approvalService.getSpecialOfferApproval(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      formDataValue.search,
      formDataValue.startDate,
      formDataValue.endDate ? new Date(formDataValue.endDate).setHours(23, 59, 59) : null
    ).subscribe(
      response => {
        try {
          console.table(response.data.data)
          this.data = response.data.data
          this.paginatorProps.length = response.data.count
          this.afterSuccesLoad()
        } catch (error) {
          console.error(error)
        }
      }, error => {
        try {
          console.table(error);
          this.resetPage()
          this.resetTable()
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'approvalListScreen.loadFailed.specialOffer',
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
    ).add(() => {
      this.afterLoad()
    })
  }

  // method to initialize selection and render table
  afterSuccesLoad() {
    console.log('ApprovalListComponent | afterLoad');
    this.data = this.data.map(el => {
      return { ...el, isSelected: false }
    })

    if (this.table) {
      this.table.renderRows()
    }
  }

  // method to off the loading and restore focus to input
  afterLoad() {
    console.log('ApprovalListComponent | afterLoad')
    this.selectedRows = []
    this.loading = false
    this.filterForm.enable({ emitEvent: false })
    if (this.shouldFocusStartDate && this.startDateInput) {
      setTimeout(() => {
        this.startDateInput.nativeElement.focus();
      });
    } else if (this.shouldFocusEndDate && this.endDateInput) {
      setTimeout(() => {
        this.endDateInput.nativeElement.focus();
      });
    } else if (this.shouldFocusSearch && this.searchInput) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    }
  }

  // method to check whether the current selected tab is a specialoffer tab or not
  isSelectedTabSpecialOffer() {
    console.log('ApprovalListComponent | isSelectedTabSpecialOffer');
    return this.isSelectedTab(this.approvalType.specialOffer)
  }

  // method to check whether the current selected tab type is a passed argument type
  isSelectedTab(type) {
    console.log('ApprovalListComponent | isSelectedTab');
    let selectedTab = this.tabs[this.selectedTabIndex]
    return selectedTab && selectedTab.type === type
  }
}
