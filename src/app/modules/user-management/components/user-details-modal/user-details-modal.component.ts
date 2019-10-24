import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from 'src/app/shared/services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserForm } from '../../models/user-form';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.scss']
})
export class UserDetailsModalComponent implements OnInit {
  userForm: FormGroup;
  userModel: UserForm;
  onSubmittingForm = false;
  maxLength = { maxLength: CustomValidation.nameField.maxLength }
  isCreate = true;
  id;
  roles = [];

  // constructor
  constructor(public dialogRef: MatDialogRef<UserDetailsModalComponent>,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("UserDetailsModalComponent | constructor")
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log("UserDetailsModalComponent | ngOnInit")
    try {
      console.log(this.data)
      this.roles = this.data.roles
      this.userForm = new FormGroup({
        firstName: new FormControl('', [Validators.required,
        Validators.maxLength(this.maxLength.maxLength),
        CustomValidation.internationalName
        ]),
        lastName: new FormControl('', [Validators.required,
        Validators.maxLength(this.maxLength.maxLength),
        CustomValidation.internationalName
        ]),
        role: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email, CustomValidation.adiraEmail])
      })
      if (!this.data.isCreate) {
        this.isCreate = false
        let editedUser = this.data.editedUser
        this.email.disable()
        this.id = editedUser.id
        let selectedRole = this.roles.find((el) => {
          return el.id === editedUser.pgroup.group_id
        })
        this.userForm.patchValue({
          firstName: editedUser.firstname,
          lastName: editedUser.lastname,
          role: selectedRole ? selectedRole : '',
          email: editedUser.login.email
        })
      }
    } catch (error) {
      console.error(error)
    }
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

  // role formControl getter
  get role() {
    return this.userForm.get('role');
  }

  //save button click event handler
  save() {
    console.log('UserDetailsModalComponent | save')
    this.onSubmittingForm = true;
    this.userModel = {
      email: this.userForm.value.email,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      groupId: this.userForm.value.role.id
    };
    if (this.isCreate) {
      this.accountService.createUser(this.userModel)
        .subscribe(
          (data: any) => {
            this.handleUpdateCreateSuccess('userDetailsScreen.succesCreated', data);
          },
          error => {
            this.handleApiError('userDetailsScreen.createFailed', error);
          }
        )
    } else {
      let editedUser = {
        firstname: this.userModel.firstName,
        lastname: this.userModel.lastName,
        id: this.id,
        groupId: this.userModel.groupId
      }
      this.onSubmittingForm = true;
      this.accountService.updateUser(editedUser).subscribe(
        (data: any) => {
          this.handleUpdateCreateSuccess('userDetailsScreen.succesUpdated', data);
        },
        error => {
          this.handleApiError('userDetailsScreen.updateFailed', error);
        }
      )
    }

  }

  // handle update or create success result
  handleUpdateCreateSuccess(successTitle, response){
    console.log('UserDetailsModalComponent | handleUpdateCreateSuccess')
    try {
      console.table(response);
      this.onSubmittingForm = false;
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: {
          title: 'success',
          content: {
            text: successTitle,
            data: null
          }
        }
      })
      this.dialogRef.close(true)
    } catch (error) {
      console.log(error)
    }
  }

  // handle api error
  handleApiError(errorTitle, apiError){
    console.log('UserDetailsModalComponent | handleApiError')
    console.table(apiError);
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError);
  }
}
