import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePhonenumberRequestService {
  requestApiUrl = environment.apiurl + 'change-phonenumber-requests/';
  
  constructor(private authService: AuthService) { }

  getRequestList(page, pageSize, search) {
    let url = this.requestApiUrl + page + '/' + pageSize + '/' + search;
    console.log("ChangePhonenumberRequestService | getRequestList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  updateRequest(request){
    console.log("ChangePhonenumberRequestService | getRequestList ", this.requestApiUrl);
    return this.authService.wrapTokenPutApi(this.requestApiUrl, request)
  }
}
