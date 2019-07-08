import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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

  convertFileToBase64(file) {
    const reader = new FileReader();
  
    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
  
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsText(file);
    });
  };

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
