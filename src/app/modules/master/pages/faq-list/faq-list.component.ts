import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FAQService } from '../../services/faq.service';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { FAQ } from '../../models/faq';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

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

  faqs: FAQ[] = [];
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
    console.log('FAQListComponent | ngOnInit');
    this.lazyLoadData()
  }

  //delete
  onDelete(faq) {
    console.log("FAQListComponent | onDelete")
    const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'deleteConfirmation',
        content: {
          string: 'faqListScreen.deleteConfirmation',
          data: {
            title: faq.title
          }
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let delFAQ: FAQ = Object.assign(new FAQ(), faq);
        delFAQ.is_deleted = true;
        this.faqService.updateFaq(delFAQ).subscribe(
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
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
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
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('FAQListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('FAQListComponent | onSearch');
    this.searchTexts.push(this.search)
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  // event handling when toggling faq bookmark
  onToggleBookmark(faq) {
    console.log('FAQListComponent | onToggleBookmark');
    let toggleFAQ: FAQ = Object.assign(new FAQ(), faq)
    toggleFAQ.bookmark = !faq.bookmark;
    this.faqService.updateFaq(toggleFAQ).subscribe(
      (data: any) => {
        try {
          console.table(data);
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {
              title: 'success',
              content: {
                text: toggleFAQ.bookmark ? 'faqListScreen.bookmarkSuccess' : 'faqListScreen.removeBookmarkSuccess',
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
              title: toggleFAQ.bookmark ? 'faqListScreen.bookmarkFailed' : 'faqListScreen.removeBookmarkFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
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

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('FAQListComponent | lazyLoadData');
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
                title: 'faqListScreen.loadFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
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
          if (this.searchInput && isFocusedInput) {
            setTimeout(() => {
              this.searchInput.nativeElement.focus();
            });
          }
        }
      )
  }
}
