import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import Utils from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class CashoutMasterService {
  cashOutMasterApiUrl = environment.apiurl + 'cashoutmaster';
  toDoListApiUrl = this.cashOutMasterApiUrl + '/todo-list';
  approveRequestApiUrl = this.cashOutMasterApiUrl + '/approve-request';
  rejectRequestApiUrl = this.cashOutMasterApiUrl + '/reject-request';
  constructor(
    private authService: AuthService
  ) { }

  getToDoList(page, pageSize, search){
    let url = this.toDoListApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search); ;
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
}
