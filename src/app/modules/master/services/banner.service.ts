import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BannerData, UpdateBannerData } from '../models/banner-detail';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  
  uploadApiUrl = environment.apiurl + 'upload/';
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

  //upload image
  uploadImage(vFormDataImageUpload: FormData) {
    let url = this.uploadApiUrl;
    console.log("Banner Service | uploadImage " + url);
    return this.authService.wrapTokenPutApi(this.uploadApiUrl, vFormDataImageUpload);
  }

  //get banner data by id
  loadBannerById(id: string) {
    let url = this.bannerApiUrl+id;
    console.log("Banner Service | loadBannerById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  createBanner(vBannerData: BannerData) {
    let url = this.bannerApiUrl;
    console.log("Banner Service | createBanner " + url);
    return this.authService.wrapTokenPostApi(url, vBannerData)
  }

  updateBanner(vUpdateBannerData: UpdateBannerData) {
    let url = this.bannerApiUrl;
    return this.authService.wrapTokenPutApi(url, vUpdateBannerData)
  }
}
