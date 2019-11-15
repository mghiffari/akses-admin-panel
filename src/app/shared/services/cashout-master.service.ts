import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashoutMasterService {
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
}
