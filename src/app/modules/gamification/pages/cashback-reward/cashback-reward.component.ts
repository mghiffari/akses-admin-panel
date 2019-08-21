import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';

// models
import { CashbackRewardData } from '../../models/cashback-reward';

// services
import { AuthService } from 'src/app/shared/services/auth.service';

// constants
import { constants } from 'src/app/shared/common/constants';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';

// components
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-cashback-reward',
  templateUrl: './cashback-reward.component.html',
  styleUrls: ['./cashback-reward.component.scss']
})
export class CashbackRewardComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps};

  cashbackRewardColumns: string[] = [
    'number',
    'vaNumber',
    'rewardDate',
    'custName',
    'grossValue',
    'pphValue',
    'cashbackReceive',
    'installmentVal',
    'paymentDate',
    'npwpNumber',
    'npwpName',
    'npwpAddress',
  ];

  cashbackReward: CashbackRewardData[] = [];

  locale = 'id';
  loading = false;
  isFocusedStartDate = false;
  isFocusedEndDate = false;
  isFocusedSearch = false;
  allowDownload = false;
  filterForm: FormGroup;

  private table: any;
  @ViewChild('cashbackRewardTable') set tabl(table: ElementRef) {
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
    private authService: AuthService
  ) { 
    console.log('CashbackRewardComponent | constructor');
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

  // component on Init
  ngOnInit() {
    console.log('CashbackRewardComponent | ngOnInit');
    this.translateService.get('angularLocale').subscribe(res => {
      this.locale = res;
    });
    let prvg = this.authService.getFeaturePrivilege(constants.features.cashbackReward)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.allowDownload = this.authService.getFeatureDownloadPrvg(prvg)
      this.filterForm = new FormGroup({
        startDate: new FormControl(null, Validators.required),
        endDate: new FormControl(null, Validators.required),
        search: new FormControl('', Validators.required)
      }, {
        validators: CustomValidation.dateRangeValidaton
      });
  
      this.filterForm.valueChanges.subscribe(value => {
        if (this.filterForm.valid) {
          this.loadData();
        } else {
          this.resetPage();
          this.resetTable();
          let errorText = '';
          if (this.startDate.invalid) {
            if (this.startDate.errors && this.startDate.errors.required) {
              errorText = 'forms.transactionStartDate.errorRequired'
            }
            this.showFormError(errorText)
          } else {
            if (this.endDate.errors && this.endDate.errors.required) {
              errorText = 'forms.transactionEndDate.errorRequired'
            } else if (this.filterForm.errors && this.filterForm.errors.dateRange) {
              errorText = 'forms.date.errorRange'
            } else if (this.search.errors && this.search.errors.required) {
              errorText = 'forms.transactionSearch.errorRequired'
            }
            if (!this.search.errors || !this.search.errors.minlength){
              this.showFormError(errorText)
            }
          }
        }
      })
    } else {
      this.authService.blockOpenPage()
    }
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('CashbackRewardComponent | onPaginatorChange');
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
    console.log('CashbackRewardComponent | resetPage')
    this.paginatorProps.pageIndex = 0
    this.paginatorProps.length = 0;
  }

  // empty table
  resetTable() {
    console.log('CashbackRewardComponent | resetTable')
    this.cashbackReward = []
    if (this.table) {
      this.table.renderRows()
    }
  }

  // show form error in snackbar
  showFormError(errorText) {
    console.log('CashbackRewardComponent | showFormError')
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
    console.log('CashbackRewardComponent | getDownloadLink');
  }

  // Method to load data from API
  loadData() {
    // Will remove when Integration (dummy data only)
    console.log('CashbackRewardComponent | loadData');
    this.cashbackReward = [
      {
        vaNumber: "00000000000000",
        rewardDate: new Date(),
        custName: "Nama Depan Nama Belakang",
        grossValue: 10000000,
        pphValue: 10000000,
        cashbackReceive: 10000000,
        installmentVal: 10000000,
        paymentDate: new Date(),
        npwpNumber: "123456789012345",
        npwpName: "Nama Depan Nama Belakang",
        npwpAddress: "Jl. ABC No. 22, Jakarta Selatan, Kemang Raya, DKI Jakarta 41102"
      },
      {
        vaNumber: "00000000000000",
        rewardDate: new Date(),
        custName: "Nama Depan Nama Belakang",
        grossValue: 10000000,
        pphValue: 10000000,
        cashbackReceive: 10000000,
        installmentVal: 10000000,
        paymentDate: new Date(),
        npwpNumber: "123456789012345",
        npwpName: "Nama Depan Nama Belakang",
        npwpAddress: "Jl. ABC No. 22, Jakarta Selatan, Kemang Raya, DKI Jakarta 41102"
      },
      {
        vaNumber: "00000000000000",
        rewardDate: new Date(),
        custName: "Nama Depan Nama Belakang",
        grossValue: 10000000,
        pphValue: 10000000,
        cashbackReceive: 10000000,
        installmentVal: 10000000,
        paymentDate: new Date(),
        npwpNumber: "123456789012345",
        npwpName: "Nama Depan Nama Belakang",
        npwpAddress: "Jl. ABC No. 22, Jakarta Selatan, Kemang Raya, DKI Jakarta 41102"
      },
      {
        vaNumber: "00000000000000",
        rewardDate: new Date(),
        custName: "Nama Depan Nama Belakang",
        grossValue: 10000000,
        pphValue: 10000000,
        cashbackReceive: 10000000,
        installmentVal: 10000000,
        paymentDate: new Date(),
        npwpNumber: "123456789012345",
        npwpName: "Nama Depan Nama Belakang",
        npwpAddress: "Jl. ABC No. 22, Jakarta Selatan, Kemang Raya, DKI Jakarta 41102"
      },
    ]
  }
}