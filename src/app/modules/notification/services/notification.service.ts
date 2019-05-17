import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationApiUrl = environment.apiurl + 'notification/'

  // constructor
  constructor(
    private authService: AuthService
  ) { }

  //get notification list with pagination and search and sort
  getNotifList(page, pageSize, search) {
    let url = this.notificationApiUrl + page + '/' + pageSize + '/' + search;
    console.log("NotificationService | getNotifList ", url);
    return this.authService.wrapTokenGetApi(url);
  }

  //get n data by id
  getNotifById(id: string) {
    let url = this.notificationApiUrl + id;
    console.log("NotificationService | loadBannerById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  // insert/create notification
  createNotif(data) {
    console.log("NotificationService | createNotif " + this.notificationApiUrl);
    return this.authService.wrapTokenPostApi(this.notificationApiUrl, data)
  }

  // update notification
  updateNotif(data) {
    let url = this.notificationApiUrl;
    console.log("NotificationService | updateNotif ", url);
    return this.authService.wrapTokenPatchApi(url, data)
  }

  // delete notification
  deleteNotif(id) {
    let url = this.notificationApiUrl + id;
    console.log("NotificationService | deleteNotif ", url);
    return this.authService.wrapTokenGetApi(url)
  }
  
}
