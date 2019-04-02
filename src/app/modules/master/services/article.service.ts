import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  uploadApiUrl = environment.apiurl + 'upload/';
  articleApiUrl = environment.apiurl + 'article/';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('ArticleService | constructor')
  }

  //get article list with pagination and search
  getArticleList(page, pageSize, search) {
    let url = this.articleApiUrl + page + '/' + pageSize + '/' + search;
    console.log("ArticleService | getArticleList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //delete article with update
  deleteArticle(article){
    let newArticle = Object.assign(article, {is_deleted: true})
    console.log("ArticleService | deleteArticle ", this.articleApiUrl);
    return this.authService.wrapTokenPutApi(this.articleApiUrl, newArticle)
  }

  //upload image
  uploadImage(vFormDataImageUpload: FormData) {
    let url = this.uploadApiUrl;
    console.log("ArticleService | uploadImage " + url);
    return this.authService.wrapTokenPutApi(url, vFormDataImageUpload);
  }

  //load article
  loadArticleById(id: string) {
    let url = this.articleApiUrl+id;
    console.log("ArticleService | loadArticleById " + url);
    return this.authService.wrapTokenGetApi(url);
  }

  //create article
  createArticle(data) {
    let url = this.articleApiUrl;
    console.log("ArticleService | createArticle " + url);
    return this.authService.wrapTokenPostApi(url, data);
  }

  //update article
  updateArticle(data) {
    let url = this.articleApiUrl;
    console.log("ArticleService | updateArticle " + url);
    return this.authService.wrapTokenPutApi(url, data);
  }
}
