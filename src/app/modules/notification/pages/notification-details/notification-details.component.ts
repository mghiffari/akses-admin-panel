import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: []
})
export class NotificationDetailsComponent implements OnInit {
  notifForm: FormGroup;
  editedNotification;
  onSubmittingForm = false;
  id;
  isCreate = true;
  loading = true;
  selectedArticleTitle = '';
  articles = [
    {
      id: 'id1',
      title: 'article 1'
    },
    {
      id: 'id2',
      title: 'article 2'
    }
  ];

  constructor(
    // private notifService: NotificationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private modal: MatDialog,
    private overlay: Overlay,
    private articleService: ArticleService
  ) { }

  //component on init
  ngOnInit() {
    console.log("NotificationDetailsComponent | OnInit")
    this.route.params.subscribe(
      params => {
        this.loading = true;
        this.notifForm = new FormGroup({
          recipient: new FormControl('all', Validators.required),
          title: new FormControl('', Validators.required),
          content: new FormControl('', Validators.required),
          articleCategory: new FormControl({ value: 'Promo', disabled: true }, Validators.required),
          articleId: new FormControl('', Validators.required),
          scheduledFlag: new FormControl(false, Validators.required),
          scheduleDate: new FormControl(new Date()),
          scheduleTime: new FormControl('')
        }, {
            validators: CustomValidation.notifSchedule
          })
        if (this.router.url.includes('update')) {
          // try {
          //   this.isCreate = false;
          //   this.id = params.id;
          //   this.notifService.getNotifById(this.id).subscribe(
          //     response => {
          //       try {
          //         console.table(response)
          //         this.editedNotification = response.data;
          //         let editedNotif = this.editedNotification;
          //         if(!editedNotif.scheduled_flg){
          //           this.editNotifError('notificationDetailsScreen.cantUpdate.immediate')
          //         } else if(!CustomValidation.durationFromNowValidation(new Date(editedNotif.schedule_sending))){
          //           this.editNotifError('notificationDetailsScreen.cantUpdate.minDuration')
          //         } else {
          //           this.articleService.getArticlesByCategory(this.articleCategory.value).subscribe(
          //             response => {
          //               console.log(response)
          //               let scheduleDate = null;
          //               let scheduleTime = ''
          //               if(editedNotif.schedule_sending && editedNotif.schedule_sending !== ''){
          //                 scheduleDate = new Date(editedNotif.schedule_sending)
          //                 let scheduleHours = scheduleDate.getHours();
          //                 let scheduleMin = scheduleDate.getMinutes();
          //                 scheduleTime = (scheduleHours > 9 ? '' : '0') + scheduleHours + ':' 
          //                   + (scheduleMin > 9 ? '' : '0') + scheduleMin
          //               }
          //               let selectedArticle = response.data.find((el) => {
          //                 return el.id === editedNotif.aks_adm_article_id;
          //               })
          //               this.selectedArticleTitle = selectedArticle ? selectedArticle.title : '';
          //               this.notifForm.patchValue({
          //                 title: editedNotif.title,
          //                 content: editedNotif.content,
          //                 articleId: selectedArticle ? selectedArticle.id : '',
          //                 scheduledFlag: editedNotif.scheduled_flg,
          //                 scheduleDate: scheduleDate,
          //                 scheduleTime: scheduleTime
          //               })
          //             }, error => {
          //               try {            
          //                 console.table(error);
          //                 let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          //                   data: {
          //                     title: 'articleListScreen.loadFailed',
          //                     content: {
          //                       text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
          //                       data: null
          //                     }
          //                   }
          //                 })
          //                 errorSnackbar.afterDismissed().subscribe(() => {
          //                   this.goToListScreen()
          //                 })
          //               } catch (error) {
          //                 console.log(error)
          //               }
          //             }
          //           )
          //         }
          //       } catch (error) {
          //         console.log(error)
          //       }
          //     }, error => {
          //       try {            
          //         console.table(error);
          //         let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          //           data: {
          //             title: 'notificationDetailsScreen.getNotificationFailed',
          //             content: {
          //               text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
          //               data: null
          //             }
          //           }
          //         })
          //         errorSnackbar.afterDismissed().subscribe(() => {
          //           this.goToListScreen()
          //         })
          //       } catch (error) {
          //         console.log(error)
          //       }
          //     }).add(() => {
          //       this.loading = false;
          //     })
          // } catch (error) {
          //   console.table(error)
          // }
        } else {
          this.isCreate = true;
          this.loading = false;
        }
      }
    )
  }

  get recipient() {
    return this.notifForm.get('recipient')
  }

  get title() {
    return this.notifForm.get('title')
  }

  get content() {
    return this.notifForm.get('content')
  }

  get articleCategory() {
    return this.notifForm.get('articleCategory')
  }

  get articleId() {
    return this.notifForm.get('articleId')
  }

  get scheduledFlag() {
    return this.notifForm.get('scheduledFlag')
  }

  get scheduleDate() {
    return this.notifForm.get('recipient')
  }

