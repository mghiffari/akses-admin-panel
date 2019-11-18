import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import Utils from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class CashoutMasterService {
  vLoadingStatus: boolean;

  cashOutMasterApiUrl = environment.apiurl + 'cashoutmaster';
  toDoListApiUrl = this.cashOutMasterApiUrl + '/todo-list';
  approveRequestApiUrl = this.cashOutMasterApiUrl + '/approve-request';
  rejectRequestApiUrl = this.cashOutMasterApiUrl + '/reject-request';
  listVAMasterApiUrl = this.cashOutMasterApiUrl + '/list-vamaster'
  trackYourRequest = this.cashOutMasterApiUrl + '/track-request';
  constructor(
    private authService: AuthService
  ) { }

  //used to hit get special offer list API
  getToDoList(page, pageSize, search) {
    let url = this.toDoListApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search); ;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  getTrackRequest(page, pageSize) {
    let url = this.trackYourRequest + '/' + page + '/' + pageSize;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  approveRequest(data){
    let url = this.approveRequestApiUrl;
    console.log("ToDoListService | approveRequest ", url);
    return this.authService.wrapTokenPutApi(url, data)
  }

  rejectRequest(data){
    let url = this.rejectRequestApiUrl;
    console.log("ToDoListService | rejectRequest ", url);
    return this.authService.wrapTokenPutApi(url, data)
  }

  getListVaMaster() {
    let url = this.listVAMasterApiUrl;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }
}
