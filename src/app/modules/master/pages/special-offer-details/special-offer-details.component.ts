import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { Observable, of, forkJoin } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { SpecialOffer } from 'src/app/shared/models/special-offer';
import { LovService } from 'src/app/shared/services/lov.service';
import { catchError, pairwise, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { constants } from 'src/app/shared/common/constants';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-special-offer-details',
  templateUrl: './special-offer-details.component.html',
  styleUrls: []
})
export class SpecialOfferDetailsComponent implements OnInit {
  loading = false;
  onSubmittingForm = false;
  activateRouting = false;
  isCreate = true;
  offerForm: FormGroup;
  categories = [];
  fileList = [];
  filteredFileList = []
  allowCreate = false;
  allowEdit = false;
  tinyMceSettings = constants.tinyMceSettings
  offerTitle = CustomValidation.offerTitle;
  imageRatio = CustomValidation.specialOfferImg.ratio;
  imageRatioPercentage = CustomValidation.specialOfferImg.ratio.height / CustomValidation.specialOfferImg.ratio.width;
  showPreview = false
  approvalStatus = constants.approvalStatus
  private imageInput: ElementRef;
  @ViewChild('imageInput') set imgInput(imageInput: ElementRef) {
    this.imageInput = imageInput;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: SpecialOfferService,
    private modalConfirmation: MatDialog,
    private snackBar: MatSnackBar,
    private fileService: FileManagementService,
    private ng2ImgToolsService: Ng2ImgToolsService,
    private lovService: LovService,
    private authService: AuthService
  ) { }

