import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  faqApiUrl = environment.apiurl + 'faq/';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('FaqService | constructor')
  }

  //get faq list with pagination and search
  getFaqList(page, pageSize, search) {
    let url = this.faqApiUrl + page + '/' + pageSize + '/' + search;
    console.log("FaqService | getFaqList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //delete faq by id
  deleteFaq(id){
    let url = this.faqApiUrl + id;
    console.log("FaqService | deleteFaq ", url);
    return this.authService.wrapTokenDeleteApi(url)
  }
}
