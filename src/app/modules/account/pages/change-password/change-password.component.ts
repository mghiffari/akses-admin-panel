import { Component, OnInit } from '@angular/core';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { ChangePassword } from 'src/app/shared/models/change-password';
import { AccountService } from 'src/app/shared/services/account.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: []
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm;
  changePasswordModel = new ChangePassword();
  onSubmittingForm = false;
  passwordLength = CustomValidation.password;
  
  //constructor
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { console.log("ChangePasswordComponent | Constructor") }

  //oldPassword formControl getter
  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  //newPassword formControl getter
  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  //confirmPassword formControl getter
  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  //component on init, get validation for change pasword form
  ngOnInit() {
    console.log("ChangePasswordComponent | OnInit")
    this.changePasswordForm = CustomValidation.getChangePasswordValidation()
  }

  //call change password api
  changePassword() {
    console.log('ChangePasswordComponent | changePassword')
    this.onSubmittingForm = true;
    let val = this.changePasswordForm.value;
    let userLoggedIn = this.authService.getUserLogin();
    this.changePasswordModel.email = userLoggedIn ? JSON.parse(userLoggedIn).email : null;
    this.changePasswordModel.password = val.oldPassword;
    this.changePasswordModel.newPassword = val.newPassword;
    this.accountService.changePassword(this.changePasswordModel)
      .subscribe(
        (data: any) => {
          console.table(data);
          this.onSubmittingForm = false;
          let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'changePasswordScreen.passwordChanged',
                data: null
              }
            }
          })
          snackbarSucess.afterDismissed().subscribe(() => {
            this.router.navigate(['/master/users'])
          })

        },
        error => {
          console.table(error);
          this.onSubmittingForm = false;
          this.changePasswordForm.reset();
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'changePasswordScreen.failed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        }
      )
  }
}
