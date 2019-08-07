import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './modules/angular-material.module';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from './services/account.service';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from './components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from './components/error-snackbar/error-snackbar.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { PasswordToggleInputComponent } from './components/password-toggle-input/password-toggle-input.component';
import { LovService } from './services/lov.service';
import { CreditSimulationService } from './services/credit-simulation.service';
import { MaskedNumInputComponent } from './components/masked-num-input/masked-num-input.component';
import { FileManagementService } from './services/file-management.service';
import { BoldRendererPipe } from './pipes/bold-renderer.pipe';
import { ArticleService } from './services/article.service';
import { SpecialOfferService } from './services/special-offer.service';
import { TinymceEditorComponent } from './components/tinymce-editor/tinymce-editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    ErrorModalComponent, 
    ConfirmationModalComponent, 
    SuccessSnackbarComponent, 
    ErrorSnackbarComponent, 
    PasswordToggleInputComponent, 
    MaskedNumInputComponent, 
    BoldRendererPipe, 
    TinymceEditorComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    HttpClientModule,
    TranslateModule,
    ReactiveFormsModule,
    EditorModule,
    NgxMatSelectSearchModule
  ], 
  exports: [
    AngularMaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PasswordToggleInputComponent,
    MaskedNumInputComponent,
    BoldRendererPipe,
    TinymceEditorComponent,
    EditorModule,
    NgxMatSelectSearchModule
  ],
  providers:[
    AuthService,
    AccountService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
      duration: 5000,
      panelClass: ['notif-snackbar'],
      verticalPosition: 'top',
    }},
    LovService,
    CreditSimulationService,
    FileManagementService,
    ArticleService,
    SpecialOfferService
  ],
  entryComponents: [
    ErrorModalComponent,
    ConfirmationModalComponent,
    ErrorSnackbarComponent,
    SuccessSnackbarComponent
  ]
})
export class SharedModule { }
