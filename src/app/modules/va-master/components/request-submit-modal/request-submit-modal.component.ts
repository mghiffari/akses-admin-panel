import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RequestSubmitForm } from '../../models/request-submit';
import { constants } from 'src/app/shared/common/constants';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-request-submit-modal',
  templateUrl: './request-submit-modal.component.html',
  styleUrls: ['./request-submit-modal.component.scss']
})
export class RequestSubmitModalComponent implements OnInit {
  onSubmittingForm = false;
  RequestSubmitForm: FormGroup;
  RequestSubmitModel = RequestSubmitForm
  models;
  id;
  va_name;
  va_number;
  amountValue;

  get password() {
    return this.RequestSubmitForm.get('password');
  }

  // constructor
  constructor(public dialogRef: MatDialogRef<RequestSubmitModalComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private cashOutMasterService: CashoutMasterService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("RequestSubmitModalComponent | constructor")
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log("RequestSubmitModalComponent | ngOnInit")
    let prvg = this.authService.getFeaturePrivilege(constants.features.requestwithdrawal)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      let dataSend = this.data;
      this.id = dataSend.id;
      this.va_name = dataSend.vaname;
      this.va_number = dataSend.vanumber;
      this.amountValue = dataSend.amount;
      this.RequestSubmitForm = new FormGroup({
        password: new FormControl('', [Validators.required])
      });

    } else {
      this.authService.blockOpenPage()
    }
  }

  save() {
    console.log('RequestSubmitModalComponent | save')
    this.onSubmittingForm = true;
    this.models = {
      vamasterid: this.id,
      nominalcashout: this.amountValue,
      password: this.RequestSubmitForm.value.password
    }

    this.cashOutMasterService.getSubmitRequest(this.models)
      .subscribe(
        (data: any) => {
          this.handleUpdateCreateSuccess('requestWithdrawalScreen.success', data);
        },
        error => {
          this.handleApiError('requestWithdrawalScreen.failedSubmit', error);
        }
      )
  }

  handleUpdateCreateSuccess(successTitle, response) {
    console.log('RequestSubmitModalComponent | handleUpdateCreateSuccess')
    try {
      console.table(response);
      this.onSubmittingForm = false;
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: {
          title: 'requestWithdrawalScreen.submit',
          content: {
            text: successTitle,
            data: null
          }
        }
      })
      this.dialogRef.close(true)
      this.RequestSubmitForm.value.password = '';
    } catch (error) {
      console.log(error)
    }
  }

  handleApiError(errorTitle, apiError) {
    console.log('RequestSubmitModalComponent | handleApiError')
    console.table(apiError);
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError);
  }
}
