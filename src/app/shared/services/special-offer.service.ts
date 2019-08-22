import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import Utils from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class SpecialOfferService {
  specialOfferApiUrl = environment.apiurl + 'specialoffer';
  saveApiUrl = this.specialOfferApiUrl + '/save'

  constructor(
    private authService: AuthService
  ) { }

  // get list of active special offers
  getActiveOfferList(){
    console.log("SpecialOfferService | getActiveOfferList ", this.specialOfferApiUrl);
    return this.authService.wrapTokenGetApi(this.specialOfferApiUrl)
  }

  //used to hit get special offer list API
  getOfferList(page, pageSize, search){
    let url = this.specialOfferApiUrl + '/' + page + '/' + pageSize + Utils.appendSearchKeyword(search); 
    console.log("SpecialOfferService | getUserListApi ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //used to hit update special offer API
  updateOffer(data){
    let url = this.saveApiUrl;
    console.log("SpecialOfferService | updateOffer ", url);
    return this.authService.wrapTokenPostApi(url, data)
  }

  //get offer by id
  getOfferById(id: string) {
    let url = this.specialOfferApiUrl + '/' + id;
    console.log("SpecialOfferService | getOfferById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  //create offer
  createOffer(data) {
    let url = this.saveApiUrl;
    console.log("SpecialOfferService | createOffer " + url);
    return this.authService.wrapTokenPostApi(url, data);
  }
}
