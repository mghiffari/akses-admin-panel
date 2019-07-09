import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import Utils from '../../../shared/common/utils';

@Injectable({
  providedIn: 'root'
})
export class ChangePhoneService {
  requestApiUrl = environment.apiurl + 'editphone';
  updateRequestApiUrl = this.requestApiUrl + '/update';
  
  constructor(private authService: AuthService) { }

  // get request list based on page, page size and search keyword
  getRequestList(page, pageSize, search) {
    let url = this.requestApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);
    console.log("ChangePhoneService | getRequestList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  // bulk update request with datatype of request body is array
  bulkUpdateRequest(request){
    console.log("ChangePhoneService | updateRequest ", this.updateRequestApiUrl);
    let data;
    if(request.constructor === Array){
      data = request;
    } else {
      data = [request];
    }
    // return this.authService.wrapTokenPatchApi(this.updateRequestApiUrl, data)
    return this.authService.wrapTokenPutApi(this.updateRequestApiUrl, data)
  }
}
