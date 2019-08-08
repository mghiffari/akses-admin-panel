import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BalanceData, TransBalanceData } from '../../models/balance-data';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';

@Component({
  selector: 'app-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.scss']
})
export class BalanceReportComponent implements OnInit {
  balanceColumn: string[] = [
    'oid',
    'vaNumber',
    'name',
    'phoneNumber',
    'aksesPayBalance',
    'timestamp'
  ];
  transactionColumn: string[] = [
    'transCode',
    'transDesc',
    'amount',
    'VANumberDest',
    'sourceVANumber',
    'transDate',
    'transSequence'
  ];
  balanceData: BalanceData[] = [];
  transData: TransBalanceData[] = [];

  search: string;
  locale = 'id';
  loading = false;
  searchValidation = CustomValidation.transactionSearch;

  private balanceTable: any;
  @ViewChild('balanceTable') set balanceTabl(table: ElementRef) {
    this.balanceTable = table;
  }

  private transTable: any;
  @ViewChild('transTable') set transTabl(table: ElementRef) {
    this.transTable = table;
  }

  // constructor
  constructor(
    private translateService: TranslateService,
  ) {
    console.log('BalanceReportComponent | constructor');
  }

  // component on init
  ngOnInit() {
    console.log('BalanceReportComponent | ngOnInit')
    this.translateService.get('angularLocale').subscribe(res => {
      this.locale = res;
    });
  }

  // call api to load data by search
  onSearch() {
    console.log('BalanceReportComponent | onSearch')
    console.log(this.search);
  };

  // check 
  isSearchValid() {
    console.log('BalanceReportComponent | isSearchValid')
    return this.search !== undefined && this.search !== null && this.search !== '' && (this.search.length > this.searchValidation.minLength);
  }

}
