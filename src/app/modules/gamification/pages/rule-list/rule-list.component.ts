import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { Rule } from '../../models/rule';
import { GamificationService } from '../../services/gamification.service';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { Syspref } from '../../models/syspref';

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

  activeRule: Rule[] = []
  activeSince: Date = null
  replaceTime: Date = null
  activeRuleSampleSize: number = null
  upcomingRule: Rule[] = []
  upcomingRuleSampleSize: number = null

  locale = 'id'
  allowCreate = false
  allowEdit = false

  // constructor
  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private gamificationService: GamificationService,
    private snackBar: MatSnackBar
  ) {
    console.log('RuleListComponent | constructor')
  }

  // component on init
  ngOnInit() {
    console.log('RuleListComponent | ngOnInit')
    this.allowCreate = false;
    this.allowEdit = false;
    this.activeRule = []
    this.activeSince = null
    this.replaceTime = null
    this.activeRuleSampleSize = null
    this.upcomingRule = []
    this.upcomingRuleSampleSize = null

    let prvg = this.authService.getFeaturePrivilege(constants.features.gamificationRule)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.translateService.get('angularLocale').subscribe(res => {
        this.locale = res;
      });
      this.loading = true
      this.gamificationService.getRuleConfig().subscribe(
        response => {
          console.table(response)
          try {
            let sysprefs: Syspref[] = response.data.syspref
            let rule: Rule[] = response.data.rule
            let activeSince: Date = null
            let replaceTime: Date = null
            let activeSampleSize: number = null
            let upcomingSampleSize: number = null
            for (let syspref of sysprefs) {
              if (syspref.name === constants.gamification.active.cycleNum) {
                activeSampleSize = Number(syspref.value)
              } else if (syspref.name === constants.gamification.active.timestamp) {
                activeSince = new Date(syspref.value)
              } else if (syspref.name === constants.gamification.upcoming.cycleNum) {
                upcomingSampleSize = Number(syspref.value)
              } else if (syspref.name === constants.gamification.upcoming.timestamp) {
                replaceTime = new Date(syspref.value)
              }
            }
            if (activeSince) {
              this.activeSince = activeSince
              this.activeRuleSampleSize = activeSampleSize
              let activeRule = []
              let upcomingRule = []
              for (let rul of rule) {
                if (rul.status == constants.gamification.active.status) {
                  activeRule.push(rul)
                } else if (rul.status == constants.gamification.upcoming.status) {
                  upcomingRule.push(rul)
                }
              }
              this.activeRule = this.sortRule(activeRule)
              if (!replaceTime || replaceTime.getTime() > activeSince.getTime()) {
                this.replaceTime = replaceTime
                this.upcomingRule = this.sortRule(upcomingRule)
                this.upcomingRuleSampleSize = upcomingSampleSize
              }
            }
          } catch (error) {
            console.error(error)
          }
        }, error => {
          console.table(error)
          try {
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'gamificationRuleScreen.loadFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.error(error)
          }
        }
      ).add(() => {
        this.loading = false
      })
    } else {
      this.authService.blockOpenPage()
    }
  }

  // sort rule ascending floor number
  sortRule(ruleArray: Rule[]){
    console.log('RuleListComponent | sortRule')
    ruleArray.sort((a, b) => {
      return a.floor - b.floor
    })
    return ruleArray
  }

}
