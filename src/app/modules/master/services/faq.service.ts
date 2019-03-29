import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { FAQ } from '../models/faq';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  faqApiUrl = environment.apiurl + 'faq/';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('FAQService | constructor')
  }

  //get faq list with pagination and search
  getFaqList(page, pageSize, search) {
    let url = this.faqApiUrl + page + '/' + pageSize + '/' + search;
    console.log("FAQService | getFaqList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //delete faq by id
  deleteFaq(id){
    let url = this.faqApiUrl + id;
    console.log("FAQService | deleteFaq ", url);
    return this.authService.wrapTokenDeleteApi(url)
  }

  //create FAQ
  createFaq(data: FAQ){
    console.log("FAQService | createFAQ ", this.faqApiUrl);
    return this.authService.wrapTokenPostApi(this.faqApiUrl, data);
  }

  //get FAQ by id
  getFaqById(id){
    let url = this.faqApiUrl + id;
    console.log("FAQService | getFaqById ", url);
    return this.authService.wrapTokenGetApi(url);
  }

  //update FAQ by id
  updateFaq(data: FAQ){
    console.log("FAQService | updateFaq ", this.faqApiUrl);
    return this.authService.wrapTokenPatchApi(this.faqApiUrl, data);
  }
}
