import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import Utils from '../../../shared/common/utils';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationApiUrl = environment.apiurl + 'notification'
  createNotificationApiUrl = environment.apiurl + environment.endPoint.createNotification
  updateNotifApiUrl = environment.apiurl + environment.endPoint.updateNotification
  refreshNotifApiUrl = this.notificationApiUrl + '/refresh';

  // constructor
  constructor(
    private authService: AuthService
  ) { }

  //get notification list with pagination and search and sort
  getNotifList(page, pageSize, search) {
    let url = this.notificationApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);
    console.log("NotificationService | getNotifList ", url);
    return this.authService.wrapTokenGetApi(url);
  }

  //get n data by id
  getNotifById(id: string) {
    let url = this.notificationApiUrl + '/' + id;
    console.log("NotificationService | getNotifById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  // insert/create notification
  createNotif(data) {
    console.log("NotificationService | createNotif " + this.createNotificationApiUrl);
    return this.authService.wrapTokenPostApi(this.createNotificationApiUrl, data)
  }

  // update notification
  updateNotif(data) {
    let url = this.notificationApiUrl;
    console.log("NotificationService | updateNotif ", url);
    return this.authService.wrapTokenPutApi(url, data)
  }

  // delete notification
  deleteNotif(id) {
    let url = this.notificationApiUrl + '/' + id;
    console.log("NotificationService | deleteNotif ", url);
    return this.authService.wrapTokenDeleteApi(url)
  }

  //refresh notif by id
  refreshNotif(id: string) {
    let url = this.refreshNotifApiUrl + '/' + id;
    console.log("NotificationService | refreshNotif " + url);
    return this.authService.wrapTokenPutApi(url, {});
  }
  
}
