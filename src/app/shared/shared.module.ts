import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './modules/angular-material.module';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {TranslateModule} from '@ngx-translate/core';
import { AccountService } from './services/account.service';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from './components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from './components/error-snackbar/error-snackbar.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  declarations: [ErrorModalComponent, ConfirmationModalComponent, SuccessSnackbarComponent, ErrorSnackbarComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    HttpClientModule,
    TranslateModule
  ], 
  exports: [
    AngularMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers:[
    AuthService,
    AccountService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
      duration: 5000,
      panelClass: ['notif-snackbar'],
      verticalPosition: 'top',
    }}
  ],
  entryComponents: [
    ErrorModalComponent,
    ConfirmationModalComponent,
    ErrorSnackbarComponent,
    SuccessSnackbarComponent
  ]
})
export class SharedModule { }
