import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { MatSnackBar } from '@angular/material';
import { Auth } from 'src/app/shared/models/auth';
import { ChangePassword } from 'src/app/shared/models/change-password';
import { UserLoggedIn } from 'src/app/shared/models/user-logged-in';
import { AccountService } from 'src/app/shared/services/account.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { constants } from 'src/app/shared/common/constants';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  dateLocale = 'id';
  versionNo = environment.version;
  versionDate = environment.versionDate;
  passwordLength = CustomValidation.password;
  onSubmittingForm = false;
  authForm;
  changePasswordForm;
  resetPasswordForm;
  wrongPasswordCount = 0;
  loginAttemptCount = 0;
  loginAttempLeft = null;
  captchaCode = '';
  auth: Auth = new Auth();
  changePasswordModel: ChangePassword = new ChangePassword();
  userData: UserLoggedIn = new UserLoggedIn();
  accessToken = '';

  private captchaCanvas: ElementRef;
  @ViewChild('captchaCanvas') set captchaCanv(captchaCanv: ElementRef) {
    let isInit = (typeof this.captchaCanvas === 'undefined')
    this.captchaCanvas = captchaCanv;
    if (isInit) {
      this.initCaptcha()
    }
  }
  captchaCanvasElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  mode = 'login';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService) {
    console.log('LoginComponent | constructor')
  }

  // initialize captcha in canvas
  initCaptcha() {
    console.log('LoginComponent | initCaptcha')
    if (this.captchaCanvas) {
      this.captchaCanvasElement = (<HTMLCanvasElement>this.captchaCanvas.nativeElement)
      this.canvasContext = this.captchaCanvasElement.getContext('2d');
      this.createCaptcha();
      this.recaptcha.setValidators([Validators.required, CustomValidation.equal(this.captchaCode)])
      this.recaptcha.setValue('')
    }
  }

  //initialize form groups
  ngOnInit() {
    console.log('LoginComponent | ngOnInit')
    if (this.authService.isUserLoggedIn()) {
      this.goToUserPage()
    }
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, CustomValidation.adiraEmail]),
      password: new FormControl('', [Validators.required]),
      recaptcha: new FormControl('')
    })
    this.changePasswordForm = CustomValidation.getChangePasswordValidation();
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, CustomValidation.adiraEmail])
    })
    this.translateService.get('angularLocale').subscribe(res => {
      this.dateLocale = res;
    });
  }

  //call login api, check initial login, count wrong password to display captcha
  onLogin() {
    console.log('LoginComponent | onLogin')
    this.onSubmittingForm = true;
    this.auth = this.authForm.value;
    this.authService.login(this.authForm.value).subscribe(
      (data: any) => {
        try {
          console.table(data)
          let res = data.data;
          this.onSubmittingForm = false;
          this.accessToken = res.token;
          this.userData = res;
          if (this.userData.init_login) {
            this.goToChangePasswordForm();
          } else {
            this.doLogin();
          }
        } catch (error) {
          console.table(error)
        }
      },
      error => {
        try {
          console.table(error)
          this.password.setValue('');
          this.onSubmittingForm = false;

          if (error.status && error.error.err_code === '01005' || error.error.err_code === '01003') {
            ++this.wrongPasswordCount;
            if(error.error.counter) {
              this.loginAttemptCount = error.error.counter;
              this.loginAttempLeft = constants.loginMaxAttempt - this.loginAttemptCount;
            }else {
              this.loginAttemptCount = 0;
              this.loginAttempLeft = null;
            }
          }
          // show captcha if password wrong 3 times
          if (this.wrongPasswordCount > 3) {
            this.createCaptcha()
            this.recaptcha.setValidators([Validators.required, CustomValidation.equal(this.captchaCode)])
            this.recaptcha.setValue('')
          }
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'loginScreen.loginFailed',
              content: {
                text: "apiErrors." + (error.status ? error.error.err_code : 'noInternet')
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )
  }

  //set browser storage
  doLogin() {
    console.log('LoginComponent | doLogin')
    this.authService.setAccessToken(this.accessToken);
    this.authService.setUserLogin(JSON.stringify(this.userData));
    let returnUrl = this.getReturnUrl();
    if (returnUrl) {
      this.router.navigate([returnUrl])
    } else {
      this.goToUserPage()
    }
  }

  // redirect to user list page
  goToUserPage() {
    console.log('LoginComponent | goToUserPage')
    console.log('redirect to user')
    this.router.navigate(['/master/users']);
  }

  // change to reset password form mode
  goToResetPasswordForm() {
    console.log('LoginComponent | goToResetPasswordForm')
    this.mode = 'resetPassword'
    this.resetPasswordForm.reset();
  }

  // change to change password form mode
  goToChangePasswordForm() {
    console.log('LoginComponent | goToChangePasswordForm')
    this.mode = 'changePassword'
  }

  // change to login form mode
  goToLoginForm() {
    console.log('LoginComponent | goToLoginForm')
    this.mode = 'login';
    this.authForm.reset()
  }

  // call change password api
  changePassword() {
    console.log('LoginComponent | changePassword')
    this.onSubmittingForm = true;
    let val = this.changePasswordForm.value;
    this.changePasswordModel.email = this.userData.email;
    this.changePasswordModel.password = val.oldPassword;
    this.changePasswordModel.newPassword = val.newPassword;
    this.accountService.changePassword(this.changePasswordModel, this.accessToken)
      .subscribe(
        (data: any) => {
          console.table(data);
          this.onSubmittingForm = false;
          let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'loginScreen.passwordChanged',
                data: null
              }
            }
          })
          snackbarSucess.afterDismissed().subscribe(() => {
            document.location.reload()
          })
        },
        error => {
          try {
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
            this.accessToken = error.headers.get('access-token') ? error.headers.get('access-token') : this.accessToken;
          } catch (error) {
            console.table(error)
          }
        }
      )
  }

  // call send new password api
  sendNewPassword() {
    console.log('LoginComponent | sendNewPassword')
    this.onSubmittingForm = true;
    this.authService.resetPassword(this.email.value).subscribe(
      (data: any) => {
        console.table(data);
        this.onSubmittingForm = false;
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'loginScreen.passwordSendToEmail',
              data: null
            }
          }
        })
      },
      error => {
        try {
          console.table(error);
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'loginScreen.passwordSendFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      }
    )

  }

  //email formControl getter
  get email() {
    if (this.mode === 'login') {
      return this.authForm.get('email');
    } else {
      return this.resetPasswordForm.get('email')
    }
  }

  //password formControl getter
  get password() {
    return this.authForm.get('password');
  }

  //recaptcha formControl getter
  get recaptcha() {
    return this.authForm.get('recaptcha');
  }

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

  // creating the captcha in the canvas
  createCaptcha() {
    console.log("LoginComponent | createCaptcha")
    this.canvasContext.fillStyle = '#F5F5DC';
    this.canvasContext.fillRect(0, 0, this.captchaCanvasElement.width, this.captchaCanvasElement.height);
    let charsArray =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*';
    let lengthOtp = 6;
    let captcha = [];
    for (let i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length); //get the next character from the array
      captcha.push(charsArray[index]);
    }
    this.canvasContext.font = "25px Georgia";
    this.canvasContext.textAlign = "center";
    this.canvasContext.textBaseline = "middle";
    let collapseIndex = 8;
    let middleCharPositionX = captcha.length % 2 !== 0 ? 0 : (19 / 2 - collapseIndex / 2)
    let nexCharPosition = 19 - collapseIndex;
    let midChar = captcha.length / 2
    let midCharRoundDown = Math.floor(midChar)
    let midCharRoundUp = Math.ceil(midChar)
    let min = captcha.length % 2 !== 0 ? 1 : 0
    for (let i = 0; i < captcha.length; i++) {
      let x = 0;
      if (i < midChar) {
        x = -middleCharPositionX - ((midCharRoundUp - i - 1) * nexCharPosition)
      } else {
        x = middleCharPositionX + ((i - midCharRoundDown) * nexCharPosition)
      }
      console.log(captcha[i])
      this.canvasContext.strokeText(captcha[i], this.captchaCanvasElement.width / 2 + x, this.captchaCanvasElement.height / 2);
    }
    // this.canvasContext.strokeText(captcha.join(""), this.captchaCanvasElement.width / 2, this.captchaCanvasElement.height / 2);
    this.captchaCode = captcha.join("");
  }

  //get returnUrl query param
  getReturnUrl() {
    console.log('LoginComponent | getReturnUrl')
    return this.route.snapshot.queryParams['returnUrl'] ? this.route.snapshot.queryParams['returnUrl'] : null
  }
}
