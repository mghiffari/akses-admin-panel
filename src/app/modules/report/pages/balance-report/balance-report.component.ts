// Angular modules
import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

// Components
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

// Models
import { BalanceData, TransBalanceData } from '../../models/balance-data';

// Services
import { ReportService } from '../../services/report.service';

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
    private snackBar: MatSnackBar,
    private reportService: ReportService,
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
    console.log('BalanceReportComponent | onSearch');
    this.loading = true;
    let balanceData = [];
    this.reportService.getBalanceReport(this.search).subscribe(
      (data: any) => {
        try {
          console.table(data);
          balanceData.push(data.data.vaData);
          this.balanceData = balanceData;
          this.transData = data.data.transactionData;
          this.loading = false;
        } catch (error) {
          console.table(error);
          this.balanceData = [];
          this.transData = [];
          this.loading = false;
        }
      },
      error => {
        try {
            console.table(error);
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'balanceReport.loadFailed',
                content: {
                  text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            });
            this.balanceData = [];
            this.transData = [];
            this.loading = false;
          } catch (error) {
            console.log(error);
            this.balanceData = [];
            this.transData = [];
            this.loading = false;
          }
      }
    );
  };

  // check if serach valid or not
  isSearchValid() {
    console.log('BalanceReportComponent | isSearchValid')
    return this.search !== undefined && this.search !== null && this.search !== '' && (this.search.length > this.searchValidation.minLength);
  }

}