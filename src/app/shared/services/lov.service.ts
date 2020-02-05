import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LOV } from 'src/app/modules/master/models/lov';

@Injectable({
  providedIn: 'root'
})
export class LovService {
  lovApiUrl = environment.apiurl + 'lov';
  lovType = environment.endPoint.lovType;
  lovTypeApiUrl = environment.apiurl + this.lovType + '/type?value=';
  getModulsApiUrl = this.lovTypeApiUrl + 'internal_navigation';
  getArticleCatApiUrl = this.lovTypeApiUrl + 'article_category';
  getFAQCatApiUrl = this.lovTypeApiUrl + 'faq_category';
  getSpecialOfferCatApiUrl = this.lovTypeApiUrl + 'special_offer_type';
  indonesiaZoneApiUrl = this.lovApiUrl + '/indonesia-zone';
  branchTypeApiUrl = this.lovTypeApiUrl + 'branch_type';
  indonesiaZoneCityApiUrl = this.indonesiaZoneApiUrl + '?province=';
  indonesiaZoneDistrictApiUrl = this.indonesiaZoneApiUrl + '?city=';
  indonesiaZoneSubDistrictApiUrl = this.indonesiaZoneApiUrl + '?district=';
  paymentInstructionType = this.lovApiUrl + '?value=payment_instruction_type';

  constructor(private authService: AuthService) {
    console.log('LovService | constructor')
  }

  //get lov of internal link moduls
  getModuls() {
    let url = this.getModulsApiUrl;
    console.log("LovService | getModuls " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  //get lov of article category
  getArticleCategory() {
    let url = this.getArticleCatApiUrl;
    console.log("LovService | getArticleCategory " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  //get lov of faq category
  getFAQCategory() {
    let url = this.getFAQCatApiUrl;
    console.log("LovService | getFAQCategory " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  //get lov of branch type
  getBranchType() {
    console.log("LovService | getBranchType " + this.branchTypeApiUrl);
    return this.authService.wrapTokenGetApi(this.branchTypeApiUrl);
  }

  //get indonesia provinces lov
  getIndonesiaProvince() {
    console.log("LovService | getIndonesiaProvince " + this.indonesiaZoneApiUrl);
    return this.authService.wrapTokenGetApi(this.indonesiaZoneApiUrl);
  }

  // get cities of province by id
  getIndonesiaProvinceCities(provinceId) {
    let url = this.indonesiaZoneCityApiUrl + provinceId;
    console.log("LovService | getIndonesiaProvinceCities " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  // get district of city by id
  getIndonesiaCityDistricts(cityId) {
    let url = this.indonesiaZoneDistrictApiUrl + cityId;
    console.log("LovService | getIndonesiaCityDistricts " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  // get sub-districts of district by id
  getIndonesiaDistrictSubDistricts(districtId) {
    let url = this.indonesiaZoneSubDistrictApiUrl + districtId;
    console.log("LovService | getIndonesiaDistrictSubDistricts " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  // get payment instruction type
  getPaymentInstType() {
    console.log("LovService | getPaymentInstType " + this.paymentInstructionType);
    return this.authService.wrapTokenGetApi(this.paymentInstructionType);
  }

  // get special offer type
  getSpecialOfferCategory() {
    console.log("LovService | getSpecialOfferCategory " + this.getSpecialOfferCatApiUrl);
    return this.authService.wrapTokenGetApi(this.getSpecialOfferCatApiUrl);
  }

  // create LOV
  createLOV(data: LOV) {
    console.log("LovService | createLOV ", environment.apiurl + this.lovType);
    return this.authService.wrapTokenPostApi(environment.apiurl + this.lovType, data);
  }

  // update LOV
  updateLOV(data: LOV){
    console.log("LovService | updateLOV ", environment.apiurl + this.lovType);
    return this.authService.wrapTokenPutApi(environment.apiurl + this.lovType, data);
  }

  // update LOV
  deleteLOV(data: LOV){
    console.log("LovService | deleteLOV ", environment.apiurl + this.lovType);
    return this.authService.wrapTokenDeleteApi(environment.apiurl + this.lovType, null, data);
  }
}
