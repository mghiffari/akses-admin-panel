import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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

  //get article list by category
  getArticlesByCategory(category){
    let url = this.articleApiUrl + 1 + '/' + 10 + '/';
    console.log("ArticleService | getArticlesByCategory ", url);
    return this.authService.wrapTokenGetApi(url)
  }
}