  // show prompt when routing to another page in edit mode
  canDeactivate(): Observable<boolean> | boolean {
    console.log('SpecialOfferDetailsComponent | canDeactivate');
    if (this.offerForm.dirty && !this.activateRouting) {
      const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
        width: '260px',
        restoreFocus: false,
        data: {
          title: 'movePageConfirmationModal.title',
          content: {
            string: 'movePageConfirmationModal.content',
            data: null
          }
        }
      })
      return modalRef.afterClosed();
    } else {
      this.onSubmittingForm = false;
      return true;
    }
  }

  // id form control getter
  get id() {
    return this.offerForm.get('id');
  }

  // recipient form control getter
  get recipient() {
    return this.offerForm.get('recipient');
  }

  // csvFile form control getter
  get csvFile() {
    return this.offerForm.get('csvFile');
  }

  // category form control getter
  get category() {
    return this.offerForm.get('category');
  }

  // image form control getter
  get image() {
    return this.offerForm.get('image');
  }

  // imageFile form control getter
  get imageFile() {
    return this.offerForm.get('imageFile');
  }

  // oldImage form control getter
  get oldImage() {
    return this.offerForm.get('oldImage');
  }

  // title form control getter
  get title() {
    return this.offerForm.get('title');
  }

  // description form control getter
  get description() {
    return this.offerForm.get('description');
  }

  // termsAndConds form control getter
  get termsAndConds() {
    return this.offerForm.get('termsAndConds');
  }

  // instructions form control getter
  get instructions() {
    return this.offerForm.get('instructions');
  }

  // endDate form control getter
  get endDate() {
    return this.offerForm.get('endDate');
  }

  // endTime form control getter
  get endTime() {
    return this.offerForm.get('endTime');
  }

  // oldEndDate form control getter
  get oldEndDate() {
    return this.offerForm.get('oldEndDate');
  }

  // searchFileKeyword form control getter
  get searchFileKeyword() {
    return this.offerForm.get('searchFileKeyword');
  }

  // on init
  ngOnInit() {
    console.log('SpecialOfferDetailsComponent | ngOnInit')
    this.route.params.subscribe(params => {
      let prvg = this.authService.getFeaturePrivilege(constants.features.specialOffer)
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
      let allowPage = false
      this.offerForm = new FormGroup({
        id: new FormControl(''),
        csvFile: new FormControl(null, [Validators.required, CustomValidation.type('csv')]),
        recipient: new FormControl(null),
        category: new FormControl('', Validators.required),
        image: new FormControl(null, Validators.required),
        imageFile: new FormControl(null, [
          CustomValidation.type(['jpg', 'jpeg', 'png'])
        ]),
        oldImage: new FormControl(null),
        title: new FormControl(null, [Validators.required, Validators.maxLength(this.offerTitle.maxLength)]),
        description: new FormControl(null, Validators.required),
        termsAndConds: new FormControl(null, Validators.required),
        instructions: new FormControl(null, Validators.required),
        endDate: new FormControl(new Date(), Validators.required),
        endTime: new FormControl('', Validators.required),
        oldEndDate: new FormControl(null),
        searchFileKeyword: new FormControl('')
      }, {
          validators: CustomValidation.offerEndDate
        })
      if (this.router.url.includes('update')) {
        this.isCreate = false;
        allowPage = this.allowEdit
      } else {
        this.isCreate = true;
        allowPage = this.allowCreate
      }
      if (allowPage) {
        this.loading = true;
        this.onSubmittingForm = false;
        this.activateRouting = false;
        this.lovService.getSpecialOfferCategory().subscribe(
          response => {
            try {
              console.table(response)
              this.categories = response.data[0].aks_adm_lovs;
              this.offerService.getSpRecipientFiles().subscribe(
                response => {
                  try {
                    this.fileList = response.data
                    this.filteredFileList = this.fileList
                    if (!this.isCreate) {
                      try {
                        this.loading = true;
                        this.csvFile.setValidators([CustomValidation.type('csv')]);
                        const id = params.id
                        this.offerService.getOfferById(id).subscribe(
                          response => {
                            try {
                              console.table(response)
                              let editedOffer: SpecialOffer = Object.assign(new SpecialOffer(), response.data);
                              let oldEndDate = new Date(editedOffer.end_date);
                              let date = new Date(editedOffer.end_date)
                              if (editedOffer.status !== this.approvalStatus.approved) {
                                if (!CustomValidation.durationFromNowValidation(date)) {
                                  this.editOfferError('notificationDetailsScreen.cantUpdate.minDuration')
                                } else {
                                  let hour = date.getHours();
                                  let minute = date.getMinutes();
                                  let time = (hour > 9 ? '' : '0') + hour + ':'
                                    + (minute > 9 ? '' : '0') + minute
                                  this.offerForm.patchValue({
                                    id: id,
                                    image: editedOffer.sp_offer_image,
                                    imageFile: null,
                                    oldImage: editedOffer.sp_offer_image,
                                    title: editedOffer.title,
                                    description: editedOffer.description,
                                    termsAndConds: editedOffer.terms_and_conditions,
                                    instructions: editedOffer.instructions,
                                    endDate: date,
                                    endTime: time,
                                    oldEndDate: oldEndDate,
                                    category: editedOffer.category,
                                    recipient: editedOffer.url
                                  })
                                  this.recipient.disable()
                                  this.category.disable()
                                }
                              } else {
                                this.editOfferError('specialOfferDetailsScreen.cantUpdate.approvedOffer')
                              }
                            } catch (error) {
                              console.table(error)
                            }
                          }, error => {
                            console.table(error);
                            let errorSnackbar = this.authService.handleApiError('specialOfferDetailsScreen.getOfferFailed', error)
                            if (errorSnackbar) {
                              errorSnackbar.afterDismissed().subscribe(() => {
                                this.goToListScreen()
                              })
                            }
                          }
                        ).add(() => {
                          this.loading = false;
                        })
                      } catch (error) {
                        console.table(error)
                      }
                    } else {
                      this.loading = false
                      this.handleCategoryChange()
                      this.handleChangeFilterText()
                    }
                  } catch (error) {
                    console.error(error)
                    this.loading = false
                  }

                }, error => {
                  console.table(error);
                  this.loading = false;
                  let errorSnackbar = this.authService.handleApiError('specialOfferDetailsScreen.getFileListFailed', error)
                  if (errorSnackbar) {
                    errorSnackbar.afterDismissed().subscribe(() => {
                      this.goToListScreen()
                    })
                  }
                }
              )
            } catch (error) {
              console.table(error)
              this.loading = false
            }
          }, error => {
            console.table(error);
            this.loading = false
            let errorSnackbar = this.authService.handleApiError('specialOfferDetailsScreen.getCategoryFailed', error)
            if (errorSnackbar) {
              errorSnackbar.afterDismissed().subscribe(() => {
                this.goToListScreen()
              })
            }
          }
        )
      } else {
        this.authService.blockOpenPage()
      }
    })
  }

  // Method to handle filter search text for file list
  handleChangeFilterText() {
    console.log("SpecialOfferDetailsComponent | handleChangeFilterText");
    this.searchFileKeyword.valueChanges.subscribe(value => {
      if (value) {
        this.filteredFileList = [];
        this.fileList.forEach((file) => {
          if (file.name.toLowerCase().includes(value.toLowerCase())) {
            this.filteredFileList.push(file);
          }
        });
      } else {
        this.filteredFileList = this.fileList;
      }
    })
  }

  // handle when category form value change
  handleCategoryChange() {
    console.log('SpecialOfferDetailsComponent | handleCategoryChange')
    this.category.valueChanges.pipe(startWith(null), pairwise()).subscribe((
      [prev, next]) => {
      const formValue = this.offerForm.getRawValue()
      let recipient = formValue.recipient
      let csvFile = formValue.csvFile
      if (this.isSelectedCategoryMPL()) {
        this.recipient.setValidators(Validators.required)
        this.csvFile.setValidators([CustomValidation.type('csv')]);
        csvFile = null
        recipient = ''
      } else {
        this.recipient.clearValidators()
        this.csvFile.setValidators([Validators.required, CustomValidation.type('csv')]);
        if (prev.toLowerCase().includes(constants.specialOfferCategory.mpl)) {
          this.recipient.setValue('')
          csvFile = null
        }
      }
      this.filteredFileList = this.fileList
      this.offerForm.patchValue({
        csvFile: csvFile,
        recipient: recipient,
        searchFileKeyword: ''
      })
    }, error => {
      console.error(error)
    })
  }

  // check is selected category is mpl
  isSelectedCategoryMPL() {
    let cat = this.category.value
    return cat && cat.toLowerCase().includes(constants.specialOfferCategory.mpl)
  }

  // handling onchange file event for
  onChangeCSVFile(event) {
    console.log('SpecialOfferDetailsComponent | onChangeCSVFile')
    const file = event.target.files[0];
    if (file) {
      this.csvFile.setValue(file);
      this.csvFile.markAsDirty()
      this.recipient.reset()
      if (this.csvFile.valid || !this.csvFile.errors.type) {
        this.recipient.markAsDirty();
        this.recipient.markAsTouched();
      } else {
        event.target.files = null
      }
    }
  }

  // handling delete icon event
  onDeleteImage() {
    console.log('SpecialOfferDetailsComponent | onDeleteIcon')
    if (this.imageFile.value || this.image.value !== '') {
      this.imageFile.markAsDirty();
      this.image.markAsDirty();
    }
    this.imageFile.setValue(null);
    this.image.setValue('');
    this.imageFile.markAsTouched();
    this.image.markAsTouched();
    this.imageInput.nativeElement.value = '';
  }

  // handling onChangeImageFile event
  onChangeImageFile(event) {
    console.log('SpecialOfferDetailsComponent | onChangeFile')
    const file = event.target.files[0];
    if (file) {
      this.onDeleteImage();
      this.imageFile.markAsDirty();
      this.image.markAsDirty();
      this.imageFile.setValue(file)
      if (this.imageFile.valid || !this.imageFile.errors.type) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.image.setValue(e.target['result'])
        };

        reader.readAsDataURL(file);
        CustomValidation.imageRatio(
          this.imageFile,
          this.imageRatio.width,
          this.imageRatio.height
        )
      } else {
        this.image.setValue('')
      }
    }
  }

  save() {
    console.log('SpecialOfferDetailsComponent | save')
    let allowSave = false;
    if (this.isCreate) {
      allowSave = this.allowCreate
    } else {
      allowSave = this.allowEdit
    }
    if (allowSave) {
      const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
        width: '260px',
        restoreFocus: false,
        data: {
          title: 'dataConfirmationModal.title',
          content: {
            string: 'dataConfirmationModal.content',
            data: null
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.onSubmittingForm = true;
          if (this.isCreate) {
            if (CustomValidation.durationFromNowValidation(this.endDate.value)) {
              this.uploadFiles();
            } else {
              this.onSubmittingForm = false;
              this.showFormError()
              this.offerForm.updateValueAndValidity()
            }
          } else {
            if (CustomValidation.durationFromNowValidation(this.oldEndDate.value)) {
              if (CustomValidation.durationFromNowValidation(this.endDate.value)) {
                if (this.oldImage.value === this.image.value) {
                  let formValue = this.offerForm.getRawValue();
                  let endDate = new Date(formValue.endDate);
                  let timeSplit = formValue.endTime.split(':')
                  let hrs = Number(timeSplit[0])
                  let min = Number(timeSplit[1])
                  endDate.setHours(hrs, min, 0, 0)
                  let offer = new SpecialOffer();
                  offer.id = formValue.id;
                  offer.sp_offer_image = formValue.image;
                  offer.title = formValue.title;
                  offer.description = formValue.description;
                  offer.terms_and_conditions = formValue.termsAndConds;
                  offer.instructions = formValue.instructions;
                  offer.end_date = endDate;
                  offer.category = formValue.category;
                  offer.status = this.approvalStatus.waitingForApproval
                  offer.status_by = null
                  offer.status_dt = null
                  offer.url = formValue.recipient
                  this.updateOffer(offer)
                } else {
                  this.uploadFiles()
                }
              } else {
                this.onSubmittingForm = false;
                this.showFormError()
                this.offerForm.updateValueAndValidity()
              }
            } else {
              this.editOfferError('notificationDetailsScreen.cantUpdate.minDuration');
            }
          }
        }
      })
    } else {
      this.authService.blockPageAction()
    }
  }

  // upload csv and image
  uploadFiles() {
    console.log('SpecialOfferDetailsComponent | uploadFiles')
    this.ng2ImgToolsService.compress([this.imageFile.value], this.fileService.compressImageSizeInMB, true).subscribe(
      compressedImg => {
        console.log(compressedImg)
        let offer = new SpecialOffer();
        let formValue = this.offerForm.getRawValue();
        let endDate = new Date(formValue.endDate);
        let timeSplit = formValue.endTime.split(':')
        let hrs = Number(timeSplit[0])
        let min = Number(timeSplit[1])
        endDate.setHours(hrs, min, 0, 0)
        if (this.isCreate) {
          offer.title = formValue.title;
          offer.description = formValue.description;
          offer.terms_and_conditions = formValue.termsAndConds;
          offer.instructions = formValue.instructions;
          offer.end_date = endDate;
          offer.category = formValue.category;
          offer.status = this.approvalStatus.waitingForApproval;
          offer.status_by = null
          offer.status_dt = null
          if (this.isSelectedCategoryMPL()) {
            offer.url = formValue.recipient
            this.uploadFilesMPL(compressedImg, offer)
          } else {
            this.uploadFilesNonMPL(compressedImg, formValue.csvFile, offer)
          }
        } else {
          this.fileService.getUploadUrl(compressedImg, this.fileService.specialOfferComponent).subscribe(
            response => {
              try {
                console.table(response)
                let imgUploadUrl = response.data.signurl;
                this.fileService.uploadFile(imgUploadUrl, compressedImg).subscribe(
                  response => {
                    console.table(response)
                    offer.id = formValue.id;
                    offer.sp_offer_image = imgUploadUrl.split('?')[0];
                    offer.title = formValue.title;
                    offer.description = formValue.description;
                    offer.terms_and_conditions = formValue.termsAndConds;
                    offer.instructions = formValue.instructions;
                    offer.end_date = endDate;
                    offer.category = formValue.category
                    offer.status = this.approvalStatus.waitingForApproval
                    offer.status_by = null
                    offer.status_dt = null
                    offer.url = formValue.recipient
                    this.updateOffer(offer, true)
                  }, error => {
                    console.table(error)
                    this.onSubmittingForm = false
                    this.authService.openSnackbarError('specialOfferDetailsScreen.uploadImageFailed', 'error')
                  }
                )
              } catch (error) {
                console.error(error)
                this.onSubmittingForm = false;
              }
            }, error => {
              this.handleSubmitError('specialOfferDetailsScreen.uploadImageFailed', error);
            }
          )
        }
      }, error => {
        console.table(error);
        this.onSubmittingForm = false;
      }
    )
  }

  //method to handle uploading files for creating mpl special offer
  uploadFilesMPL(compressedImg, offer) {
    console.log('SpecialOfferDetailsComponent | uploadFilesMPL')
    this.fileService.getUploadUrl(compressedImg, this.fileService.specialOfferComponent).subscribe(
      response => {
        try {
          let imgUrlRes = response
          console.table(imgUrlRes)
          let imgUploadUrl = imgUrlRes.data.signurl
          this.fileService.uploadFile(imgUploadUrl, compressedImg).subscribe(
            response => {
              offer.sp_offer_image = imgUploadUrl.split('?')[0];
              this.insertOffer(offer);
            }, error => {
              this.onSubmittingForm = false;
              this.authService.openSnackbarError('specialOfferDetailsScreen.uploadImageFailed', 'error')
            }
          )
        } catch (error) {
          console.log(error)
          this.onSubmittingForm = false
        }
      }, error => {
        this.handleSubmitError('specialOfferDetailsScreen.uploadImageFailed', error);
      }
    )
  }

  //method to handle uploading files for creating non mpl special offer
  uploadFilesNonMPL(compressedImg, csvFile, offer) {
    console.log('SpecialOfferDetailsComponent | uploadFilesNonMPL')
    let uploadUrlTasks = [
      this.fileService.getUploadUrl(compressedImg, this.fileService.specialOfferComponent).pipe(catchError(e => of(e))),
      this.fileService.getUploadUrl(csvFile, this.fileService.specialOfferRecipientComp).pipe(catchError(e => of(e)))
    ]
    forkJoin(uploadUrlTasks).subscribe((responses: Array<any>) => {
      let imgUrlRes = responses[0]
      let csvUrlRes = responses[1]
      console.table(imgUrlRes)
      console.table(csvUrlRes)
      if (imgUrlRes instanceof HttpErrorResponse) {
        this.handleSubmitError('specialOfferDetailsScreen.uploadImageFailed', imgUrlRes)
      } else if (csvUrlRes instanceof HttpErrorResponse) {
        this.handleSubmitError('specialOfferDetailsScreen.uploadCSVFailed', csvUrlRes)
      } else {
        try {
          let imgUploadUrl = imgUrlRes.data.signurl
          let csvUploadUrl = csvUrlRes.data.signurl
          let tasks = [
            this.fileService.uploadFile(imgUploadUrl, compressedImg).pipe(catchError(e => of(e))),
            this.fileService.uploadFile(csvUploadUrl, csvFile).pipe(catchError(e => of(e)))
          ]
          forkJoin(tasks).subscribe((responses: Array<any>) => {
            let imageResponse = responses[0];
            let csvResponse = responses[1];
            try {
              console.table(imageResponse)
              console.table(csvResponse)
              if (imageResponse instanceof HttpErrorResponse) {
                this.onSubmittingForm = false;
                this.authService.openSnackbarError('specialOfferDetailsScreen.uploadImageFailed', 'error')
              } else if (csvResponse instanceof HttpErrorResponse) {
                this.onSubmittingForm = false;
                this.authService.openSnackbarError('specialOfferDetailsScreen.uploadCSVFailed', 'error')
              } else {
                offer.url = csvUploadUrl.split('?')[0];
                offer.sp_offer_image = imgUploadUrl.split('?')[0];
                this.insertOffer(offer);
              }
            } catch (error) {
              console.table(error)
              this.onSubmittingForm = false;
            }
          })
        } catch (error) {
          console.error(error)
          this.onSubmittingForm = false;
        }
      }
    })
  }
  // call insert offer api
  insertOffer(data) {
    console.log('SpecialOfferDetailsComponent | insertOffer')
    this.offerService.createOffer(data).subscribe(
      response => {
        this.onSubmittingForm = false;
        let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'specialOfferDetailsScreen.succesCreated',
              data: null
            }
          }
        })
        successSnackbar.afterDismissed().subscribe(() => {
          this.goToListScreen()
        })
      }, error => {
        this.handleSubmitError('specialOfferDetailsScreen.createFailed', error)
      }
    )
  }

  // call update offer api
  updateOffer(data, shouldDeleteImage = false) {
    console.log('SpecialOfferDetailsComponent | updateOffer')
    this.offerService.updateOffer(data).subscribe(
      response => {
        if (shouldDeleteImage) {
          this.deleteImage(this.oldImage.value)
        } else {
          this.onSubmittingForm = false;
          let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: 'specialOfferDetailsScreen.succesUpdated',
                data: null
              }
            }
          })
          successSnackbar.afterDismissed().subscribe(() => {
            this.goToListScreen()
          })
        }
      }, error => {
        this.handleSubmitError('specialOfferDetailsScreen.updateFailed', error);
      }
    )
  }

  // call delete image api
  deleteImage(url) {
    console.log('SpecialOfferDetailsComponent | deleteImage')
    let split = url.split('/')
    let name = url
    if (split.length >= 2) {
      name = split.pop()
      name = split.pop() + '/' + name;
    }
    let data = {
      name: name
    }
    this.fileService.deleteFile(data).subscribe(
      response => {
        console.table(response);
        this.onSubmittingForm = false;
        let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'specialOfferDetailsScreen.succesUpdated',
              data: null
            }
          }
        })
        snackbarSucess.afterDismissed().subscribe(() => {
          this.goToListScreen();
        })
      }, error => {
        this.handleSubmitError('specialOfferDetailsScreen.deleteIconFailed', error);
      }
    )
  }

  //show form invalid error snackbar
  showFormError() {
    console.log('NotificationDetailsComponent | showFormError')
    let errorText = '';
    if (this.offerForm.errors.endDateRequired) {
      errorText = 'forms.endDate.errorRequired';
    } else if (this.offerForm.errors.endDateMin) {
      errorText = 'forms.endDate.errorMin';
    }
    this.authService.openSnackbarError('invalidForm', errorText)
  }

  // show error if to be edited offer data is not valid eq: end date <= 1 hr
  editOfferError(errorText) {
    console.log('SpecialOfferDetailsComponent | editOfferError')
    let errorSnackbar = this.authService.openSnackbarError('error', errorText);
    if (errorSnackbar) {
      errorSnackbar.afterDismissed().subscribe(() => {
        this.goToListScreen();
      })
    }
  }

  //return now datetime with second and ms set to 0
  now() {
    console.log('SpecialOfferDetailsComponent | now')
    let now = new Date();
    now.setSeconds(0, 0)
    return now;
  }

  //redirect to special offer list screen
  goToListScreen = () => {
    console.log('SpecialOfferDetailsComponent | gotoListScreen')
    this.activateRouting = true;
    this.router.navigate(['/master/special-offers'])
  }

  // handle stop loading and show error snackbar on api error
  handleSubmitError(errorTitle, apiError) {
    console.log('SpecialOfferDetailsComponent | handleSubmitError')
    console.table(apiError)
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError);
  }
}
