import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LovService {
  lovApiUrl = environment.apiurl + 'lov/';
  lovTypeApiUrl = this.lovApiUrl + 'type?value=';
  getModulsApiUrl = this.lovTypeApiUrl + 'internal_navigation';
  getArticleCatApiUrl = this.lovTypeApiUrl + 'article_category';
  getFAQCatApiUrl = this.lovTypeApiUrl + 'faq_category';
  
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
}
