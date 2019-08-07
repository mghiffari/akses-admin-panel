import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { RolePrivilege } from 'src/app/modules/user-management/models/role-privilege';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  pageApiUrl = environment.apiurl + 'page';
  getRolePrivilegeApiUrl = this.pageApiUrl + '/get-group';
  createRolePrivilegeApiUrl = this.pageApiUrl + '/create-group';
  updateRolePrivilegeApiUrl = this.pageApiUrl + '/update-group';
  getRoleApiUrl = this.pageApiUrl + '/get-role';

  // constructor
  constructor(private authService: AuthService) { 
    console.log('PageService | constructor')
  }

  // get list of roles and its priviledes and list of privileges
  getRolePrivileges() {
    console.log('PageService | getRolePrivileges')
    return this.authService.wrapTokenGetApi(this.getRolePrivilegeApiUrl)
  }

  // create role privileges
  createRolePrivileges(data: RolePrivilege) {
    console.log('PageService | createRolePrivileges')
    return this.authService.wrapTokenPostApi(this.createRolePrivilegeApiUrl, data)
  }

  // update role privileges
  updateRolePrivileges(data: RolePrivilege) {
    console.log('PageService | updateRolePrivileges')
    return this.authService.wrapTokenPutApi(this.updateRolePrivilegeApiUrl, data)
  }

  // get roles list
  getRoleList() {
    console.log('PageService | getRoleList')
    return this.authService.wrapTokenGetApi(this.getRoleApiUrl)
  }
  
}
