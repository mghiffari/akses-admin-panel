import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  reportApiUrl = environment.apiurl + 'history/transaction';
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


  // return download link parsed with needed parameter
  parseDownloadLink(fromDate, toDate, search) {
    console.log("Report Service | parseDownloadLink");
    return this.downloadTransReporApiUrl
      + '?from_date=' + fromDate
      + '&to_date='+ toDate
      + '&search_key=' + encodeURIComponent(search)
      + '&token=' + this.authService.getAccessToken()
  }
}
