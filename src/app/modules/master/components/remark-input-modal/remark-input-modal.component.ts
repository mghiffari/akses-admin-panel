import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangePhoneService } from '../../services/change-phone.service';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ChangePhone } from '../../models/change-phone';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-remark-input-modal',
  templateUrl: './remark-input-modal.component.html',
  styleUrls: []
})
export class RemarkInputModalComponent implements OnInit {
  remarkForm: FormGroup;
  maxLength = CustomValidation.requestRemark;
  onSubmittingForm = false;
  request;

  //constructor
  constructor(public dialogRef: MatDialogRef<RemarkInputModalComponent>,
    private requestService: ChangePhoneService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('RemarkInputModalComponent | constructor')
    dialogRef.disableClose = true;
    this.request = data.request;
  }

  // onInit
  ngOnInit() {
    console.log('RemarkInputModalComponent | ngOnInit')
    this.remarkForm = new FormGroup(
      {
        remarks: new FormControl('', [Validators.required, Validators.maxLength(CustomValidation.requestRemark.maxLength)])
      }
    )
  }

  // remark formControl getter
  get remarks() {
    return this.remarkForm.get('remarks');
  }

  // handle submit button to update request remark
  save() {
    console.log('RemarkInputModalComponent | save')
    this.onSubmittingForm = true;
    let request = new ChangePhone();
    request.id = this.request.id
    request.remarks = this.remarks.value;
    this.requestService.bulkUpdateRequest(request).subscribe(
      response => {
        this.onSubmittingForm = false;
        try {
          let data = response.data;
          if (data.fail_count === 0) {
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
          } else {
            this.authService.openSnackbarError('changePhonenumberRequestListScreen.addRemarkFailed', '')
          }
        } catch (error) {
          console.error(error)
        }
      }, error => {
        console.table(error);
        this.onSubmittingForm = false;
        this.authService.handleApiError('changePhonenumberRequestListScreen.addRemarkFailed', error);
      }
    )
  }

}