  get scheduleTime() {
    return this.notifForm.get('recipient')
  }

  //save button click event handler
  save() {
    console.log('NotificationDetailsComponent | save')
    this.notifForm.updateValueAndValidity();
    if (!this.notifForm.valid) {
      this.showFormError();
    } else {
      let formValue = this.notifForm.value
      let scheduleDate = new Date();
      if (formValue.scheduledFlag) {
        scheduleDate = formValue.scheduleDate;
        let scheduleTime = formValue.scheduleTime.split(':')
        scheduleDate.setHours(Number(scheduleTime[0]))
        scheduleDate.setMinutes(Number(scheduleTime[1]))
      }
      let notification = {
        title: formValue.title,
        content: formValue.content,
        aks_adm_article_id: formValue.articleId,
        scheduled_flg: formValue.scheduledFlag,
        schedule_sending: scheduleDate
      }
      const modalRef = this.modal.open(NotifConfirmModalComponent, {
        width: '80%',
        maxHeight: '100%',
        maxWidth: '500px',
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        data: {
          notification: Object.assign({ articleTitle: this.selectedArticleTitle }, this.notifForm.getRawValue())
        }
      })
      modalRef.afterClosed().subscribe((result) => {
        if(result){
          this.notifForm.updateValueAndValidity();
          if(this.notifForm.valid){
            if (this.isCreate) {
              // this.onSubmittingForm = true;
              // this.notifService.createNotif(notification)
              //   .subscribe(
              //     (data: any) => {
              //       try {            
              //         console.table(data);
              //         this.onSubmittingForm = false;
              //         let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              //           data: {
              //             title: 'success',
              //             content: {
              //               text: 'notificationDetailsScreen.succesCreated',
              //               data: null
              //             }
              //           }
              //         })
              //         snackbarSucess.afterDismissed().subscribe(() => {
              //           this.goToListScreen();
              //         })
              //       } catch (error) {
              //         console.log(error)
              //       }
              //     },
              //     error => {
              //       try {            
              //         console.table(error);
              //         this.onSubmittingForm = false;
              //         this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              //           data: {
              //             title: 'notificationDetailsScreen.createFailed',
              //             content: {
              //               text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
              //               data: null
              //             }
              //           }
              //         })
              //       } catch (error) {
              //         console.log(error)
              //       }
              //     }
              //   )
            } else {
              if(CustomValidation.durationFromNowValidation(new Date(this.editedNotification.schedule_sending))){
                // this.onSubmittingForm = true;
                // this.notifService.updateUser(notification).subscribe(
                //   (data: any) => {
                //     try {            
                //       console.table(data);
                //       this.onSubmittingForm = false;
                //       let snackbarSucess = this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                //         data: {
                //           title: 'success',
                //           content: {
                //             text: 'notificationDetailsScreen.succesUpdated',
                //             data: null
                //           }
                //         }
                //       })
                //       snackbarSucess.afterDismissed().subscribe(() => {
                //         this.goToListScreen();
                //       })
                //     } catch (error) {
                //       console.log(error)
                //     }
                //   },
                //   error => {
                //     try {            
                //       console.table(error);
                //       this.onSubmittingForm = false;
                //       this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                //         data: {
                //           title: 'notificationDetailsScreen.updateFailed',
                //           content: {
                //             text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                //             data: null
                //           }
                //         }
                //       })
                //     } catch (error) {
                //       console.log(error)
                //     }
                //   }
                // )
              } else {
                this.editNotifError('notificationDetailsScreen.cantUpdate.minDuration')
              }
            }
          } else {
            this.showFormError();
          }
        }
      })
    }

  }

  //show form invalid error snackbar
  showFormError(){
    console.log('NotificationDetailsComponent | showFormError')
    let errorText = '';
      if(this.recipient.invalid){
        if(this.recipient.errors.required){
          errorText = 'forms.recipient.errorRequired';
        } 
      } else if(this.title.invalid){
        if(this.title.errors.required){
          errorText = 'forms.title.errorRequired';
        } 
      } else if(this.content.invalid){
        if(this.content.errors.required){
          errorText = 'forms.content.errorRequired';
        } 
      } else if(this.articleCategory.invalid){
        if(this.articleCategory.errors.required){
          errorText = 'forms.articleCategory.errorRequired';
        } 
      } else if(this.articleId.invalid){
        if(this.articleId.errors.required){
          errorText = 'forms.notifArticle.errorRequired';
        } 
      } else if(this.scheduledFlag.invalid){
        if(this.scheduledFlag.errors.required){
          errorText = 'forms.schedule.errorTypeRequired';
        } 
      } else if(this.notifForm.errors.scheduleRequired){
        errorText = 'forms.schedule.errorRequired';
      } else if(this.notifForm.errors.scheduleMin){
        errorText = 'forms.schedule.errorMin';
      }
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        data: {
          title: 'invalidForm',
          content: {
            text: errorText,
            data: null
          }
        }
      })
  }

  // show error if to be edited notification data is not valid eq: immediate notif & notif <= 1 hr
  editNotifError(errorText){
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
