import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { TransactionReport } from '../../models/transaction-report';
import { constants } from 'src/app/shared/common/constants';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { MatSnackBar } from '@angular/material';
import { ReportService } from '../../services/report.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-trans-report',
  templateUrl: './trans-report.component.html',
  styleUrls: ['./trans-report.component.scss']
})
export class TransReportComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps};

  transactionColumns: string[] = [
    'oid',
    'vaNumber',
    'customerName',
    'mobileNumber',
    'transactionCode',
    'transactionType',
    'installmentAmount',
    'penaltyFee',
    'fee',
    'withdrawalAmount',
    'withdrawalFee',
    'bankTransferFee',
    'ppn',
    'topUpAmount',
    'transactionSequence',
    'vaName',
    'sourceVa',
    'destinationVa',
    'transactionDate'
  ]

  transactionType = constants.transactionType;

  locale = 'id';
  transactions: TransactionReport[] = [];
  loading = false;
  isFocusedStartDate = false;
  isFocusedEndDate = false;
  isFocusedSearch = false;
  allowDownload = false;
  filterForm: FormGroup;
  searchValidation = CustomValidation.transactionSearch
  now = new Date()

  private table: any;
  @ViewChild('transactionTable') set tabl(table: ElementRef) {
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

  // constructor
  constructor(
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private reportService: ReportService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    console.log('TransReportComponent | constructor')
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

  // component on init
  ngOnInit() {
    console.log('TransReportComponent | ngOnInit')
    this.translateService.get('angularLocale').subscribe(res => {
      this.locale = res;
    });
    let prvg = this.authService.getFeaturePrivilege(constants.features.transactionReport)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.allowDownload = this.authService.getFeatureDownloadPrvg(prvg)
      this.filterForm = new FormGroup({
        startDate: new FormControl(null, [Validators.required, CustomValidation.maxToday]),
        endDate: new FormControl(null, [Validators.required, CustomValidation.maxToday]),
        search: new FormControl('', [Validators.required, Validators.minLength(this.searchValidation.minLength)])
      }, {
          validators: CustomValidation.dateRangeValidaton
        })
  
      this.filterForm.valueChanges.subscribe(value => {
        if (this.filterForm.valid) {
          this.loadData()
        } else {
          this.resetPage()
          this.resetTable()
          if (this.filterForm.errors && this.filterForm.errors.dateRange) {
            this.showFormError('forms.date.errorRange')
          }
        }
      })
    } else {
      this.authService.blockOpenPage()
    }
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('TransReportComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    if (!this.filterForm.valid) {
      this.resetPage()
      this.resetTable()
    } else {
      this.loadData()
    }
  }

  // set page to first page and empty table
  resetPage() {
    console.log('TransReportComponent | resetPage')
    this.paginatorProps.pageIndex = 0
    this.paginatorProps.length = 0;
  }

  // empty table
  resetTable() {
    console.log('TransReportComponent | resetPage')
    this.transactions = []
    if (this.table) {
      this.table.renderRows()
    }
  }

  // show form error in snackbar
  showFormError(errorText) {
    console.log('TransReportComponent | editNotifError')
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'invalidForm',
        content: {
          text: errorText,
          data: null
        }
      }
    })
  }

  // parse download link with 
  getDownloadLink() {
    console.log('TransReportComponent | getDownloadLink')
    return this.reportService.parseDownloadLink(this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd'),
    this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd'),
    this.search.value)
  }

  // call api to load data by filter
  loadData() {
    console.log('TransReportComponent | loadData')
    let isFocusedEndDate = this.isFocusedEndDate
    let isFocusedSearch = this.isFocusedSearch
    let isFocusedStartDate =this.isFocusedStartDate
    this.loading = true
    this.filterForm.disable({emitEvent: false})
    this.reportService.getTransactionReport(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd'),
      this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd'),
      this.search.value
    ).subscribe(
      response => {
        try {
          console.table(response)
          this.transactions = response.data
          this.paginatorProps.length = response.count;
          if (this.table) {
            this.table.renderRows();
          }
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
              title: 'transactionReport.loadFailed',
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
        this.filterForm.enable({emitEvent: false})
        if (isFocusedStartDate && this.startDateInput) {
          setTimeout(() => {
            this.startDateInput.nativeElement.focus();
          });
        } else if (isFocusedEndDate && this.endDateInput) {
          setTimeout(() => {
            this.endDateInput.nativeElement.focus();
          });
        } else if (isFocusedSearch && this.searchInput) {
          setTimeout(() => {
            this.searchInput.nativeElement.focus();
          });
        }
      }
    )
  }



}
