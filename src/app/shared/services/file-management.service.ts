import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
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
    private authService: AuthService
  ) { }

  uploadOSS(file: File, component, url = null) {
    console.log('uploadOSS')
    return Observable.create((observer: Observer<any>) => {
      try {
        let client = new oss({
          region: 'oss-ap-southeast-5',
          accessKeyId: 'LTAIfiNpKvDdRnwW',
          accessKeySecret: 'kc03CB1BfrfZJvO1s4vcWdWHF998eG',
          bucket: 'adira-akses-dev'
        });
        let fileName = component + '/' + component + '_' + new Date().getTime() + '.' + file.name.split('.').pop();
        if (url) {
          let split = url.split('/')
          let name = url
          if (split.length >= 2) {
            name = split.pop()
            name = split.pop() + '/' + name;
          }
          client.delete(name).then((response) => {
            console.table(response);
            client.put(fileName, file).then(response => {
              console.table(response)
              if (response.res.status == 200) {
                observer.next({
                  url: client.generateObjectUrl(response.name),
                  name: response.name
                })
                observer.complete()
              } else {
                observer.error(response)
                observer.complete()
              }

            })
          });
        } else {
          client.put(fileName, file).then(response => {
            console.table(response)
            if (response.res.status == 200) {
              observer.next({
                url: client.generateObjectUrl(response.name),
                name: response.name
              })
              observer.complete()
            } else {
              observer.error(response)
              observer.complete()
            }

          })
        }
      } catch (error) {
        observer.error(error)
        observer.complete()
      }
    })
  }

  deleteFileOSS(name) {
    return Observable.create((observer: Observer<any>) => {
      try {
        let client = new oss({
          region: 'oss-ap-southeast-5',
          accessKeyId: 'LTAIfiNpKvDdRnwW',
          accessKeySecret: 'kc03CB1BfrfZJvO1s4vcWdWHF998eG',
          bucket: 'adira-akses-dev'
        });
        client.delete(name).then((response) => {
          console.table(response);
          observer.next({
            message: name + ' is deleted'
          })
          observer.complete()
        });
      } catch (error) {
        observer.error(error)
        observer.complete()
      }
    })
  }

  uploadFile(data: FormData) {
    console.log("FileManagementService | upload " + this.uploadApiUrl);
    return this.authService.wrapTokenPutApi(this.uploadApiUrl, data, null, new HttpHeaders());
  }

  deleteFile(data) {
    console.log("FileManagementService | deleteFile " + this.deleteApiUrl);
    // return this.authService.wrapTokenDeleteApi(this.deleteApiUrl, null, data);
    return this.authService.wrapTokenPutApi(this.deleteApiUrl, null, data);
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
