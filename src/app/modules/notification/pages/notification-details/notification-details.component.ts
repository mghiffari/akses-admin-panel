import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { NotifConfirmModalComponent } from '../../components/notif-confirm-modal/notif-confirm-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { Notification } from '../../models/notification';
import { NotificationService } from '../../services/notification.service';
import { ArticleData } from 'src/app/modules/master/models/articles';
import { environment } from 'src/environments/environment';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: []
})
export class NotificationDetailsComponent implements OnInit {
  appName = environment.appName;
  notifForm: FormGroup;
  editedNotification: Notification;
  onSubmittingForm = false;
  id;
  isCreate = true;
  loading = true;
  selectedLinkTitle = '';
  articles = [];
  specialOffers = [];
  notifTitle = CustomValidation.notifTitle;
  notifContent = CustomValidation.notifContent;
  notifImageRes = CustomValidation.notifImage.resolution;
  notifImageRatioPercentage = this.notifImageRes.height / this.notifImageRes.width;
  notifIconRes = CustomValidation.notifLargeIcon.resolution;
  private imageInput: ElementRef;
  @ViewChild('imageInput') set imgInput(imageInput: ElementRef) {
    this.imageInput = imageInput;
  }

  private iconInput: ElementRef;
  @ViewChild('iconInput') set icnInput(iconInput: ElementRef) {
    this.iconInput = iconInput;
  }
  constructor(
    private notifService: NotificationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private modal: MatDialog,
    private overlay: Overlay,
    private articleService: ArticleService,
    private offerService: SpecialOfferService
  ) { }

