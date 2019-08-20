import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  activeRule = [{
    reward: "2"
  }]
  activeSince: Date = new Date()
  activeRuleSampleSize = 1000
  upcomingRule = []
  upcomingRuleSampleSize = 0

  locale = 'id'

  // constructor
  constructor(
    private translateService: TranslateService
  ) { 
    console.log('RuleListComponent | constructor')
  }

  // component on init
  ngOnInit() {
    console.log('RuleListComponent | ngOnInit')
    this.translateService.get('angularLocale').subscribe(res => {
      this.locale = res;
    });
  }

}
