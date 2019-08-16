import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { constants } from 'src/app/shared/common/constants';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }
  loading = false;
  filterForm: FormGroup = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    search: new FormControl('')
  }, {
      validators: CustomValidation.dateRangeValidaton
    })
  selectedTabIndex = -1;
  allowPublish = true;
  tabs = [
    {
      type: 'specialoffer',
      count: 3,
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
  selectedRows = [];
  data = [];
  isFocusedStartDate = false;
  isFocusedEndDate = false;
  isFocusedSearch = false;

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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log('ApprovalListComponent | ngOnInit');
    this.filterForm.valueChanges.subscribe(value => {
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
    this.onChangeTabIndex(0);
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

  onChangeTabIndex(index) {
    console.log('ApprovalListComponent | onChangeTabIndex');
    this.loading = true
    this.selectedTabIndex = index;
    // the value change subscription will call load data
    this.paginatorProps.pageSize = 10
    this.resetPage()
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

  loadData() {
    console.log('ApprovalListComponent | loadData');
    if (this.isSelectedTabSpecialOffer()) {
      this.loadSpecialOffer()
    }
  }

  loadSpecialOffer() {
    console.log('ApprovalListComponent | loadSpecialOffer');
    this.data = [
      {
        created_by: "dimpudus@id.ibm.com",
        created_dt: "2019-08-06T09:24:04.000Z",
        end_date: "2019-08-28T11:00:00.000Z",
        id: "6004149b-0be6-43fe-a87c-461e083e146f",
        modified_by: "dimpudus@id.ibm.com",
        modified_dt: "2019-08-06T09:28:02.000Z",
        sp_offer_image: "http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/special-offer/special-offer_2019080616240311.png",
        status: 1,
        title: "Penawaran Spesial di Electronic City!",
      },
      {
        created_by: "natashajanicetambunan@gmail.com",
        created_dt: "2019-07-23T04:06:23.000Z",
        end_date: "2019-08-23T15:22:00.000Z",
        id: "1847ec92-1513-4887-952c-87dfdd9f580",
        modified_by: "natashajanicetambunan@gmail.com",
        modified_dt: "2019-08-15T05:07:00.000Z",
        sp_offer_image: "http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/special-offer/special-offer_2019072311062172.jpeg",
        status: 1,
        title: "test lusi"
      },
      {
        created_by: "dimpudus@id.ibm.com",
        created_dt: "2019-08-06T09:24:04.000Z",
        end_date: "2019-08-28T11:00:00.000Z",
        id: "6004149b-0be6-43fe-a87c-461e083e14g",
        modified_by: "dimpudus@id.ibm.com",
        modified_dt: "2019-08-06T09:28:02.000Z",
        sp_offer_image: "http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/special-offer/special-offer_2019080616240311.png",
        status: 1,
        title: "Penawaran Spesial di Electronic City!",
      },
      {
        created_by: "natashajanicetambunan@gmail.com",
        created_dt: "2019-07-23T04:06:23.000Z",
        end_date: "2019-08-23T15:22:00.000Z",
        id: "1847ec92-1513-4887-952c-as",
        modified_by: "natashajanicetambunan@gmail.com",
        modified_dt: "2019-08-15T05:07:00.000Z",
        sp_offer_image: "http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/special-offer/special-offer_2019072311062172.jpeg",
        status: 1,
        title: "test lusi"
      },
      {
        created_by: "dimpudus@id.ibm.com",
        created_dt: "2019-08-06T09:24:04.000Z",
        end_date: "2019-08-28T11:00:00.000Z",
        id: "6004149b-0be6-43fe-a87c-461e0gwr83e146f",
        modified_by: "dimpudus@id.ibm.com",
        modified_dt: "2019-08-06T09:28:02.000Z",
        sp_offer_image: "http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/special-offer/special-offer_2019080616240311.png",
        status: 1,
        title: "Penawaran Spesial di Electronic City!",
      },
      {
        created_by: "natashajanicetambunan@gmail.com",
        created_dt: "2019-07-23T04:06:23.000Z",
        end_date: "2019-08-23T15:22:00.000Z",
        id: "1847ec92-1513-4887-952c-87dfdhbBd9f580f",
        modified_by: "natashajanicetambunan@gmail.com",
        modified_dt: "2019-08-15T05:07:00.000Z",
        sp_offer_image: "http://adira-akses-dev.oss-ap-southeast-5.aliyuncs.com/special-offer/special-offer_2019072311062172.jpeg",
        status: 1,
        title: "test lusi"
      }
    ]

    this.loading = false;
    this.data = this.data.map(el => {
      return {...el, isSelected: false}
    })

    if(this.table){
      this.table.renderRows()
    }
  }

  isSelectedTabSpecialOffer(){
    console.log('ApprovalListComponent | isSelectedTabSpecialOffer');
    return this.isSelectedTab(constants.approvalType.speciaOffer)
  }

  isSelectedTab(type){
    console.log('ApprovalListComponent | isSelectedTab');
    let selectedTab = this.tabs[this.selectedTabIndex]
    return selectedTab && selectedTab.type === type
  }
}
