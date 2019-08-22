import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss']
})
export class RuleListComponent implements OnInit {
  loading = false;
  ruleColumns = [
    'reward',
    'probability',
    'blended',
    'runningNumber'
  ]

  activeRule = [
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  },
  {
    reward: 0.02,
    probability: 0.02,
    blended: 0.0004,
    running_number: "1-10",
  }
]
  activeSince: Date = new Date()
  replaceTime: Date = null
  activeRuleSampleSize = 1000
  upcomingRule = []
  upcomingRuleSampleSize = 0

  locale = 'id'
  allowCreate = false
  allowEdit = false

  // constructor
  constructor(
    private translateService: TranslateService,
    private authService: AuthService
  ) { 
    console.log('RuleListComponent | constructor')
  }

  // component on init
  ngOnInit() {
    console.log('RuleListComponent | ngOnInit')
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.gamificationRule)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.translateService.get('angularLocale').subscribe(res => {
        this.locale = res;
      });
      // this.replaceTime.setDate(this.replaceTime.getDate() + 1)
      // this.replaceTime.setHours(0,1)
    } else {
      this.authService.blockOpenPage()
    }
  }

}
