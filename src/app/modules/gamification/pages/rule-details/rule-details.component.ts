import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { MaskedInputType } from 'src/app/shared/components/masked-num-input/masked-num-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { GamificationService } from '../../services/gamification.service';
import { Syspref } from '../../models/syspref';
import { Rule } from '../../models/rule';
import { RuleForm } from '../../models/rule-form';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-rule-details',
  templateUrl: './rule-details.component.html',
  styleUrls: []
})
export class RuleDetailsComponent implements OnInit {
  ruleColumns = [
    'number',
    'reward',
    'probability',
    'blended',
    'totalPerson',
    'disclaimer',
    'empty'
  ]
  locale = 'id';
  onSubmittingForm = false;
  loading = false;
  ruleForm: FormGroup;
  sampleSearchValidation = CustomValidation.gamificationSampleSize
  inputMaskType = {
    percentage: MaskedInputType.Percentage
  };
  allowCreate = false;
  allowEdit = false;
  isCreate = true;


  // constructor
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private modal: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private gamificationService: GamificationService
  ) {
    console.log('RuleDetailsComponent | constructor')
  }

  // sampleSize formControl getter
  get sampleSize() {
    return this.ruleForm.get('sampleSize')
  }

  // rule formArray getter
  get rule() {
    return this.ruleForm.get('rule') as FormArray
  }

  // reward formControl getter
  getReward(formGroup) {
    return formGroup.get('reward')
  }

  // total person formControl getter
  getTotalPerson(formGroup) {
    return formGroup.get('totalPerson')
  }

  // probability formControl getter
  getProbability(formGroup) {
    return formGroup.get('probability')
  }

  // blended formControl getter
  getBlended(formGroup) {
    return formGroup.get('blended')
  }

  // runningFloor formControl getter
  getRunningFloor(formGroup) {
    return formGroup.get('runningFloor')
  }

  // runningCeil formControl getter
  getRunningCeil(formGroup) {
    return formGroup.get('runningCeil')
  }

  // component on init
  ngOnInit() {
    console.log('RuleDetailsComponent | ngOnInit')
    this.translateService.get('angularLocale').subscribe(res => {
      this.locale = res;
    });
    this.route.params.subscribe(params => {
      let ruleRows = []
      for (let i = 0; i < 9; i++) {
        ruleRows.push(new FormGroup({
          reward: new FormControl(null, [Validators.required, Validators.min(0)]),
          totalPerson: new FormControl(null),
          probability: new FormControl(null, [Validators.required, Validators.min(0)]),
          blended: new FormControl(null),
          runningFloor: new FormControl(null),
          runningCeil: new FormControl(null),
        }))
      }
      this.ruleForm = new FormGroup({
        sampleSize: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(this.sampleSearchValidation.minValue)]),
        rule: new FormArray(ruleRows)
      })

      let prvg = this.authService.getFeaturePrivilege(constants.features.gamificationRule)
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
      let allowPage = false
      if (this.router.url.includes('update')) {
        this.isCreate = false;
        allowPage = this.allowEdit
      } else {
        this.isCreate = true;
        allowPage = this.allowCreate
      }

      if (allowPage) {
        this.initForm()
      } else {
        this.authService.blockOpenPage()
      }
    })
  }

  // call api to initialize form value
  initForm() {
    console.log('RuleDetailsComponent | initForm')
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
          let ruleArrayForm = []
          let sampleSize = null
          if (activeSince) {
            let activeRule = []
            let upcomingRule = []
            for (let rul of rule) {
              if (rul.status == constants.gamification.active.status) {
                activeRule.push(rul)
              } else if (rul.status == constants.gamification.upcoming.status) {
                upcomingRule.push(rul)
              }
            }
            if (this.isCreate) {
              if (!replaceTime || replaceTime.getTime() > activeSince.getTime()) {
                ruleArrayForm = this.getRuleFormValue(upcomingRule)
                sampleSize = upcomingSampleSize
              } else {
                ruleArrayForm = this.getRuleFormValue(activeRule)
                sampleSize = activeSampleSize
              }
            } else {
              if (!replaceTime || replaceTime.getTime() > activeSince.getTime()) {
                ruleArrayForm = this.getRuleFormValue(upcomingRule)
                sampleSize = upcomingSampleSize
              } else {
                let errorSnackbar = this.authService.openSnackbarError('gamificationRuleScreen.cantEditRule', 'gamificationRuleScreen.upcomingRuleNotFound')
                errorSnackbar.afterDismissed().subscribe(() => {
                  this.goToListScreen()
                })
              }
            }
          }
          this.ruleForm.setValue({
            sampleSize: sampleSize,
            rule: ruleArrayForm
          })
          this.calculateRule()
        } catch (error) {
          console.error(error)
        }
      }, error => {
        console.table(error)        
          let errorSnackbar = this.authService.handleApiError('gamificationRuleScreen.loadFailed', error)
          if(errorSnackbar){
            errorSnackbar.afterDismissed().subscribe(() => {
              this.goToListScreen()
            })
          }
      }
    ).add(() => {
      this.loading = false
    })
  }

  // method to get new form value based on current rule
  getRuleFormValue(ruleArray: Rule[]) {
    console.log('RuleDetailsComponent | setFormValue')
    let ruleArrayForm = this.rule.value
    for (let i = 0; i < ruleArrayForm.length; i++) {
      let ruleData = ruleArray[i]
      if (ruleData) {
        ruleArrayForm[i] = {
          reward: ruleData.reward,
          totalPerson: ruleData.ceiling && ruleData.floor ? ruleData.ceiling - ruleData.floor + 1 : null,
          probability: ruleData.probability,
          blended: ruleData.blended,
          runningFloor: ruleData.floor,
          runningCeil: ruleData.ceiling,
        }
      }
    }
    console.log('arrayform', ruleArrayForm)
    ruleArrayForm.sort((a, b) => {
      return a.runningFloor - b.runningFloor
    })
    return ruleArrayForm;
  }

  // method to calculate blended, running numbers and total probability
  calculateRule() {
    console.log('RuleDetailsComponent | calculateRule')
    const value = this.ruleForm.value
    let isValidSampleSize = this.sampleSize.valid
    let sampleSize = value.sampleSize
    let newRule = []
    let currentCount = 0;
    let totalPersonAddition = 0;
    let totalProbability = 0;
    let decimalTolerance = Math.pow(10, 12)
    let ruleFormArray = this.rule;
    for (let i = 0; i < ruleFormArray.length; i++) {
      let rowForm = ruleFormArray.at(i)
      let ruleRow = rowForm.value;
      let reward = ruleRow.reward;
      let blended = null
      let floor = null
      let ceil = null
      let probability = null
      let totalPerson = null
      if (i < ruleFormArray.length - 1) {
        probability = ruleRow.probability
        if ((this.getProbability(rowForm).valid || !this.getProbability(rowForm).errors.required)) {
          totalProbability += Math.floor(probability * decimalTolerance)
          if (isValidSampleSize) {
            totalPerson = Math.floor(sampleSize * probability)
            totalPersonAddition += totalPerson
            if (totalPerson > 0) {
              floor = currentCount + 1;
              ceil = currentCount + totalPerson;
              currentCount = ceil
            }
          }
          if (this.getReward(rowForm).valid || !this.getReward(rowForm).errors.required) {
            blended = probability * reward
          }
        }
      } else {
        probability = (decimalTolerance - totalProbability) / decimalTolerance
        if (probability >= 0) {
          if (this.getReward(rowForm).valid || !this.getReward(rowForm).errors.required) {
            blended = probability * reward
          }
        }
        if (isValidSampleSize) {
          totalPerson = sampleSize - totalPersonAddition
          if (totalPerson > 0) {
            floor = currentCount + 1;
            ceil = currentCount + totalPerson;
            currentCount = ceil
          }
        }
      }
      newRule.push({ ...ruleRow, totalPerson: totalPerson, probability: probability, runningFloor: floor, runningCeil: ceil, blended: blended })
    }
    this.ruleForm.patchValue({
      rule: newRule
    }, { emitEvent: false })
  }

  // save button click handler
  save() {
    console.log('RuleDetailsComponent | save')
    this.calculateRule()
    let allowSave = false
    let modalTitle = ''
    let modalContentText = ''
    let errorText = ''
    let successText = ''
    if (this.isCreate) {
      allowSave = this.allowCreate
      modalTitle = 'gamificationRuleScreen.confirmationModal.newRule.title'
      modalContentText = 'gamificationRuleScreen.confirmationModal.newRule.content'
      errorText = 'gamificationRuleScreen.createFailed'
      successText = 'gamificationRuleScreen.succesCreated'
    } else {
      allowSave = this.allowEdit
      modalTitle = 'gamificationRuleScreen.confirmationModal.edit.title'
      modalContentText = 'gamificationRuleScreen.confirmationModal.edit.content'
      errorText = 'gamificationRuleScreen.updateFailed'
      successText = 'gamificationRuleScreen.succesUpdated'
    }
    if (allowSave) {
      const modalRef = this.modal.open(ConfirmationModalComponent, {
        width: '260px',
        restoreFocus: false,
        data: {
          title: modalTitle,
          content: {
            string: modalContentText,
            data: null
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.onSubmittingForm = true
          this.ruleForm.disable()
          let formValue = this.ruleForm.getRawValue()
          let ruleForm = new RuleForm()
          ruleForm.cycleNumber = formValue.sampleSize
          ruleForm.draftRule = []
          for (let rule of formValue.rule) {
            let newRuleData = new Rule()
            newRuleData.blended = rule.blended;
            newRuleData.floor = rule.runningFloor;
            newRuleData.ceiling = rule.runningCeil;
            newRuleData.probability = rule.probability;
            newRuleData.reward = rule.reward;
            ruleForm.draftRule.push(newRuleData)
          }
          this.gamificationService.saveRuleConfig(ruleForm).subscribe(
            response => {
              console.table(response)
              let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                data: {
                  title: 'success',
                  content: {
                    text: successText,
                    data: null
                  }
                }
              })
              successSnackbar.afterDismissed().subscribe(() => {
                this.goToListScreen()
              })
            }, error => {
              console.table(error)
              this.authService.handleApiError(errorText, error);
            }
          ).add(() => {
            this.ruleForm.enable()
            this.onSubmittingForm = false
          })
        }
      })
    } else {
      this.authService.blockPageAction()
    }
  }

  //redirect to gamification rule list screen
  goToListScreen = () => {
    console.log('RuleDetailsComponent | gotoListScreen')
    this.router.navigate(['/gamification/rule'])
  }
}
