import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashoutMasterService {
  vLoadingStatus: boolean;

  cashOutMasterApiUrl = environment.apiurl + 'cashoutmaster';
  toDoListApiUrl = this.cashOutMasterApiUrl + '/todo-list';
  listVAMasterApiUrl = this.cashOutMasterApiUrl + '/list-vamaster'
  trackYourRequest = this.cashOutMasterApiUrl + '/track-request';
  constructor(
    private authService: AuthService
  ) { }

  //used to hit get special offer list API
  getToDoList(page, pageSize) {
    let url = this.toDoListApiUrl + '/' + page + '/' + pageSize;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  getTrackRequest(page, pageSize) {
    let url = this.trackYourRequest + '/' + page + '/' + pageSize;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  getListVaMaster() {
    let url = this.listVAMasterApiUrl;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //used to get loading status on button submit
  isLoading() {
    console.log('CashoutMasterService | isLoading');
    return this.vLoadingStatus;
  }

  //used to disable save button
  isDisableCreateArticle() {

  }

  //used when button submit clicked
  buttonSubmit() {

  }

  //used to disable save button
  isDisableCreateRequestWithdrawal() {
    console.log('CashoutMasterService | isDisableCreateRequestWithdrawal');
  }
}
