import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  gamificationApiUrl = environment.apiurl + 'gamification';
  cashbackRewardApiUrl = this.gamificationApiUrl + '/cashback';

  // constructor
  constructor(
    private authService: AuthService
  ) { console.log('GamificationService | constructor') }

  // get rule configuration
  getRuleConfig(){
    let url = this.gamificationApiUrl
    console.log('GamificationService | getRuleConfig')
    return this.authService.wrapTokenGetApi(url)
  }

  // get rule configuration
  saveRuleConfig(data){
    let url = this.gamificationApiUrl
    console.log('GamificationService | saveRuleConfig')
    return this.authService.wrapTokenPostApi(url, data)
  }

  // get cashback reward list with pagination and filter
  getCashbackReward(page, pageSize, fromDate, toDate, name) {
    let url = this.cashbackRewardApiUrl + '/' + page + '/' + pageSize + '/' + name;
    console.log("Gamification Service | getCashbackReward", url);
    let data = {
      from_date: fromDate,
      to_date: toDate
    }
    return this.authService.wrapTokenPostApi(url, data);
  }
}
