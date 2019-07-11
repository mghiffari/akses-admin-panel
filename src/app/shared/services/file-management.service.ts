import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as oss from 'ali-oss';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  uploadApiUrl = environment.apiurl + 'upload';
  deleteApiUrl = this.uploadApiUrl + '/delete';
  articleComponent = 'article';
  bannerComponent = 'component';
  footerComponent = 'footer';
  paymentInstComponent = 'payment-instruction';
  specialOfferComponent = 'special-offer';
  notificationComponent = 'notification';
  notificationIconComponent = 'notification-icon';
  notificationRecipientComp = 'notification-recipient';
  specialOfferRecipientComp = 'special-offer-recipient';
  compressImageSizeInMB = 0.2;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

   // call api to generate upload file url
  getUploadUrl(file: File, component, oldUrl = null){
    console.log("FileManagementService | upload " + this.uploadApiUrl);
    let data = new FormData()
    data.append('component', component)
    if(oldUrl){
      data.append('url', oldUrl)
    }
    data.append('type', file.type)
    let headers = new HttpHeaders()
    return this.authService.wrapTokenPutApi(this.uploadApiUrl, data, null, headers);
  }

  // put file to generated signed file upload url
  uploadFile(url, file: File){
    console.log("FileManagementService | uploadFile " + url);
    let headers = new HttpHeaders({'Content-Type': file.type})
    return this.http
    .put(url, file, {
      headers: headers
    })
  }

  // call api to delete file by name
  deleteFile(data) {
    console.log("FileManagementService | deleteFile " + this.deleteApiUrl);
    return this.authService.wrapTokenPutApi(this.deleteApiUrl, data, null);
  }

  // convert file to base64
  fileToBase64(file) {
    return Observable.create((observer: Observer<any>) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reader.abort();
        observer.error(new DOMException("Problem parsing input file."))
        observer.complete()
      };

      reader.onload = () => {
        observer.next(reader.result);
        observer.complete()
      };

      reader.readAsDataURL(file)
    })
  }

}
