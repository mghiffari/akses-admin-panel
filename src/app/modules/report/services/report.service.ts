import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reportApiUrl = environment.msPaymentApiUrl + 'history/transaction';
  balanceReportApiUrl = this.reportApiUrl + '/search';
  downloadTransReporApiUrl = this.reportApiUrl + '/download';

  constructor(private authService: AuthService) {
    console.log('ReportService | constructor');
  }

  // get balance report list and search 
  getBalanceReport(value) {
    let url = this.balanceReportApiUrl;
    console.log("Report Service | getBalanceReport ", url);
    let data = {
      value: value
    }
    return this.authService.wrapTokenPostApi(url, data);
  }

  // get transaction report list with filter and pagination
  getTransactionReport(page, pageSize, fromDate, toDate, search) {
    let url = this.reportApiUrl + '/' + page + '/' + pageSize;
    console.log("Report Service | getTransactionReport", url);
    let data = {
      from_date: fromDate,
      to_date: toDate,
      search_key: search
    }
    return this.authService.wrapTokenPostApi(url, data);
  }

  // get transaction report list with filter
  downloadTransactionReport(fromDate, toDate, search) {
    let url = this.downloadTransReporApiUrl;
    console.log("Report Service | downloadTransactionReport", url);
    let data = {
      from_date: fromDate,
      to_date: toDate,
      search_key: search
    }
    return this.authService.wrapTokenPostApi(url, data);
  }
}
