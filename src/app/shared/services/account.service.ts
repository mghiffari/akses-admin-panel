import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChangePassword } from '../models/change-password';
import { AuthService } from './auth.service';
import { UserForm } from 'src/app/modules/master/models/user-form';
import Utils from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountApiUrl = environment.apiurl + 'account'
  updateAccountApirUrl = environment.apiurl + environment.endPoint.updateAccount
  changePassApiUrl = this.accountApiUrl + '/change-pass'
  createUserApiUrl = this.accountApiUrl + '/create-user'

  constructor(
    private authService: AuthService
  ) { }
  
  //used to hit change password API
  changePassword(data: ChangePassword, accessToken = null) {
    console.log("Account Service | changePasswordApi ", this.changePassApiUrl);
    return this.authService.wrapTokenPostApi(this.changePassApiUrl, data, accessToken)
  }

  //used to hit create user API
  createUser(data: UserForm){
    console.log("Account Service | createUserApi ", this.createUserApiUrl);
    return this.authService.wrapTokenPostApi(this.createUserApiUrl, data)
  }

  //used to hit get user list API
  getUserList(page, pageSize, search){
    let url = this.accountApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search); 
    console.log("Account Service | getUserListApi ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //used to hit get user by id API
  getUserById(id){
    let url = this.accountApiUrl + '/' + id;
    console.log("Account Service | getUserById ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //used to hit update user API
  updateUser(data){
    let url = this.updateAccountApirUrl;
    console.log("Account Service | updateUser ", url);
    return this.authService.wrapTokenPutApi(url, data)
  }
}
