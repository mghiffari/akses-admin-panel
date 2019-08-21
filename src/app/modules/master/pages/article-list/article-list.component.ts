import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { ArticleService } from '../../../../shared/services/article.service';
import { ArticleData } from '../../models/articles';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: []
})
export class ArticleListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps};

  articleColumns: string[] = [
    'number',
    'category',
    'title',
    'uniqueTag',
    'action',
  ]

  articles: ArticleData[] = [];
  search = '';
  searchTexts = [];
  closeText = '';
  loading = false;
  isFocusedInput = false;
  allowCreate = false;
  allowEdit = false;
  allowDelete = false;

  private table: any;
  @ViewChild('articlesTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('ArticleListComponent | ngOnInit');
    this.allowCreate = false;
    this.allowEdit = false;
    this.allowDelete = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.article)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.lazyLoadData()
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.allowDelete = this.authService.getFeatureDeletePrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  //delete
  onDelete(article){
    console.log("ArticleListComponent | onDelete")
    if(this.allowDelete){
      const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
        width: '260px',
        data: {
          title: 'deleteConfirmation',
          content: {
            string: 'articleListScreen.deleteConfirmation',
            data: {
              title: article.title
            }
          }
        }
      })
      modalRef.afterClosed().subscribe(result => {
        if(result){
          this.loading = true;
          let delArticle = Object.assign({}, article);
          delArticle.is_deleted = true;
          this.articleService.updateArticle(delArticle).subscribe(
            (data: any) => {
              try {
                console.table(data);
                this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                  data: {
                    title: 'success',
                    content: {
                      text: 'dataDeleted',
                      data: null
                    }
                  }
                })
                this.lazyLoadData()              
              } catch (error) {
                console.table(error)
              }
            },
            error => {
              try {
                console.table(error);
                this.loading = false;
                let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                  data: {
                    title: 'failedToDelete',
                    content: {
                      text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
                      data: null
                    }
                  }
                })              
              } catch (error) {
                console.table(error)
              }
            }
          )
        }
      })
    } else {
      this.authService.blockPageAction()
    }
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('ArticleListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('ArticleListComponent | onSearch');
    this.searchTexts.push(this.search)
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('ArticleListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.articleService.getArticleList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (data: any) => {
          try {            
            console.table(data);
            this.articles = data.data;
            this.paginatorProps.length = data.count;
            if (this.table) {
              this.table.renderRows();
            }
          } catch (error) {
            console.table(error);
            this.articles = []
            this.paginatorProps.pageIndex = 0
            this.paginatorProps.length = 0
          } 
        },
        error => {
          try {            
            console.table(error);
            this.articles = []
            this.paginatorProps.pageIndex = 0
            this.paginatorProps.length = 0
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'articleListScreen.loadFailed',
                content: {
                  text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.log(error)
          }
        }
      ).add(
        () => {
          if (this.table) {
            this.table.renderRows();
          }
          this.loading = false;
          if ( this.searchInput && isFocusedInput){
            setTimeout(() => {
              this.searchInput.nativeElement.focus();
            });
          }
        }
      )
  }
}
