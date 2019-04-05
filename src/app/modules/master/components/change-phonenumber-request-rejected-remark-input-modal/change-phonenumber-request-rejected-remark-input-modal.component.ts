import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangePhonenumberRequestService } from '../../services/change-phonenumber-request.service';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-change-phonenumber-request-rejected-remark-input-modal',
  templateUrl: './change-phonenumber-request-rejected-remark-input-modal.component.html',
  styleUrls: []
})
export class ChangePhonenumberRequestRejectedRemarkInputModalComponent implements OnInit {
  remarkForm: FormGroup;
  maxLength = CustomValidation.requestRemark;
  onSubmittingForm = false;
  request;

  //constructor
  constructor(public dialogRef: MatDialogRef<ChangePhonenumberRequestRejectedRemarkInputModalComponent>,
    private requestService: ChangePhonenumberRequestService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('ChangePhonenumberRequestRejectedRemarkInputModalComponent | constructor')
    dialogRef.disableClose = true;
    // this.request = data.request;
  }

  // onInit
  ngOnInit() {
    console.log('ChangePhonenumberRequestRejectedRemarkInputModalComponent | ngOnInit')
    this.remarkForm = new FormGroup(
      {
        remark: new FormControl('', [Validators.required, Validators.maxLength(CustomValidation.requestRemark.maxLength)])
      }
    )
  }

  // remark formControl getter
  get remark() {
    return this.remarkForm.get('remark');
  }

  // handle submit button to update request remark
  save() {
    console.log('ChangePhonenumberRequestRejectedRemarkInputModalComponent | save')
    this.onSubmittingForm = true;
    // this.request.remark = this.remark.value;
    // this.requestService.updateRequest(this.request).subscribe(
    //   response => {
        this.onSubmittingForm = false;
        this.snackbar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'changePhonenumberRequestListScreen.addRemarkSuccess',
              data: null
            }
          }
        })
        this.dialogRef.close(true)
    //   }, error => {
    //     try {
    //       this.onSubmittingForm = false;
    //       this.snackbar.openFromComponent(ErrorSnackbarComponent, {
    //         data: {
    //           title: 'changePhonenumberRequestListScreen.addRemarkFailed',
    //           content: {
    //             text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //             data: null
    //           }
    //         }
    //       })
    //     } catch (error) {
    //       console.table(error)
    //     }
    //   }
    // )
  }

}
