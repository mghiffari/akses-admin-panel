import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: []
})
export class NotificationDetailsComponent implements OnInit {
  notifForm: FormGroup;
  notification;
  onSubmittingForm = false;
  id;
  isCreate = true;
  loading = true;
  articles = [];
  
  constructor(
    // private notifService: NotificationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
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
          articleCategory: new FormControl({value: 'Promo', disabled: true}, Validators.required),
          articleId: new FormControl('', Validators.required),
          scheduledFlag: new FormControl(false, Validators.required),
          scheduleDate: new FormControl(new Date(), Validators.required),
          scheduleTime: new FormControl('', Validators.required)
        })
        if (this.router.url.includes('update')) {
          // try {
          //   this.isCreate = false;
          //   this.id = params.id;
          //   this.notifService.getNotifById(this.id).subscribe(
          //     data => {
          //       try {            
          //         let editedNotif = data.data;
          //         let scheduleDate = null;
          //         let scheduleTime = ''
          //         if(editedNotif.schedule_sending && editedNotif.schedule_sending !== ''){
          //           scheduleDate = new Date(editedNotif.schedule_sending)
          //           let scheduleHours = scheduleDate.getHours();
          //           let scheduleMin = scheduleDate.getMinutes();
          //           scheduleTime = (scheduleHours > 9 ? '' : '0') + scheduleHours + ':' 
          //             + (scheduleMin > 9 ? '' : '0') + scheduleMin
          //         }
          //         this.notifForm.patchValue({
          //           title: editedNotif.title,
          //           content: editedNotif.content,
          //           articleId: editedNotif.aks_adm_article_id,
          //           scheduledFlag: editedNotif.scheduled_flg,
          //           scheduleDate: scheduleDate,
          //           scheduleTime: scheduleTime
          //         })
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

  get recipient(){
    return this.notifForm.get('recipient')
  }

  get title(){
    return this.notifForm.get('title')
  }

  get content(){
    return this.notifForm.get('content')
  }

  get articleCategory(){
    return this.notifForm.get('articleCategory')
  }

  get articleId(){
    return this.notifForm.get('articleId')
  }

  get scheduledFlag(){
    return this.notifForm.get('scheduledFlag')
  }

  get scheduleDate(){
    return this.notifForm.get('recipient')
  }
  
  get scheduleTime(){
    return this.notifForm.get('recipient')
  }

  //save button click event handler
  save() {
    console.log('NotificationDetailsComponent | save')    
    let formValue = this.notifForm.value
    let scheduleDate = new Date();
    if(formValue.scheduledFlag){
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
    }

  }

  now(){
    return new Date();
  }

  //redirect to user list screen
  goToListScreen = () => {
    console.log('NotificationDetailsComponent | gotoListScreen')
    this.router.navigate(['/notifications'])
  }

}