  //component on init
  ngOnInit() {
    console.log("NotificationDetailsComponent | OnInit")
    this.route.params.subscribe(
      params => {
        this.loading = true;
        this.notifForm = new FormGroup({
          recipientType: new FormControl(false, Validators.required),
          recipient: new FormControl(null),
          // oldRecipient: new FormControl(null),
          csvFile: new FormControl(null, CustomValidation.type('csv')),
          icon: new FormControl(null),
          oldIcon: new FormControl(null),
          iconFile: new FormControl(null, CustomValidation.type(['jpg', 'jpeg', 'png'])),
          image: new FormControl(null),
          oldImage: new FormControl(null),
          imageFile: new FormControl(null, CustomValidation.type(['jpg', 'jpeg', 'png'])),
          title: new FormControl('', [Validators.required, Validators.maxLength(this.notifTitle.maxLength)]),
          content: new FormControl('', [Validators.required, Validators.maxLength(this.notifContent.maxLength)]),
          linkType: new FormControl(false, Validators.required),
          linkCategory: new FormControl({ value: 'Promo', disabled: true }, Validators.required),
          linkId: new FormControl('', Validators.required),
          scheduledFlag: new FormControl(false, Validators.required),
          scheduleDate: new FormControl(new Date()),
          scheduleTime: new FormControl('')
        }, {
            validators: CustomValidation.notifSchedule
          })
        this.articleService.getArticlesByCategory(this.linkCategory.value).subscribe(
          response => {
            console.log(response)
            try {
              this.articles = response.data;
              // this.offerService.getActiveOffer().subscribe(
              //   response => {
              //     try {
              //       console.table(response);
              //       this.specialOffers = response.data
                    if (this.router.url.includes('update')) {
                      this.isCreate = false;
                      this.id = params.id;
                      this.notifService.getNotifById(this.id).subscribe(
                        response => {
                          try {
                            console.table(response)
                            this.editedNotification = response.data;
                            let editedNotif = this.editedNotification;
                            if (!editedNotif.scheduled_flg) {
                              this.editNotifError('notificationDetailsScreen.cantUpdate.immediate')
                            } else if (!CustomValidation.durationFromNowValidation(new Date(editedNotif.schedule_sending))) {
                              this.editNotifError('notificationDetailsScreen.cantUpdate.minDuration')
                            } else {
                              let scheduleDate = null;
                              let scheduleTime = ''
                              if (editedNotif.schedule_sending) {
                                scheduleDate = new Date(editedNotif.schedule_sending)
                                let scheduleHours = scheduleDate.getHours();
                                let scheduleMin = scheduleDate.getMinutes();
                                scheduleTime = (scheduleHours > 9 ? '' : '0') + scheduleHours + ':'
                                  + (scheduleMin > 9 ? '' : '0') + scheduleMin
                              }
                              let selectedLink = null;
                              if (editedNotif.link_type) {
                                selectedLink = this.specialOffers.find(el => {
                                  return el.id === editedNotif.link_id;
                                })
                              } else {
                                selectedLink = this.articles.find((el) => {
                                  return el.id === editedNotif.link_id;
                                })
                              }
                              this.selectedLinkTitle = selectedLink ? selectedLink.title : '';
                              this.notifForm.patchValue({
                                // recipientType: editedNotif.recipient_type,
                                // recipient: editedNotif.recipient,
                                // oldRecipient: editedNotif.recipient
                                title: editedNotif.title,
                                content: editedNotif.content,
                                icon: editedNotif.large_icon,
                                oldIcon: editedNotif.large_icon,
                                image: editedNotif.large_image,
                                oldImage: editedNotif.large_image,
                                linkType: editedNotif.link_type,
                                linkId: selectedLink ? selectedLink.id : '',
                                scheduledFlag: editedNotif.scheduled_flg,
                                scheduleDate: scheduleDate,
                                scheduleTime: scheduleTime
                              })
                              this.handleLinkTypeChange()
                              this.handleRecipientTypeChange()
                            }
                          } catch (error) {
                            console.log(error)
                          }
                        }, error => {
                          try {
                            console.table(error);
                            let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                              data: {
                                title: 'notificationDetailsScreen.getNotificationFailed',
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
                      this.isCreate = true;
                      this.loading = false;
                      this.handleLinkTypeChange()
                      this.handleRecipientTypeChange()
                    }

              //     } catch (error) {
              //       console.log(error)
              //     }
              //   },
              //   error => {
              //     try {
              //       console.table(error);
              //       let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              //         data: {
              //           title: 'specialOfferListScreen.loadFailed',
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
              // )

            } catch (error) {
              console.log(error)
            }
          }, error => {
            try {
              console.table(error);
              let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'articleListScreen.loadFailed',
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
          })
      }
    )
  }

  handleLinkTypeChange() {
    this.linkType.valueChanges.subscribe(val => {
      // link type is special offer
      this.linkId.setValue('')
      if (val) {
        this.recipientType.setValue(true)
      }
    })
  }

  handleRecipientTypeChange() {
    this.recipientType.valueChanges.subscribe(val => {
      // recipient target is selected users
      this.recipient.setValue(null)
      if (val) {
        this.csvFile.setValidators([Validators.required, CustomValidation.type('csv')])
      } else {
        // recipient target is all users
        this.csvFile.setValue(null);
        this.csvFile.clearValidators();
      }
      this.csvFile.updateValueAndValidity()
      this.csvFile.markAsDirty()
      this.csvFile.markAsTouched()
    })
  }

  isLinkTypeSpecialOffer() {
    return this.linkType.value === true;
  }

  get recipientType() {
    return this.notifForm.get('recipientType')
  }

  get recipient() {
    return this.notifForm.get('recipient')
  }

  get csvFile() {
    return this.notifForm.get('csvFile')
  }

  get icon() {
    return this.notifForm.get('icon')
  }

  get oldIcon() {
    return this.notifForm.get('oldIcon')
  }

  get iconFile() {
    return this.notifForm.get('iconFile')
  }

  get image() {
    return this.notifForm.get('image')
  }

  get oldImage() {
    return this.notifForm.get('oldImage')
  }

  get imageFile() {
    return this.notifForm.get('imageFile')
  }

  get title() {
    return this.notifForm.get('title')
  }

  get content() {
    return this.notifForm.get('content')
  }

  get linkType() {
    return this.notifForm.get('linkType')
  }

  get linkCategory() {
    return this.notifForm.get('linkCategory')
  }

  get linkId() {
    return this.notifForm.get('linkId')
  }

  get scheduledFlag() {
    return this.notifForm.get('scheduledFlag')
  }

  get scheduleDate() {
    return this.notifForm.get('scheduleDate')
  }

  get scheduleTime() {
    return this.notifForm.get('scheduleTime')
  }

  onChangeCSVFile(event) {
    console.log('NotificationDetailsComponent | onChangeCSVFile')
    const file = event.target.files[0];
    if (file) {
      this.csvFile.setValue(file);
      this.csvFile.markAsDirty()
      this.recipient.reset()
      if (this.csvFile.valid || !this.csvFile.errors.type) {
        this.recipient.setValue('targeted users')
      } else {
        event.target.files = null
      }
    }
  }

  // handling delete images button event click
  onDeleteImage(imageFormControl, imageFileFormControl, imageInput) {
    console.log('NotificationDetailsComponent | onDeleteImage')
    if (imageFileFormControl.value || imageFormControl.value !== '') {
      imageFileFormControl.markAsDirty();
      imageFormControl.markAsDirty();
    }
    imageFileFormControl.setValue(null);
    imageFormControl.setValue('');
    imageFileFormControl.markAsTouched();
    imageFormControl.markAsTouched();
    imageInput.nativeElement.value = '';
  }

  // handling onChange event for image files input
  onChangeImgFile(imageFormControl, imageFileFormControl, imageInput, imageResolution, event) {
    console.log('NotificationDetailsComponent | onChangeImgFile')
    const file = event.target.files[0];
    if (file) {
      this.onDeleteImage(imageFormControl, imageFileFormControl, imageInput);
      imageFileFormControl.markAsDirty();
      imageFormControl.markAsDirty();
      imageFileFormControl.setValue(file)
      if (imageFileFormControl.valid || !imageFileFormControl.errors.type) {
        let reader = new FileReader();
        reader.onload = (e) => {
          imageFormControl.setValue(e.target['result'])
        };

        reader.readAsDataURL(file);
        CustomValidation.imageResolution(
          imageFileFormControl,
          imageResolution.width,
          imageResolution.height
        )
      } else {
        imageFormControl.setValue('')
      }
    }
  }

  onDeleteBigImage() {
    this.onDeleteImage(this.image, this.imageFile, this.imageInput)
  }

  onChangeBigImage(event) {
    this.onChangeImgFile(this.image, this.imageFile, this.imageInput, this.notifImageRes, event)
  }

  onDeleteLargeIcon() {
    this.onDeleteImage(this.icon, this.iconFile, this.iconInput)
  }

  onChangeLargeIcon(event) {
    this.onChangeImgFile(this.icon, this.iconFile, this.iconInput, this.notifIconRes, event)
  }

  //save button click event handler
  save() {
    console.log('NotificationDetailsComponent | save')
    // this.notifForm.updateValueAndValidity();
    // if (!this.notifForm.valid) {
    //   this.showFormError();
    // } else {
    //   let formValue = this.notifForm.value
    //   let scheduleDate = new Date();
    //   if (formValue.scheduledFlag) {
    //     scheduleDate = formValue.scheduleDate;
    //     let scheduleTime = formValue.scheduleTime.split(':')
    //     scheduleDate.setHours(Number(scheduleTime[0]))
    //     scheduleDate.setMinutes(Number(scheduleTime[1]))
    //   }
    //   let notification = new Notification()
    //   notification.title = formValue.title;
    //   notification.content = formValue.content;
    //   notification.link_type = formValue.linkType;
    //   notification.link_id = formValue.linkId;
    //   notification.scheduled_flg = formValue.scheduledFlag;
    //   notification.schedule_sending = scheduleDate;

    //   const modalRef = this.modal.open(NotifConfirmModalComponent, {
    //     width: '80%',
    //     maxHeight: '100%',
    //     maxWidth: '500px',
    //     scrollStrategy: this.overlay.scrollStrategies.reposition(),
    //     data: {
    //       notification: Object.assign({ linkTitle: this.selectedLinkTitle }, this.notifForm.getRawValue())
    //     }
    //   })
    //   modalRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       this.notifForm.updateValueAndValidity();
    //       if (this.notifForm.valid) {
    //         if (this.isCreate) {
    //           this.onSubmittingForm = true;
    //           this.notifService.createNotif(notification)
    //             .subscribe(
    //               (data: any) => {
    //                 try {
    //                   console.table(data);
    //                   this.onSubmittingForm = false;
    //                   let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //                     data: {
    //                       title: 'success',
    //                       content: {
    //                         text: 'notificationDetailsScreen.succesCreated',
    //                         data: null
    //                       }
    //                     }
    //                   })
    //                   snackbarSucess.afterDismissed().subscribe(() => {
    //                     this.goToListScreen();
    //                   })
    //                 } catch (error) {
    //                   console.log(error)
    //                 }
    //               },
    //               error => {
    //                 try {
    //                   console.table(error);
    //                   this.onSubmittingForm = false;
    //                   this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //                     data: {
    //                       title: 'notificationDetailsScreen.createFailed',
    //                       content: {
    //                         text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //                         data: null
    //                       }
    //                     }
    //                   })
    //                 } catch (error) {
    //                   console.log(error)
    //                 }
    //               }
    //             )
    //         } else {
    //           if (CustomValidation.durationFromNowValidation(new Date(this.editedNotification.schedule_sending))) {
    //             this.onSubmittingForm = true;
    //             notification.id = this.editedNotification.id;
    //             this.notifService.updateNotif(notification).subscribe(
    //               (data: any) => {
    //                 try {            
    //                   console.table(data);
    //                   this.onSubmittingForm = false;
    //                   let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //                     data: {
    //                       title: 'success',
    //                       content: {
    //                         text: 'notificationDetailsScreen.succesUpdated',
    //                         data: null
    //                       }
    //                     }
    //                   })
    //                   snackbarSucess.afterDismissed().subscribe(() => {
    //                     this.goToListScreen();
    //                   })
    //                 } catch (error) {
    //                   console.log(error)
    //                 }
    //               },
    //               error => {
    //                 try {            
    //                   console.table(error);
    //                   this.onSubmittingForm = false;
    //                   this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //                     data: {
    //                       title: 'notificationDetailsScreen.updateFailed',
    //                       content: {
    //                         text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
    //                         data: null
    //                       }
    //                     }
    //                   })
    //                 } catch (error) {
    //                   console.log(error)
    //                 }
    //               }
    //             )
    //           } else {
    //             this.editNotifError('notificationDetailsScreen.cantUpdate.minDuration')
    //           }
    //         }
    //       } else {
    //         this.showFormError();
    //       }
    //     }
    //   })
    // }

  }

  uploadCSV() {

  }

  uploadImage() {

  }

  uploadIcon() {

  }

  createNotification() {

  }

  updateNotification() {

  }

  deleteIcon() {

  }

  deleteImage() {

  }
  //show form invalid error snackbar
  showFormError() {
    console.log('NotificationDetailsComponent | showFormError')
    let errorText = '';
    let data = null;
    if (this.recipient.invalid) {
      if (this.recipient.errors.required) {
        errorText = 'forms.recipient.errorRequired';
      }
    } else if (this.title.invalid) {
      if (this.title.errors.required) {
        errorText = 'forms.title.errorRequired';
      } else if (this.title.errors.maxlength) {
        errorText = 'forms.title.errorMaxLength';
        data = this.notifTitle
      }
    } else if (this.content.invalid) {
      if (this.content.errors.required) {
        errorText = 'forms.content.errorRequired';
      } else if (this.content.errors.maxlength) {
        errorText = 'forms.content.errorMaxLength';
        data = this.notifContent
      }
    } else if (this.linkCategory.invalid) {
      if (this.linkCategory.errors.required) {
        errorText = 'forms.articleCategory.errorRequired';
      }
    } else if (this.linkId.invalid) {
      if (this.linkId.errors.required) {
        errorText = 'forms.notifArticle.errorRequired';
      }
    } else if (this.scheduledFlag.invalid) {
      if (this.scheduledFlag.errors.required) {
        errorText = 'forms.schedule.errorTypeRequired';
      }
    } else if (this.notifForm.errors.scheduleRequired) {
      errorText = 'forms.schedule.errorRequired';
    } else if (this.notifForm.errors.scheduleMin) {
      errorText = 'forms.schedule.errorMin';
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

  // show error if to be edited notification data is not valid eq: immediate notif & notif <= 1 hr
  editNotifError(errorText) {
    console.log('NotificationDetailsComponent | editNotifError')
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
    console.log('NotificationDetailsComponent | now')
    let now = new Date();
    now.setSeconds(0, 0)
    return now;
  }

  //redirect to user list screen
  goToListScreen = () => {
    console.log('NotificationDetailsComponent | gotoListScreen')
    this.router.navigate(['/notifications'])
  }
}
