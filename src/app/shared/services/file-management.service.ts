import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  uploadApiUrl = environment.apiurl + 'upload/';
  deleteApiUrl = this.uploadApiUrl + 'delete/'

  constructor(
    private authService: AuthService
  ) { }

  uploadFile(data: FormData) {
    console.log("FileManagementService | upload " + this.uploadApiUrl);
    return this.authService.wrapTokenPutApi(this.uploadApiUrl, data);
  }

  deleteFile(data){
    console.log("FileManagementService | deleteFile " + this.deleteApiUrl);
    return this.authService.wrapTokenDeleteApi(this.deleteApiUrl, null, data);
  }

}