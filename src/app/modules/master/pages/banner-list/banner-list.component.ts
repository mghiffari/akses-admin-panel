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
  orderObject = {};
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
        let bannerDel: Banner = Object.assign(new Banner(), banner);
        bannerDel.is_deleted = true;
        this.bannerService.updateBanner(bannerDel).subscribe(
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
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  // event handling when sorting change
  onSortChange(e){
    console.log('BannerListComponent | onPaginatorChange');
    this.orderObject = e;
    this.onSearch();
  }

  // call api to get data based on table page, page size, search keyword, and order
  lazyLoadData() {
    console.log('BannerListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.bannerService.getBannerList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search,
      this.orderObject).subscribe(
        (data: any) => {
          try {            
            console.table(data);
            this.banners = data.data;
            this.paginatorProps.length = data.count;
          } catch (error) {
            console.table(error);
            this.banners = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
          } 
        },
        error => {
          try {            
            console.table(error);
            this.banners = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
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
