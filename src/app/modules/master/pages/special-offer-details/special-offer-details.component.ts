import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import * as papa from 'papaparse';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { environment } from 'src/environments/environment';
import * as tinymce from 'tinymce';

@Component({
  selector: 'app-special-offer-details',
  templateUrl: './special-offer-details.component.html',
  styleUrls: []
})
export class SpecialOfferDetailsComponent implements OnInit {
  loading = false;
  onSubmittingForm = false;
  onProcessingCSV = false;
  isCreate = true;
  offerForm: FormGroup;
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
    // private offerService: SpecialOfferService,
    private snackBar: MatSnackBar,
    private fileService: FileManagementService,
    private ng2ImgToolsService: Ng2ImgToolsService
  ) { }

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
      this.onProcessingCSV = false;
      this.offerForm = new FormGroup({
        id: new FormControl(''),
        csvFile: new FormControl(null, CustomValidation.type('csv')),
        recipient: new FormControl(null, Validators.required),
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
      if (this.router.url.includes('update')) {
        try {
          this.isCreate = false;
          this.loading = true;
          this.recipient.setValidators([]);
          const id = params.id
          // this.offerService.getOfferById(id).subscribe(
          //   response => {
          //     try {
          //       console.table(response)
          //       let editedOffer: SpecialOffer = response.data;
          //       if (!CustomValidation.durationFromNowValidation(editedOffer.end_date)) {
          //         this.editOfferError('notificationDetailsScreen.cantUpdate.minDuration')
          //       } else {
          //         let date = new Date(editedOffer.endDate)
          //         let hour = date.getHours();
          //         let minute = date.getMinutes();
          //         let time = (hour > 9 ? '' : '0') + hour + ':'
          //           + (minute > 9 ? '' : '0') + minute
          //         this.offerForm.patchValue({
          //           id: id,
          //           image: editedOffer.image,
          //           imageFile: null,
          //           oldImage: editedOffer.image,
          //           title: editedOffer.title,
          //           description: editedOffer.description
          //           termsAndConds: editedOffer.termsAndConds,
          //           instructions: editedOffer.instructions
          //           endDate: date,
          //           endTime: time,
          //           oldEndDate: date
          //         })
          //       }
          //     } catch (error) {
          //       console.table(error)
          //     }
          //   }, error => {
          //     try {
          //       console.table(error);
          //       let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          //         data: {
          //           title: 'specialOfferDetailsScreen.getOfferFailed',
          //           content: {
          //             text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
          //             data: null
          //           }
          //         }
          //       })
          //       errorSnackbar.afterDismissed().subscribe(() => {
          //         this.goToListScreen()
          //       })
          //     } catch (error) {
          //       console.log(error)
          //     }
          //   }
          // ).add(() => {
          //   this.loading = false;
          // })
        } catch (error) {
          console.table(error)
        }
      } else {
        this.isCreate = true;
      }
    })
  }

  // handling onchange file event for
  onChangeCSVFile(event) {
    console.log('SpecialOfferDetailsComponent | onChangeCSVFile')
    const file = event.target.files[0];
    if (file) {
      this.onProcessingCSV = true;
      this.csvFile.setValue(file);
      this.csvFile.markAsDirty()
      this.recipient.reset()
      if (this.csvFile.valid || !this.csvFile.errors.type) {
        papa.parse(file, {
          complete: (results, file) => {
            console.table(results)
            event.target.files = null
            let arr = [];
            try {
              let oids = results.data;
              let wrongFormat = false;
              for (let i = 0; i < oids.length; i++) {
                let oid = oids[i][0].trim();
                if (oid !== '') {
                  if (/^[0-9]+$/.test(oid)) {
                    arr.push(oid)
                  } else {
                    wrongFormat = true;
                    break;
                  }
                }
              }
              if (arr.length > 0) {
                if (wrongFormat) {
                  this.recipient.setErrors({ format: true })
                } else {
                  this.recipient.setValue(arr)
                  this.recipient.setErrors(null)
                }
              } else if (wrongFormat) {
                this.recipient.setErrors({ format: true })
              }
              this.recipient.markAsDirty();
              this.recipient.markAsTouched();
              this.onProcessingCSV = false;
              console.log(this.recipient)
            } catch (error) {
              console.table(error)
              this.onProcessingCSV = false;
            }
          }
        })
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
        console.log(this.offerForm)
      } else {
        this.image.setValue('')
      }
    }
  }

  save() {
    console.log('SpecialOfferDetailsComponent | save')
    this.onSubmittingForm = true;
    if (this.isCreate) {
      if (CustomValidation.durationFromNowValidation(this.endDate.value)) {
        this.uploadImage();
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
            let offer = {
              id: formValue.id,
              image: formValue.image,
              title: formValue.title,
              description: formValue.description,
              tnc: formValue.termsAndConds,
              instructions: formValue.instructions,
              endDate: endDate,
            }
            this.updateOffer(offer)
          } else {
            this.uploadImage()
          }
        } else {
          this.onSubmittingForm = false;
          this.showFormError()
          this.offerForm.updateValueAndValidity()
        }
      } else {
        this.onSubmittingForm = false;
        this.editOfferError('notificationDetailsScreen.cantUpdate.minDuration');
      }
    }
  }

  // compress image & call upload image api
  uploadImage() {
    console.log('SpecialOfferDetailsComponent | uploadImage')
    this.ng2ImgToolsService.compress([this.imageFile.value], this.fileService.compressImageSizeInMB).subscribe(
      compressedImg => {
        console.log(compressedImg)
        // let formData = new FormData()
        // formData.append("file", compressedImg)
        // formData.append("component", this.fileService.specialOfferComponent)
        // this.fileService.uploadFile(formData).subscribe(
        //   response => {
        //     let formValue = this.offerForm.value;
        //     let endDate = new Date(formValue.endDate);
        //     let timeSplit = formValue.endTime.split(':')
        //     let hrs = Number(timeSplit[0])
        //     let min = Number(timeSplit[1])
        //     endDate.setHours(hrs, min, 0, 0)
        //     let url = response.data.url
        //     if (this.isCreate) {
        //       let offer = {
        //         recipient: formValue.recipient,
        //         image: url,
        //         title: formValue.title,
        //         description: formValue.description,
        //         tnc: formValue.termsAndConds,
        //         instructions: formValue.instructions,
        //         endDate: endDate,
        //       }
        //       this.insertOffer(offer);
        //     } else {
        //       let offer = {
        //         id: formValue.id,
        //         image: url,
        //         title: formValue.title,
        //         description: formValue.description,
        //         tnc: formValue.termsAndConds,
        //         instructions: formValue.instructions,
        //         endDate: endDate,
        //       }
        //       this.updateOffer(offer, true)
        //     }
        //   }, error => {
        //     try {
        //       console.table(error)
        //       this.onSubmittingForm = false;
        //       this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        //         data: {
        //           title: 'specialOfferDetailsScreen.uploadIconFailed',
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
      }, error => {
        console.table(error);
        this.onSubmittingForm = false;
      }
    )
  }

  // call insert offer api
  insertOffer(data) {
    console.log('SpecialOfferDetailsComponent | insertOffer')
    // this.offerService.createOffer(data).subscribe(
    //   response => {
    //     this.onSubmittingForm = false;
    //     let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //       data: {
    //         title: 'success',
    //         content: {
    //           text: 'specialOfferDetailsScreen.succesCreated',
    //           data: null
    //         }
    //       }
    //     })
    //     successSnackbar.afterDismissed().subscribe(() => {
    //       this.goToListScreen()
    //     })
    //   }, error => {
    //     try {
    //       console.table(error)
    //       this.onSubmittingForm = false;
    //       this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //         data: {
    //           title: 'specialOfferDetailsScreen.createFailed',
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

  // call update offer api
  updateOffer(data, shouldDeleteImage = false) {
    console.log('SpecialOfferDetailsComponent | updateOffer')
    // this.offerService.updateOffer(data).subscribe(
    //   response => {
    //     if(shouldDeleteImage){
    //       this.deleteImage(data.image)
    //     } else {
    //       this.onSubmittingForm = false;
    //       let successSnackbar = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //         data: {
    //           title: 'success',
    //           content: {
    //             text: 'specialOfferDetailsScreen.succesUpdated',
    //             data: null
    //           }
    //         }
    //       })
    //       successSnackbar.afterDismissed().subscribe(() => {
    //         this.goToListScreen()
    //       })
    //     }
    //   }, error => {
    //     try {
    //       console.table(error)
    //       this.onSubmittingForm = false;
    //       this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //         data: {
    //           title: 'specialOfferDetailsScreen.createFailed',
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
    this.router.navigate(['/master/special-offers'])
  }

}
