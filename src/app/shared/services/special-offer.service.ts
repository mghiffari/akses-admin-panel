import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialOfferService {
  specialOfferApiUrl = environment.apiurl + 'specialoffer/';

  constructor(
    private authService: AuthService
  ) { }

  //used to hit get special offer list API
  getOfferList(page, pageSize, search){
    let url = this.specialOfferApiUrl+ page + '/' + pageSize + '/' + search; 
    console.log("SpecialOfferService | getUserListApi ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //used to hit update special offer API
  updateOffer(data){
    let url = this.specialOfferApiUrl;
    console.log("SpecialOfferService | updateOffer ", url);
    return this.authService.wrapTokenPutApi(url, data)
  }

  //get offer by id
  getOfferById(id: string) {
    let url = this.specialOfferApiUrl + id;
    console.log("SpecialOfferService | getOfferById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  //create offer
  createOffer(data) {
    let url = this.specialOfferApiUrl;
    console.log("SpecialOfferService | createOffer " + url);
    return this.authService.wrapTokenPostApi(url, data);
  }
}
