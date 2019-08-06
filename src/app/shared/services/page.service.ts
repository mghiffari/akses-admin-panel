import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  pageApiUrl = environment.apiurl + 'page';
  rolePrivilegeApiUrl = this.pageApiUrl + '/get-group';

  // constructor
  constructor(private authService: AuthService) { 
    console.log('PageService | constructor')
  }

  // get list of roles and its priviledes and list of privileges
  getRolePrivileges() {
    console.log('PageService | getRolePrivileges')
    return this.authService.wrapTokenGetApi(this.rolePrivilegeApiUrl)
  }
  
}
