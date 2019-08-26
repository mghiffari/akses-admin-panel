import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { constants } from 'src/app/shared/common/constants';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { ApprovalService } from 'src/app/shared/services/approval.service';
import { ApprovalTab } from 'src/app/shared/models/approval-tab';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps };
  loading = false;
  filterForm: FormGroup = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    search: new FormControl('')
  }, {
      validators: [CustomValidation.dateRangeValidaton, CustomValidation.dateRangeRequiredValidaton]
    })
  selectedTabIndex = -1;
  allowPublish = true;
  approvalType = constants.approvalType
  featureTags = constants.features
  tabs = [
    {
      type: this.approvalType.speciaOffer,
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
    private approvalService: ApprovalService
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
      if (this.filterForm.valid) {
        this.loadData()
      } else {
        this.resetPage()
        this.resetTable()
        if (this.filterForm.errors) {
          if(this.filterForm.errors.dateRange){
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'invalidForm',
                content: {
                  text: 'forms.date.errorRange',
                  data: null
                }
              }
            })
          } else if (this.filterForm.errors.dateRangeRequired){
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'invalidForm',
                content: {
                  text: 'forms.date.errorRangeRequired',
                  data: null
                }
              }
            })
          }
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

  approveData(data) { }

  rejectData(data) { }

  bulkApproveData() { }

  bulkRejectData() { }

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
      formDataValue.endDate
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
    return this.isSelectedTab(this.approvalType.speciaOffer)
  }

  // method to check whether the current selected tab type is a passed argument type
  isSelectedTab(type) {
    console.log('ApprovalListComponent | isSelectedTab');
    let selectedTab = this.tabs[this.selectedTabIndex]
    return selectedTab && selectedTab.type === type
  }
}
