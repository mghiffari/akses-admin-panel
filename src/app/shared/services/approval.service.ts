import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import Utils from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  approvalApiUrl = environment.apiurl + 'approval'
  approvalTabsApiUrl = this.approvalApiUrl + '/tabs'
  specialOfferApiUrl = this.approvalApiUrl + '/specialoffer'

  // constructor
  constructor(
    private authService: AuthService
  ) { console.log('ApprovalService | constructor')}

  // api to get list of features that needs approval
  getApprovalTabs(){
    console.log('ApprovalService | getApprovalTabs ', this.approvalTabsApiUrl)
    return this.authService.wrapTokenGetApi(this.approvalTabsApiUrl)
  }

  // api to get special offer approval list
  getSpecialOfferApproval(page, pageSize, search, fromDate, toDate){
    let url = this.specialOfferApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);
    console.log('ApprovalService | getSpecialOfferApproval ', url)
    return this.authService.wrapTokenPostApi(url, {
      from_date: fromDate,
      to_date: toDate
    })
  }

}
