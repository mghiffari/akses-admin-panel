import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import Utils from '../common/utils';
import { ErrorSnackbarComponent } from '../components/error-snackbar/error-snackbar.component';
import { MatDialog, MatSnackBar } from '@angular/material';

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
  reportApiUrl = this.cashOutMasterApiUrl + '/report';
  submitRequest = this.cashOutMasterApiUrl + '/submit-request';
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  getSubmitRequest(data) {
    let url = this.submitRequest;
    console.log("ToDoListService | getSubmitRequest ", url);
    return this.authService.wrapTokenPostApi(url, data)
  }

  getReport(page, pageSize, search) {
    let url = this.reportApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);;
    console.log("ToDoListService | getReport ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  getToDoList(page, pageSize, search) {
    let url = this.toDoListApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);;
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  getTrackRequest(page, pageSize, search) {
    let url = this.trackYourRequest + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);
    console.log("ToDoListService | getToDoListAPI ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  approveRequest(data) {
    let url = this.approveRequestApiUrl;
    console.log("ToDoListService | approveRequest ", url);
    return this.authService.wrapTokenPutApi(url, data)
  }

  rejectRequest(data) {
    let url = this.rejectRequestApiUrl;
    console.log("ToDoListService | rejectRequest ", url);
    return this.authService.wrapTokenPutApi(url, data)
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

  // show error for unauthorized action
  blockPageAction() {
    console.log('AuthService | blockPageAction');
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'actionBlockedError.title',
        content: {
          text: 'actionBlockedError.content',
          data: null
        }
      }
    })
  }
}
