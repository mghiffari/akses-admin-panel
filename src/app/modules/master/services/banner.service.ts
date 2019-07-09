import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BannerData } from '../models/banner-detail';
import Utils from '../../../shared/common/utils';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  bannerApiUrl = environment.apiurl + 'banner';

  //constructor
  constructor(private authService: AuthService) {
    console.log('BannerService | constructor')
  }

  //get banner list with pagination and search and sort
  getBannerList(page, pageSize, search, datatableObject) {
    let url = this.bannerApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search);
    console.log("Banner Service | getBannerListApi ", url);
    return this.authService.wrapTokenPostApi(url, datatableObject)
  }

  //get banner data by id
  loadBannerById(id: string) {
    let url = this.bannerApiUrl + '/' + id;
    console.log("Banner Service | loadBannerById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  createBanner(vBannerData: BannerData) {
    let url = this.bannerApiUrl;
    console.log("Banner Service | createBanner " + url);
    return this.authService.wrapTokenPostApi(url, vBannerData)
  }

  updateBanner(vUpdateBannerData) {
    let url = this.bannerApiUrl;
    return this.authService.wrapTokenPutApi(url, vUpdateBannerData)
  }
}
