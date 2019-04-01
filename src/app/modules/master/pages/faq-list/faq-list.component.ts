import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FAQService } from '../../services/faq.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: []
})
export class FAQListComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }

  faqColumns: string[] = [
    'bookmark',
    'number',
    'category',
    'title',
    'order',
    'uniqueTag',
    'action',
  ]

  faqs = [
    {
      id: 'ID1',
      category: 'about adira',
      title: 'about adira title 1',
      unique_tag: 'unique tag 1',
      bookmark: true,
      title_order: 1,
    },
    {
      id: 'ID2',
      category: 'about adira',
      title: 'about adira title 2',
      unique_tag: 'unique tag 2',
      bookmark: false,
      title_order: 2,
    },
    {
      id: 'ID3',
      category: 'product information',
      title: 'product information title 1',
      unique_tag: 'unique tag 3',
      bookmark: false,
      title_order: 1,
    },
    {
      id: 'ID4',
      category: 'product information',
      title: 'product information title 2',
      unique_tag: 'unique tag 4',
      bookmark: true,
      title_order: 1,
    }
  ];
  search = '';
  searchTexts = [];
  closeText = '';
  loading = false;
  isFocusedInput = false;

  private table: any;
  @ViewChild('faqsTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private faqService: FAQService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog
  ) { }

  ngOnInit() {
    console.log('ArticleListComponent | ngOnInit');
    this.paginatorProps.length = this.faqs.length
    // this.lazyLoadData()
  }

  //delete
  onDelete(){
    // console.log("ArticleListComponent | onDelete")
    // const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
    //   width: '260px',
    //   data: {
    //     title: 'deleteConfirmation',
    //     content: {
    //       string: 'articleListScreen.deleteConfirmation',
    //       data: {
    //         title: article.title
    //       }
    //     }
    //   }
    // })
    // modalRef.afterClosed().subscribe(result => {
    //   if(result){
    //     this.loading = true;
    //     this.articleService.deleteArticle(article.id).subscribe(
    //       (data: any) => {
    //         try {
    //           console.table(data);
    //           this.snackBar.openFromComponent(SuccessSnackbarComponent, {
    //             data: {
    //               title: 'success',
    //               content: {
    //                 text: 'dataDeleted',
    //                 data: null
    //               }
    //             }
    //           })
    //           this.lazyLoadData()              
    //         } catch (error) {
    //           console.table(error)
    //         }
    //       },
    //       error => {
    //         try {
    //           console.table(error);
    //           this.loading = false;
    //           let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
    //             data: {
    //               title: 'failedToDelete',
    //               content: {
    //                 text: 'apiErrors.'+ (error.status ? error.error.err_code : 'noInternet'),
    //                 data: null
    //               }
    //             }
    //           })              
    //         } catch (error) {
    //           console.table(error)
    //         }
    //       }
    //     )
    //   }
    // })
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    // console.log('ArticleListComponent | onPaginatorChange');
    // this.paginatorProps = Object.assign(this.paginatorProps, e)
    // this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    // console.log('ArticleListComponent | onSearch');
    // this.searchTexts.push(this.search)
    // if (this.paginatorProps.pageIndex !== 0) {
    //   //this will call paginator change
    //   this.paginatorProps.pageIndex = 0;
    // } else {
    //   this.lazyLoadData();
    // }
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('ArticleListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.faqService.getFaqList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (data: any) => {
          try {            
            console.table(data);
            this.faqs = data.data;
            this.paginatorProps.length = data.count;
            if (this.table) {
              this.table.renderRows();
            }
          } catch (error) {
            console.table(error);
          }
        },
        error => {
          try {            
            console.table(error);
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
