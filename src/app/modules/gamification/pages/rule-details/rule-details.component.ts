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
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-rule-details',
  templateUrl: './rule-details.component.html',
  styleUrls: []
})
export class RuleDetailsComponent implements OnInit {
  ruleColumns = [
    'reward',
    'rangeSize',
    'probability',
    'blended',
    'runningNumber',
    'empty'
  ]
  locale = 'id';
  onSubmittingForm = false;
  loading = false;
  ruleForm: FormGroup;
  totalRangeSize = 0;
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

  // range size formControl getter
  getRangeSize(formGroup) {
    return formGroup.get('rangeSize')
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
          rangeSize: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0)]),
          probability: new FormControl(null),
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

      } else {
        this.authService.blockOpenPage()
      }
    })
  }

  // method to calculate blended, running numbers and total probability
  calculateRule() {
    console.log('RuleDetailsComponent | calculateRule')
    const value = this.ruleForm.value
      let isValidSampleSize = this.sampleSize.valid
      let sampleSize = value.sampleSize
      let newRule = []
      let currentCount = 0;
      let totalRangeSize = 0;
      let ruleFormArray = this.rule as FormArray
      for (let i = 0; i < ruleFormArray.length; i++) {
        let rowForm = ruleFormArray.at(i)
        let ruleRow = rowForm.value;
        let reward = ruleRow.reward
        let rangeSize = ruleRow.rangeSize
        let blended = null
        let floor = null
        let ceil = null
        let probability = null
        if (this.getRangeSize(rowForm).valid && isValidSampleSize) {
          probability = rangeSize / sampleSize
          if (rangeSize > 0) {
            floor = currentCount + 1;
            ceil = currentCount + rangeSize;
            totalRangeSize += rangeSize
            currentCount = ceil
          }
          if(this.getReward(rowForm).valid || !this.getReward(rowForm).errors.required){
            blended = probability * reward
          }          
        }
        newRule.push({ ...ruleRow, probability: probability, runningFloor: floor, runningCeil: ceil, blended: blended })
      }
      this.totalRangeSize = totalRangeSize
      this.ruleForm.patchValue({
        rule: newRule
      }, { emitEvent: false })
    // }
  }

  // save button click handler
  save() {
    console.log('RuleDetailsComponent | save')
    this.calculateRule()
    if (this.isCreate) {
      if (this.allowCreate) {
        if (this.totalRangeSize === this.sampleSize.value) {
          const modalRef = this.modal.open(ConfirmationModalComponent, {
            width: '260px',
            restoreFocus: false,
            data: {
              title: 'gamificationRuleScreen.confirmationModal.newRule.title',
              content: {
                string: 'gamificationRuleScreen.confirmationModal.newRule.content',
                data: null
              }
            }
          })
          modalRef.afterClosed().subscribe(result => {
            if (result) {
              this.goToListScreen()
            }
          })
        } else {
          this.showErrorTotalRangeSize()
        }
      } else {
        this.authService.blockPageAction()
      }
    } else {
      if (this.allowEdit) {
        if (this.totalRangeSize === this.sampleSize.value) {
          const modalRef = this.modal.open(ConfirmationModalComponent, {
            width: '260px',
            restoreFocus: false,
            data: {
              title: 'gamificationRuleScreen.confirmationModal.edit.title',
              content: {
                string: 'gamificationRuleScreen.confirmationModal.edit.content',
                data: null
              }
            }
          })
          modalRef.afterClosed().subscribe(result => {
            if (result) {
              this.goToListScreen()
            }
          })
        } else {
          this.showErrorTotalRangeSize()
        }
      } else {
        this.authService.blockPageAction()
      }
    }
  }

  // show error snackbar if total range size is not equal to sample size
  showErrorTotalRangeSize() {
    console.log('RuleDetailsComponent | showErrorTotalRangeSize')
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'fail',
        content: {
          text: 'gamificationRuleScreen.rangeSizeTotalError',
          data: null
        }
      }
    })
  }

  //redirect to gamification rule list screen
  goToListScreen = () => {
    console.log('RuleDetailsComponent | gotoListScreen')
    this.router.navigate(['/gamification/rule'])
  }
}
