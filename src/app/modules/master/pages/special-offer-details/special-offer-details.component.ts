import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { environment } from 'src/environments/environment';
import { Observable, of, forkJoin } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { SpecialOffer } from 'src/app/shared/models/special-offer';
import { LovService } from 'src/app/shared/services/lov.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { toBase64String } from '@angular/compiler/src/output/source_map';

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
  tinyMceSettings = environment.tinyMceSettings
  offerTitle = CustomValidation.offerTitle;
  imageRatio = CustomValidation.specialOfferImg.ratio;
  imageRatioPercentage = CustomValidation.specialOfferImg.ratio.height / CustomValidation.specialOfferImg.ratio.width;
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
    private lovService: LovService
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

  // on init
  ngOnInit() {
    console.log('SpecialOfferDetailsComponent | ngOnInit')
    this.route.params.subscribe(params => {
      this.loading = false;
      this.onSubmittingForm = false;
      this.activateRouting = false;
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
        oldEndDate: new FormControl(null)
      }, {
          validators: CustomValidation.offerEndDate
        })
      this.lovService.getSpecialOfferCategory().subscribe(
        response => {
          try {
            console.table(response)
            this.categories = response.data[0].aks_adm_lovs;
            if (this.router.url.includes('update')) {
              try {
                this.isCreate = false;
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
                          category: editedOffer.category
                        })
                      }
                    } catch (error) {
                      console.table(error)
                    }
                  }, error => {
                    try {
                      console.table(error);
                      let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                        data: {
                          title: 'specialOfferDetailsScreen.getOfferFailed',
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
                  }
                ).add(() => {
                  this.loading = false;
                })
              } catch (error) {
                console.table(error)
              }
            } else {
              this.isCreate = true;
            }
          } catch (error) {
            console.table(error)
          }
        }, error => {
          try {
            console.table(error);
            let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'specialOfferDetailsScreen.getCategoryFailed',
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
        }
      )
    })
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
                let formValue = this.offerForm.value;
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
  }

  // upload csv and image
  uploadFiles() {
    console.log('SpecialOfferDetailsComponent | uploadFiles')
    this.ng2ImgToolsService.compress([this.imageFile.value], this.fileService.compressImageSizeInMB, true).subscribe(
      compressedImg => {
        console.log(compressedImg)
        let imageFormData = new FormData()
        imageFormData.append("file", compressedImg)
        imageFormData.append("component", this.fileService.specialOfferComponent)
        let offer = new SpecialOffer();
        let formValue = this.offerForm.value;
        let endDate = new Date(formValue.endDate);
        let timeSplit = formValue.endTime.split(':')
        let hrs = Number(timeSplit[0])
        let min = Number(timeSplit[1])
        endDate.setHours(hrs, min, 0, 0)
        if (this.isCreate) {
          let csvFormData = new FormData();
          csvFormData.append("file", formValue.csvFile)
          csvFormData.append("component", this.fileService.specialOfferRecipientComp)
          let convertTasks = [
            this.fileService.fileToBase64(compressedImg).pipe(catchError(e => of(e))),
            this.fileService.fileToBase64(formValue.csvFile).pipe(catchError(e => of(e)))
          ]
          forkJoin(convertTasks).subscribe((responses: Array<any>) => {
            let imgConvertRes = responses[0]
            let csvConvertRes = responses[1]
            console.log(imgConvertRes)
            console.log(csvConvertRes)
            if(imgConvertRes instanceof DOMException){
              this.onSubmittingForm = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'specialOfferDetailsScreen.uploadImageFailed',
                  content: {
                    text: 'failedToProcessFile',
                    data: null
                  }
                }
              })
            } else if (csvConvertRes instanceof DOMException){
              this.onSubmittingForm = false;
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'specialOfferDetailsScreen.uploadCSVFailed',
                  content: {
                    text: 'failedToProcessFile',
                    data: null
                  }
                }
              })
            } else {
              imageFormData.set('file', imgConvertRes)
              csvFormData.set('file', csvConvertRes)
              let tasks = [
                this.fileService.uploadFile(imageFormData).pipe(catchError(e => of(e))),
                this.fileService.uploadFile(csvFormData).pipe(catchError(e => of(e)))
              ]
              forkJoin(tasks).subscribe((responses: Array<any>) => {
                let imageResponse = responses[0];
                let csvResponse = responses[1];
                try {
                  console.table(imageResponse)
                  console.table(csvResponse)
                  if (imageResponse instanceof HttpErrorResponse) {
                    this.onSubmittingForm = false;
                    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                      data: {
                        title: 'specialOfferDetailsScreen.uploadImageFailed',
                        content: {
                          text: 'apiErrors.' + (imageResponse.status ? imageResponse.error.err_code : 'noInternet'),
                          data: null
                        }
                      }
                    })
                  } else if (csvResponse instanceof HttpErrorResponse) {
                    this.onSubmittingForm = false;
                    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                      data: {
                        title: 'specialOfferDetailsScreen.uploadCSVFailed',
                        content: {
                          text: 'apiErrors.' + (csvResponse.status ? csvResponse.error.err_code : 'noInternet'),
                          data: null
                        }
                      }
                    })
                  } else {
                    offer.url = csvResponse.data.url;
                    offer.sp_offer_image = imageResponse.data.url;
                    offer.title = formValue.title;
                    offer.description = formValue.description;
                    offer.terms_and_conditions = formValue.termsAndConds;
                    offer.instructions = formValue.instructions;
                    offer.end_date = endDate;
                    offer.category = formValue.category
                    this.insertOffer(offer);
                  }
                } catch (error) {
                  console.table(error)
                  this.onSubmittingForm = false;
                }
              })
            }
          })
        } else {
          this.fileService.fileToBase64(imageFormData.get('file')).subscribe(base64String => {
            imageFormData.set('file', base64String)
            this.fileService.uploadFile(imageFormData).subscribe(
              response => {
                try {
                  console.table(response)
                  offer.id = formValue.id;
                  offer.sp_offer_image = response.data.url;
                  offer.title = formValue.title;
                  offer.description = formValue.description;
                  offer.terms_and_conditions = formValue.termsAndConds;
                  offer.instructions = formValue.instructions;
                  offer.end_date = endDate;
                  offer.category = formValue.category
                  this.updateOffer(offer, true)
                } catch (error) {
                  console.table(error)
                  this.onSubmittingForm = false;
                }
              }, error => {
                try {
                  console.table(error)
                  this.onSubmittingForm = false;
                  this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                    data: {
                      title: 'specialOfferDetailsScreen.uploadImageFailed',
                      content: {
                        text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                        data: null
                      }
                    }
                  })
                } catch (error) {
                  console.table(error)
                  this.onSubmittingForm = false;
                }
              }
            )
          }, error => {
            console.error(error);
            this.onSubmittingForm = false;
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'specialOfferDetailsScreen.uploadImageFailed',
                content: {
                  text: 'failedToProcessFile',
                  data: null
                }
              }
            })
          })
        }
      }, error => {
        console.table(error);
        this.onSubmittingForm = false;
      }
    )
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
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'specialOfferDetailsScreen.createFailed',
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
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'specialOfferDetailsScreen.createFailed',
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
        try {
          console.table(error)
          this.onSubmittingForm = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'specialOfferDetailsScreen.deleteIconFailed',
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

  //show form invalid error snackbar
  showFormError() {
    console.log('NotificationDetailsComponent | showFormError')
    let errorText = '';
    let data = null;
    if (this.offerForm.errors.endDateRequired) {
      errorText = 'forms.endDate.errorRequired';
    } else if (this.offerForm.errors.endDateMin) {
      errorText = 'forms.endDate.errorMin';
    }
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'invalidForm',
        content: {
          text: errorText,
          data: data
        }
      }
    })
  }

  // show error if to be edited offer data is not valid eq: end date <= 1 hr
  editOfferError(errorText) {
    console.log('SpecialOfferDetailsComponent | editOfferError')
    let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'error',
        content: {
          text: errorText,
          data: null
        }
      }
    })
    errorSnackbar.afterDismissed().subscribe(() => {
      this.goToListScreen();
    })
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

}
