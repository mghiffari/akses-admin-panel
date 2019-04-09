import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePhonenumberRequestService {
  requestApiUrl = environment.apiurl + 'editphone/';
  updateRequestApiUrl = this.requestApiUrl + 'update';
  
  constructor(private authService: AuthService) { }

  // get request list based on page, page size and search keyword
  getRequestList(page, pageSize, search) {
    let url = this.requestApiUrl + page + '/' + pageSize + '/' + search;
    console.log("ChangePhonenumberRequestService | getRequestList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  // bulk update request with datatype of request body is array
  bulkUpdateRequest(request){
    console.log("ChangePhonenumberRequestService | updateRequest ", this.updateRequestApiUrl);
    let data;
    if(request.constructor === Array){
      data = request;
    } else {
      data = [request];
    }
    return this.authService.wrapTokenPatchApi(this.updateRequestApiUrl, data)
  }
}
