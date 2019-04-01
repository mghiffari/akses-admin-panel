import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { Banner } from '../../models/banner';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: []
})
export class BannerListComponent implements OnInit {
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }
  today = new Date();

  bannerColumns: string[] = [
    'number',
    'title',
    'banner',
    'startDate',
    'endDate',
    'status',
    'order',
    'action',
  ]

  banners: Banner[] = [];
  search = '';
  searchTexts = [];
  closeText = '';
  loading = false;
  isFocusedInput = false;

  private table: any;
  @ViewChild('bannersTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private bannerService: BannerService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog
  ) { }

  ngOnInit() {
    console.log('BannerListComponent | ngOnInit');
    this.lazyLoadData()
  }

  //delete
  onDelete(banner){
    console.log("BannerListComponent | onDelete")
    const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'deleteConfirmation',
        content: {
          string: 'bannerListScreen.deleteConfirmation',
          data: {
            title: banner.title
          }
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if(result){
        this.loading = true;
        this.bannerService.deleteBanner(banner.id).subscribe(
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
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('BannerListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('BannerListComponent | onSearch');
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
    console.log('BannerListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.bannerService.getBannerList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (data: any) => {
          try {            
            console.table(data);
            this.banners = data.data;
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
                title: 'bannerListScreen.loadFailed',
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

  //check if banner active based on start date and end date
  isActiveBanner(startDt, endDt){
    console.log('BannerListComponent | isActiveBanner');
    let startDate = new Date(startDt);
    let endDate = new Date(endDt);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return this.today >= startDate && this.today <= endDate;
  }

}
