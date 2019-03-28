import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { UserForm } from '../../models/user-form';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: []
})
export class UserDetailsComponent implements OnInit {
  userForm: FormGroup;
  userModel: UserForm;
  onSubmittingForm = false;
  maxLength = { maxLength: 100 }
  id;
  isCreate = true;
  loading = true;

  //constructor
  constructor(
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { 
    console.log("UserDetailComponent | constructor")
  }

  // firstName formControl getter
  get firstName() {
    return this.userForm.get('firstName');
  }

  // lastName formControl getter
  get lastName() {
    return this.userForm.get('lastName');
  }

  // email formControl getter
  get email() {
    return this.userForm.get('email');
  }

  //component on init
  ngOnInit() {
    console.log("UserDetailComponent | OnInit")
    this.loading = true;
    if (this.router.url.includes('update')) {
      this.isCreate = false;
      this.id = this.route.snapshot.params['id'];
      this.accountService.getUserById(this.id).subscribe(
        data => {
          try {            
            let editedUser = data.data;
            this.userForm = new FormGroup({
              firstName: new FormControl(editedUser.firstname, [Validators.required,
              Validators.maxLength(100),
              CustomValidation.internationalName
              ]),
              lastName: new FormControl(editedUser.lastname, [Validators.required,
              Validators.maxLength(100),
              CustomValidation.internationalName
              ]),
              email: new FormControl({
                value: editedUser.login.email,
                disabled: true
              })
            })
          } catch (error) {
            console.log(error)
          }
        }, error => {
          try {            
            console.table(error);
            let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'userDetailsScreen.getUserFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
            errorSnackbar.afterDismissed().subscribe(() => {
              this.goToListScreen()
            })
          } catch (error) {
            console.log(error)
          }
        }).add(() => {
          this.loading = false;
        })
    } else {
      this.userForm = new FormGroup({
        firstName: new FormControl('', [Validators.required,
        Validators.maxLength(100),
        CustomValidation.internationalName
        ]),
        lastName: new FormControl('', [Validators.required,
        Validators.maxLength(100),
        CustomValidation.internationalName
        ]),
        email: new FormControl('', [Validators.required, Validators.email, CustomValidation.adiraEmail])
      })
      this.loading = false;
    }
  }

  //save button click event handler
  save() {
    console.log('UserDetailComponent | save')
    this.onSubmittingForm = true;
    this.userModel = this.userForm.value;
    if (this.isCreate) {
      this.accountService.createUser(this.userModel)
        .subscribe(
          (data: any) => {
            try {            
              console.table(data);
              this.onSubmittingForm = false;
              let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                data: {
                  title: 'success',
                  content: {
                    text: 'userDetailsScreen.succesCreated',
                    data: null
                  }
                }
              })
              snackbarSucess.afterDismissed().subscribe(() => {
                this.goToListScreen();
              })
            } catch (error) {
              console.log(error)
            }
          },
          error => {
            try {            
              console.table(error);
              this.onSubmittingForm = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'userDetailsScreen.createFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                    data: null
                  }
                }
              })
            } catch (error) {
              console.log(error)
            }
          }
        )
    } else {
      let editedUser = {
        firstName: this.userModel.firstName,
        lastName: this.userModel.lastName,
        id: this.id
      }
      this.onSubmittingForm = true;
      this.accountService.updateUser(editedUser).subscribe(
        (data: any) => {
          try {            
            console.table(data);
            this.onSubmittingForm = false;
            let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'userDetailsScreen.succesUpdated',
                  data: null
                }
              }
            })
            snackbarSucess.afterDismissed().subscribe(() => {
              this.goToListScreen();
            })
          } catch (error) {
            console.log(error)
          }
        },
        error => {
          try {            
            console.table(error);
            this.onSubmittingForm = false;
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'userDetailsScreen.updateFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.log(error)
          }
        }
      )
    }

  }

  //redirect to user list screen
  goToListScreen = () => {
    console.log('UserDetailComponent | gotoListScreen')
    this.router.navigate(['/master/users'])
  }
}
