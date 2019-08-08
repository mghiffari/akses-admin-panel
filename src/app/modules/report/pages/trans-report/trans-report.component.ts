import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { TransactionReport } from '../../models/transaction-report';
import { constants } from 'src/app/shared/common/constants';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-trans-report',
  templateUrl: './trans-report.component.html',
  styleUrls: []
})
export class TransReportComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }

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
  filterForm: FormGroup;
  searchValidation = CustomValidation.transactionSearch

  // constructor
  constructor(
    private translateService: TranslateService,
    private snackBar: MatSnackBar
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
    this.filterForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      search: new FormControl('', Validators.minLength(this.searchValidation.minLength))
    }, {
      validators: CustomValidation.dateRangeValidaton
    })

    this.filterForm.valueChanges.subscribe(value => {
      if(this.filterForm.valid){
        this.loadData()
      } else if (this.search.valid){
        let errorText = ''
        if(this.startDate.invalid){
          if(this.startDate.errors && this.startDate.errors.required){
            errorText = 'forms.transactionStartDate.errorRequired'
          }
        } else {
          if (this.endDate.invalid){
            errorText = 'forms.transactionEndDate.errorRequired'
          } else if (this.filterForm.errors && this.filterForm.errors.dateRange){
            errorText = 'forms.transactionStartDate.errorMax'
          }
        }
        this.showFormError(errorText)
      }
    })
  }

  // show form error in snackbar
  showFormError(errorText) {
    console.log('NotificationDetailsComponent | editNotifError')
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

  // call api to load data by filter
  loadData() {
    console.log('TransReportComponent | loadData')
    this.loading = true
  }

  

}
