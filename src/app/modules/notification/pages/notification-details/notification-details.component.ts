import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifConfirmModalComponent } from '../../components/notif-confirm-modal/notif-confirm-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { Notification } from '../../models/notification';
import { NotificationService } from '../../services/notification.service';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { constants } from 'src/app/shared/common/constants';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: []
})
export class NotificationDetailsComponent implements OnInit {
  appName = constants.appName;
  notifForm: FormGroup;
  onSubmittingForm = false;
  id;
  showPreview = false;
  isCreate = true;
  loading = true;
  allowCreate = false;
  allowEdit = false;
  selectedLinkTitle = '';
  articles = [];
  displayArticles = [];
  specialOffers = [];
  displaySpecialOffers = [];
  notifTitle = CustomValidation.notifTitle;
  notifContent = CustomValidation.notifContent;
  notifImageRes = CustomValidation.notifImage.resolution;
  notifImageRatioPercentage = this.notifImageRes.height / this.notifImageRes.width;
  notifIconRes = CustomValidation.notifLargeIcon.resolution;
  notificationLinkType = constants.notificationLinkType;
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
    private offerService: SpecialOfferService,
    private fileService: FileManagementService,
    private ng2ImgToolsService: Ng2ImgToolsService,
    private authService: AuthService
  ) { }

  //component on init
  ngOnInit() {
    console.log("NotificationDetailsComponent | OnInit");
    this.route.params.subscribe(
      params => {
        this.notifForm = new FormGroup({
          id: new FormControl(null),
          recipientAllFlag: new FormControl(true, Validators.required),
          oldRecipientAllFlag: new FormControl(true),
          recipient: new FormControl(null),
          oldRecipient: new FormControl(null),
          csvFile: new FormControl(null, CustomValidation.type('csv')),
          icon: new FormControl(null),
          oldIcon: new FormControl(null),
          iconFile: new FormControl(null, CustomValidation.type(['jpg', 'jpeg', 'png'])),
          image: new FormControl(null),
          oldImage: new FormControl(null),
          imageFile: new FormControl(null, CustomValidation.type(['jpg', 'jpeg', 'png'])),
          title: new FormControl('', [Validators.required, Validators.maxLength(this.notifTitle.maxLength)]),
          content: new FormControl('', [Validators.required, Validators.maxLength(this.notifContent.maxLength)]),
          linkType: new FormControl(this.notificationLinkType.article, Validators.required),
          linkCategory: new FormControl({ value: constants.articleTypePromo, disabled: true }, Validators.required),
          linkId: new FormControl('', Validators.required),
          scheduledFlag: new FormControl(false, Validators.required),
          scheduleDate: new FormControl(new Date()),
          oldScheduleSending: new FormControl(),
          scheduleTime: new FormControl(''),
          searchArticle: new FormControl(''),
          searchSpecialOffer: new FormControl('')
        }, {
            validators: CustomValidation.notifSchedule
          })
        let prvg = this.authService.getFeaturePrivilege(constants.features.notification)
        this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
        this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
        let allowPage = false;
        if (this.router.url.includes('update')) {
          this.isCreate = false;
          allowPage = this.allowEdit;
        } else {
          this.isCreate = true;
          allowPage = this.allowCreate;
        }
        if (allowPage) {
          this.loading = true;
          this.handleChangeFilterText()
          this.articleService.getArticlesByCategory(this.linkCategory.value).subscribe(
            response => {
              console.log(response)
              try {
                this.articles = response.data;
                this.displayArticles = response.data;
                this.offerService.getActiveOfferList().subscribe(
                  response => {
                    try {
                      console.table(response);
                      this.specialOffers = response.data;
                      this.displaySpecialOffers = response.data;
                      if (!this.isCreate) {
                        this.id = params.id;
                        this.notifService.getNotifById(this.id).subscribe(
                          response => {
                            try {
                              console.table(response)
                              let editedNotif: Notification = response.data;
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
                                let linkType = this.notificationLinkType.article
                                if (editedNotif.link_type.includes(this.notificationLinkType.specialOffer)) {
                                  selectedLink = this.specialOffers.find(el => {
                                    return el.id === editedNotif.link_id;
                                  })
                                  linkType = this.notificationLinkType.specialOffer
                                } else {
                                  selectedLink = this.articles.find((el) => {
                                    return el.id === editedNotif.link_id;
                                  })
                                }
                                this.selectedLinkTitle = selectedLink ? selectedLink.title : '';
                                this.notifForm.patchValue({
                                  id: editedNotif.id,
                                  recipientAllFlag: editedNotif.recipient_all_flg,
                                  oldRecipientAllFlag: editedNotif.recipient_all_flg,
                                  recipient: editedNotif.recipient_list,
                                  oldRecipient: editedNotif.recipient_list,
                                  title: editedNotif.title,
                                  content: editedNotif.content,
                                  icon: editedNotif.large_icon,
                                  oldIcon: editedNotif.large_icon,
                                  image: editedNotif.large_image,
                                  oldImage: editedNotif.large_image,
                                  linkType: linkType,
                                  linkId: selectedLink ? selectedLink.id : '',
                                  linkCategory: selectedLink ? selectedLink.category : '',
                                  scheduledFlag: editedNotif.scheduled_flg,
                                  scheduleDate: scheduleDate,
                                  scheduleTime: scheduleTime,
                                  oldScheduleSending: new Date(editedNotif.schedule_sending)
                                })
                                this.handleLinkTypeChange()
                                this.handleRecipientAllFlagChange()
                              }
                            } catch (error) {
                              console.log(error)
                            }
                          }, error => {
                            this.handleLoadInitError('notificationDetailsScreen.getNotificationFailed', error);
                          }).add(() => {
                            this.loading = false;
                          })

                      } else {
                        this.loading = false;
                        this.handleLinkTypeChange()
                        this.handleRecipientAllFlagChange()
                      }

                    } catch (error) {
                      console.log(error)
                    }
                  },
                  error => {
                    this.handleLoadInitError('specialOfferListScreen.loadFailed', error);
                  }
                )

              } catch (error) {
                console.log(error)
              }
            }, error => {
              this.handleLoadInitError('articleListScreen.loadFailed', error);
            })
        } else {
          this.authService.blockOpenPage()
        }
      }
    )
  }

  // Method to subscribe to searct text change to filter article and special offer
  handleChangeFilterText() {
    console.log("NotificationDetailsComponent | handleChangeFilterText");
    this.searchArticle.valueChanges.subscribe(value => {
      this.displayArticles = [];
      if (value) {
        this.articles.forEach((article) => {
          if (article.title.toLowerCase().includes(value)) {
            this.displayArticles.push(article);
          }
        });
      } else {
        this.displayArticles = this.articles;
      }
    })

    this.searchSpecialOffer.valueChanges.subscribe(value => {
      this.displayArticles = [];
      if (value) {
        this.displaySpecialOffers = [];
        this.specialOffers.forEach((specialOffer) => {
          if (specialOffer.title.toLowerCase().includes(value.toLowerCase())) {
            this.displaySpecialOffers.push(specialOffer);
          }
        });
      } else {
        this.displaySpecialOffers = this.specialOffers;
      }
    })
  }

  // Handle link type value change
  handleLinkTypeChange() {
    console.log("NotificationDetailsComponent | handleLinkTypeChange");
    this.linkType.valueChanges.subscribe(val => {
      // link type is special offer
      this.linkId.setValue('')
      if (val === this.notificationLinkType.specialOffer) {
        this.recipientAllFlag.setValue(false)
        this.linkCategory.setValue('')
      } else {
        this.linkCategory.setValue(constants.articleTypePromo)
      }
    })
  }

  // Handle recipient all flag value change
  handleRecipientAllFlagChange() {
    console.log("NotificationDetailsComponent | handleRecipientAllFlagChange");
    this.recipientAllFlag.valueChanges.subscribe(val => {
      // recipient target is selected users
      if (!val) {
        if (this.recipient.value !== this.oldRecipient.value || this.oldRecipientAllFlag.value) {
          this.csvFile.setValidators([Validators.required, CustomValidation.type('csv')])
        }
      } else {
        // recipient target is all users
        this.csvFile.setValue(null)
        this.csvFile.clearValidators()
        this.csvFile.setValidators(CustomValidation.type('csv'))
        this.recipient.setValue(null)
      }
      this.csvFile.updateValueAndValidity()
      this.csvFile.markAsDirty()
      this.csvFile.markAsTouched()
    })
  }

  // Handle when selecting special offer
  handleSelectSpecialOffer(specialOffer = null) {
    console.log('NotificationDetailsComponent | handleSelectSpecialOffer');
    if (specialOffer) {
      this.linkCategory.setValue(specialOffer.category)
      this.selectedLinkTitle = specialOffer.title
    } else {
      this.linkCategory.setValue('')
      this.selectedLinkTitle = ''
    }
  }

  // Check whether linktype is special offer
  isLinkTypeSpecialOffer() {
    return this.linkType.value === this.notificationLinkType.specialOffer;
  }

  // recipientAllFlag formControl getter
  get recipientAllFlag() {
    return this.notifForm.get('recipientAllFlag')
  }

  // oldRecipientAllFlag formControl getter
  get oldRecipientAllFlag() {
    return this.notifForm.get('oldRecipientAllFlag')
  }

  // recipient formControl getter
  get recipient() {
    return this.notifForm.get('recipient')
  }

  // oldRecipient formControl getter
  get oldRecipient() {
    return this.notifForm.get('oldRecipient')
  }

  // csvFile formControl getter
  get csvFile() {
    return this.notifForm.get('csvFile')
  }

  // icon formControl getter
  get icon() {
    return this.notifForm.get('icon')
  }

  // oldIcon formControl getter
  get oldIcon() {
    return this.notifForm.get('oldIcon')
  }

  // iconFile formControl getter
  get iconFile() {
    return this.notifForm.get('iconFile')
  }

  // image formControl getter
  get image() {
    return this.notifForm.get('image')
  }

  // oldImage formControl getter
  get oldImage() {
    return this.notifForm.get('oldImage')
  }

  // imageFile formControl getter
  get imageFile() {
    return this.notifForm.get('imageFile')
  }

  // title formControl getter
  get title() {
    return this.notifForm.get('title')
  }

  // content formControl getter
  get content() {
    return this.notifForm.get('content')
  }

  // linkType formControl getter
  get linkType() {
    return this.notifForm.get('linkType')
  }

  // linkCategory formControl getter
  get linkCategory() {
    return this.notifForm.get('linkCategory')
  }

  // linkId formControl getter
  get linkId() {
    return this.notifForm.get('linkId')
  }

  // scheduledFlag formControl getter
  get scheduledFlag() {
    return this.notifForm.get('scheduledFlag')
  }

  // scheduleDate formControl getter
  get scheduleDate() {
    return this.notifForm.get('scheduleDate')
  }

  // scheduleTime formControl getter
  get scheduleTime() {
    return this.notifForm.get('scheduleTime')
  }

  // oldScheduleSending formControl getter
  get oldScheduleSending() {
    return this.notifForm.get('oldScheduleSending')
  }

  // searchArticle formControl getter
  get searchArticle() {
    return this.notifForm.get('searchArticle')
  }

  // searchSpecialOffer formControl getter
  get searchSpecialOffer() {
    return this.notifForm.get('searchSpecialOffer')
  }

  // Handle when csv file input value change
  onChangeCSVFile(event) {
    console.log('NotificationDetailsComponent | onChangeCSVFile')
    const file = event.target.files[0];
    if (file) {
      this.csvFile.setValidators(CustomValidation.type('csv'))
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

  // Handle deleting image
  onDeleteBigImage() {
    this.onDeleteImage(this.image, this.imageFile, this.imageInput)
  }

  // Handle on change image file input value
  onChangeBigImage(event) {
    this.onChangeImgFile(this.image, this.imageFile, this.imageInput, this.notifImageRes, event)
  }

  // Handle deleting icon
  onDeleteLargeIcon() {
    this.onDeleteImage(this.icon, this.iconFile, this.iconInput)
  }

  // Handle on change icon file input value
  onChangeLargeIcon(event) {
    this.onChangeImgFile(this.icon, this.iconFile, this.iconInput, this.notifIconRes, event)
  }

  //save button click event handler
  save() {
    console.log('NotificationDetailsComponent | save')
    let allowSave = false;
    if (this.isCreate) {
      allowSave = this.allowCreate
    } else {
      allowSave = this.allowEdit
    }
    if (allowSave) {
      const modalRef = this.modal.open(NotifConfirmModalComponent, {
        width: '80%',
        maxHeight: '100%',
        maxWidth: '500px',
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        data: {
          notification: Object.assign({ linkTitle: this.selectedLinkTitle }, this.notifForm.getRawValue())
        }
      })
      modalRef.afterClosed().subscribe((result) => {
        if (result) {
          this.onSubmittingForm = true;
          if (this.isCreate) {
            if (!this.scheduledFlag.value || CustomValidation.durationFromNowValidation(this.scheduleDate.value)) {
              this.uploadFiles()
            } else {
              this.onSubmittingForm = false;
              this.showFormError()
              this.notifForm.updateValueAndValidity()
            }
          } else {
            if (CustomValidation.durationFromNowValidation(this.oldScheduleSending.value)) {
              if (!this.scheduledFlag.value || CustomValidation.durationFromNowValidation(this.scheduleDate.value)) {
                this.uploadFiles()
              } else {
                this.onSubmittingForm = false;
                this.showFormError()
                this.notifForm.updateValueAndValidity()
              }
            } else {
              this.onSubmittingForm = false;
              this.editNotifError('notificationDetailsScreen.cantUpdate.minDuration')
            }
          }
        }
      })
    } else {
      this.authService.blockPageAction()
    }

  }

  // check and upload csv and images
  uploadFiles() {
    console.log('NotificationDetailsComponent | showFormError')
    let formValue = this.notifForm.getRawValue()
    let scheduleDate = new Date()
    if (formValue.scheduledFlag) {
      scheduleDate = formValue.scheduleDate;
      let scheduleTime = formValue.scheduleTime.split(':')
      scheduleDate.setHours(Number(scheduleTime[0]))
      scheduleDate.setMinutes(Number(scheduleTime[1]))
    }
    let notification = new Notification()
    notification.recipient_all_flg = formValue.recipientAllFlag
    notification.title = formValue.title
    notification.content = formValue.content
    notification.link_id = formValue.linkId
    notification.scheduled_flg = formValue.scheduledFlag
    notification.schedule_sending = scheduleDate
    notification.large_icon = formValue.icon
    notification.large_image = formValue.image
    notification.recipient_list = formValue.recipient
    if (formValue.linkType === this.notificationLinkType.specialOffer) {
      const linkCategory = formValue.linkCategory.toLowerCase()
      if (linkCategory.includes(constants.specialOfferCategory.durable)) {
        notification.link_type = this.notificationLinkType.specialOfferLinkCategory.durable
      } else if (linkCategory.includes(constants.specialOfferCategory.mpl)) {
        notification.link_type = this.notificationLinkType.specialOfferLinkCategory.mpl
      } else {
        notification.link_type = this.notificationLinkType.specialOfferLinkCategory.oneclick
      }
    } else {
      notification.link_type = formValue.linkType
    }
    if (this.isCreate) {
      this.uploadFilesCreate(notification)
    } else {
      this.uploadFilesUpdate(notification, formValue)
    }
  }

  // handling uploading files on create mode
  uploadFilesCreate(notification: Notification) {
    console.log('NotificationDetailsComponent | uploadFilesCreate')
    let tasks = [];
    let getUploadUrlTasks = [];
    let fileTypes = [];
    const doUpdloadUrlTasks = () => {
      forkJoin(getUploadUrlTasks).subscribe((getUrlRes: Array<any>) => {
        let errorConvert = this.handleGetUploadUrlResponse(getUrlRes, fileTypes, tasks, notification)
        if (!errorConvert) {
          forkJoin(tasks).subscribe((responses: Array<any>) => {
            let error = this.handleUploadFilesResponse(responses, fileTypes)
            if (!error) {
              this.createNotification(notification)
            }
          })
        }
      })
    }
    if (!this.recipientAllFlag.value) {
      getUploadUrlTasks.push(this.fileService.getUploadUrl(this.csvFile.value, this.fileService.notificationRecipientComp).pipe(catchError(e => of(e))))
      fileTypes.push('csv')
    }
    if (this.iconFile.value) {
      getUploadUrlTasks.push(this.fileService.getUploadUrl(this.iconFile.value, this.fileService.notificationIconComponent).pipe(catchError(e => of(e))))
      fileTypes.push('icon')
    }
    if (this.imageFile.value) {
      this.ng2ImgToolsService.compress([this.imageFile.value], this.fileService.compressImageSizeInMB, true).subscribe(
        compressedImg => {
          console.log(compressedImg)
          getUploadUrlTasks.push(this.fileService.getUploadUrl(compressedImg, this.fileService.notificationComponent).pipe(catchError(e => of(e))))
          fileTypes.push('image')
          doUpdloadUrlTasks()
        }, error => {
          console.log(error)
          this.onSubmittingForm = false;
        }
      )
    } else {
      if (getUploadUrlTasks.length > 0) {
        doUpdloadUrlTasks()
      } else {
        this.createNotification(notification)
      }
    }
  }

  // handling uploading files on edit mode
  uploadFilesUpdate(notification: Notification, formValue) {
    console.log('NotificationDetailsComponent | uploadFilesUpdate')
    notification.id = formValue.id;
    let tasks = [];
    let getUploadUrlTasks = [];
    let fileTypes = [];
    let shouldDeleteCSV = false;
    let shouldDeleteIcon = false;
    let shouldDeleteImage = false;
    if (formValue.recipientAllFlag !== formValue.oldRecipientAllFlag) {
      if (!formValue.oldRecipientAllFlag) {
        shouldDeleteCSV = true;
      } else {
        getUploadUrlTasks.push(this.fileService.getUploadUrl(this.csvFile.value, this.fileService.notificationRecipientComp).pipe(catchError(e => of(e))))
        fileTypes.push('csv')
      }
    } else if (!formValue.recipientAllFlag && formValue.recipient !== formValue.oldRecipient) {
      shouldDeleteCSV = true;
      getUploadUrlTasks.push(this.fileService.getUploadUrl(this.csvFile.value, this.fileService.notificationRecipientComp).pipe(catchError(e => of(e))))
      fileTypes.push('csv')
    }

    if (formValue.iconFile) {
      if (formValue.oldIcon) {
        shouldDeleteIcon = true
      }
      getUploadUrlTasks.push(this.fileService.getUploadUrl(this.iconFile.value, this.fileService.notificationIconComponent).pipe(catchError(e => of(e))))
      fileTypes.push('icon')
    } else if (formValue.oldIcon) {
      shouldDeleteIcon = true
    }

    const doUpdloadUrlTasks = () => {
      forkJoin(getUploadUrlTasks).subscribe((getUrlRes: Array<any>) => {
        let errorConvert = this.handleGetUploadUrlResponse(getUrlRes, fileTypes, tasks, notification)
        if (!errorConvert) {
          forkJoin(tasks).subscribe((responses: Array<any>) => {
            let error = this.handleUploadFilesResponse(responses, fileTypes)
            if (!error) {
              this.updateNotification(notification, shouldDeleteCSV, shouldDeleteIcon, shouldDeleteImage)
            }
          })
        }
      })
    }

    if (formValue.imageFile) {
      if (formValue.oldImage) {
        shouldDeleteImage = true
      }

      this.ng2ImgToolsService.compress([this.imageFile.value], this.fileService.compressImageSizeInMB, true).subscribe(
        compressedImg => {
          console.log(compressedImg);
          getUploadUrlTasks.push(this.fileService.getUploadUrl(compressedImg, this.fileService.notificationComponent).pipe(catchError(e => of(e))))
          fileTypes.push('image')
          doUpdloadUrlTasks()
        }, error => {
          this.onSubmittingForm = false;
          console.log(error)
        })
    } else {
      if (formValue.oldImage) {
        shouldDeleteImage = true
      }
      if (getUploadUrlTasks.length > 0) {
        doUpdloadUrlTasks()
      } else {
        this.updateNotification(notification, shouldDeleteCSV, shouldDeleteIcon, shouldDeleteImage)
      }
    }
  }

  // handling get uploading files url response (forkJoin result)
  handleGetUploadUrlResponse(responses: Array<any>, fileTypes, tasks: any[], notification: Notification) {
    let error = false;
    const onError = (errorTitle, apiError) => {
      error = true;
      this.handleSubmitError(errorTitle, apiError);
    }
    responses.forEach((response, index) => {
      console.log(response)
      switch (fileTypes[index]) {
        case 'csv':
          if (response instanceof HttpErrorResponse) {
            onError('notificationDetailsScreen.uploadCSVFailed', response);
          } else {
            try {
              let uploadUrl = response.data.signurl;
              notification.recipient_list = uploadUrl.split('?')[0]
              tasks.push(this.fileService.uploadFile(uploadUrl, this.csvFile.value).pipe(catchError(e => of(e))))
            } catch (error) {
              console.error(error)
              this.onSubmittingForm = false
            }
          }
          break;
        case 'icon':
          if (response instanceof HttpErrorResponse) {
            onError('notificationDetailsScreen.uploadIconFailed', response);
          } else {
            try {
              let uploadUrl = response.data.signurl;
              notification.large_icon = uploadUrl.split('?')[0]
              tasks.push(this.fileService.uploadFile(uploadUrl, this.iconFile.value).pipe(catchError(e => of(e))))
            } catch (error) {
              console.error(error)
              this.onSubmittingForm = false
            }
          }
          break;
        case 'image':
          if (response instanceof HttpErrorResponse) {
            onError('notificationDetailsScreen.uploadImageFailed', response);
          } else {
            try {
              let uploadUrl = response.data.signurl;
              notification.large_image = uploadUrl.split('?')[0]
              tasks.push(this.fileService.uploadFile(uploadUrl, this.imageFile.value).pipe(catchError(e => of(e))))
            } catch (error) {
              console.error(error)
              this.onSubmittingForm = false
            }
          }
          break;
        default:
          break;
      }
    })
    return error;
  }

  // handling uploading files response (forkJoin result)
  handleUploadFilesResponse(responses: Array<any>, fileTypes) {
    let error = false;
    responses.forEach((response, index) => {
      console.table(response)
      switch (fileTypes[index]) {
        case 'csv':
          if (response instanceof HttpErrorResponse) {
            error = true;
            this.onSubmittingForm = false;
            this.authService.openSnackbarError('notificationDetailsScreen.uploadCSVFailed', 'error')
          }
          break;
        case 'icon':
          if (response instanceof HttpErrorResponse) {
            error = true;
            this.onSubmittingForm = false;
            this.authService.openSnackbarError('notificationDetailsScreen.uploadIconFailed', 'error');
          }
          break;
        case 'image':
          if (response instanceof HttpErrorResponse) {
            error = true;
            this.onSubmittingForm = false;
            this.authService.openSnackbarError('notificationDetailsScreen.uploadImageFailed', 'error');
          }
          break;
        default:
          break;
      }
    })
    return error;
  }

  // call create notification api
  createNotification(notification) {
    console.log('NotificationDetailsComponent | createNotification')
    this.notifService.createNotif(notification).subscribe(
      response => {
        console.table(response)
        this.onSubmittingForm = false;
        let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'notificationDetailsScreen.succesCreated',
              data: null
            }
          }
        })
        snackbarSucess.afterDismissed().subscribe(() => {
          this.goToListScreen();
        })
      }, error => {
        this.handleSubmitError('notificationDetailsScreen.createFailed', error)
      }
    )
  }

  // call update notification api
  updateNotification(notification, shouldDeleteCSV, shouldDeleteIcon, shouldDeleteImage) {
    console.log('NotificationDetailsComponent | updateNotification')
    this.notifService.updateNotif(notification).subscribe(
      response => {
        try {
          console.table(response);
          if (shouldDeleteCSV || shouldDeleteIcon || shouldDeleteImage) {
            this.deleteFiles(shouldDeleteCSV, shouldDeleteIcon, shouldDeleteImage);
          } else {
            this.onSubmittingForm = false;
            let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {
                title: 'success',
                content: {
                  text: 'notificationDetailsScreen.succesUpdated',
                  data: null
                }
              }
            })
            snackbarSucess.afterDismissed().subscribe(() => {
              this.goToListScreen();
            })
          }
        } catch (error) {
          console.log(error)
        }
      },
      error => {
        this.handleSubmitError('notificationDetailsScreen.updateFailed', error)
      }
    )
  }

  // get name of oss file (including before last /)
  getOSSName(url) {
    console.log('NotificationDetailsComponent | getOSSName')
    let split = url.split('/')
    let name = url
    if (split.length >= 2) {
      name = split.pop()
      name = split.pop() + '/' + name;
    }
    return {
      name: name
    }
  }

  // delete csv, icon, or/and image from OSS
  deleteFiles(shouldDeleteCSV, shouldDeleteIcon, shouldDeleteImage) {
    console.log('NotificationDetailsComponent | deleteFiles')
    let deletedFiles = [];
    let tasks = [];
    if (shouldDeleteCSV) {
      deletedFiles.push('csv')
      tasks.push(this.fileService.deleteFile(this.getOSSName(this.oldRecipient.value)).pipe(catchError(e => of(e))))
    }
    if (shouldDeleteIcon) {
      deletedFiles.push('icon')
      tasks.push(this.fileService.deleteFile(this.getOSSName(this.oldIcon.value)).pipe(catchError(e => of(e))))
    }
    if (shouldDeleteImage) {
      deletedFiles.push('image')
      tasks.push(this.fileService.deleteFile(this.getOSSName(this.oldImage.value)).pipe(catchError(e => of(e))))
    }
    forkJoin(tasks).subscribe((responses: Array<any>) => {
      let error = false
      this.onSubmittingForm = false;
      responses.forEach((response, index) => {
        console.table(response)
        if (response instanceof HttpErrorResponse) {
          error = true;
          try {
            switch (deletedFiles[index]) {
              case 'csv':
                this.authService.handleApiError('notificationDetailsScreen.deleteCSVFailed', response)
                break;
              case 'icon':
                this.authService.handleApiError('notificationDetailsScreen.deleteIconFailed', response)
                break;
              case 'image':
                this.authService.handleApiError('notificationDetailsScreen.deleteImageFailed', response)
                break;
              default:
                break;
            }
          } catch (error) {
            console.table(error)
          }
        }
      })
      if (!error) {
        let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {
            title: 'success',
            content: {
              text: 'notificationDetailsScreen.succesUpdated',
              data: null
            }
          }
        })
        snackbarSucess.afterDismissed().subscribe(() => {
          this.goToListScreen();
        })
      }
    })
  }

  //show form invalid error snackbar
  showFormError() {
    console.log('NotificationDetailsComponent | showFormError')
    let errorText = '';
    let data = null;
    if (this.scheduledFlag.invalid) {
      if (this.scheduledFlag.errors.required) {
        errorText = 'forms.schedule.errorTypeRequired';
      }
    } else if (this.notifForm.errors) {
      if (this.notifForm.errors.scheduleRequired) {
        errorText = 'forms.schedule.errorRequired';
      } else if (this.notifForm.errors.scheduleMin) {
        errorText = 'forms.schedule.errorMin';
      }
    }
    this.authService.openSnackbarError('invalidForm', errorText, data)
  }

  // show error if to be edited notification data is not valid eq: immediate notif & notif <= 1 hr
  editNotifError(errorText) {
    console.log('NotificationDetailsComponent | editNotifError')
    let errorSnackbar = this.authService.openSnackbarError('error', errorText);
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

  // handle error on init page
  handleLoadInitError(errorTitle, apiError) {
    console.log('NotificationDetailsComponent | gotoListScreen')
    console.table(apiError);
    let errorSnackbar = this.authService.handleApiError(errorTitle, apiError);
    if (errorSnackbar) {
      errorSnackbar.afterDismissed().subscribe(() => {
        this.goToListScreen()
      })
    }
  }

  // handle error for create or update api
  handleSubmitError(errorTitle, apiError){
    console.log('NotificationDetailsComponent | handleSubmitError')
    console.table(apiError)
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError);
  }
}
