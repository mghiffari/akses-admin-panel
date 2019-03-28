import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articleApiUrl = environment.apiurl + 'article/';

  //constructor
  constructor(private authService: AuthService) { 
    console.log('ArticleService | constructor')
  }

  //get banner list with pagination and search
  getArticleList(page, pageSize, search) {
    let url = this.articleApiUrl + page + '/' + pageSize + '/' + search;
    console.log("ArticleService | getArticleList ", url);
    return this.authService.wrapTokenGetApi(url)
  }

  //delete banner by id
  deleteArticle(id){
    let url = this.articleApiUrl + id;
    console.log("ArticleService | deleteArticle ", url);
    return this.authService.wrapTokenDeleteApi(url)
  }
}
