import { Injectable } from '@angular/core';
import { ImageUpload } from 'src/app/shared/models/image-upload';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  
  bannerApiUrl = environment.apiurl + 'banner/';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('BannerService | constructor')
  }

  //get banner list with pagination and search
  getBannerList(page, pageSize, search) {
    let url = this.bannerApiUrl + page + '/' + pageSize + '/' + search;
    console.log("Banner Service | getBannerListApi ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //delete banner by id
  deleteBanner(id){
    let url = this.bannerApiUrl + id;
    console.log("Banner Service | deleteBanner ", url);
    return this.authService.wrapTokenDeleteApi(url)
  }
}
