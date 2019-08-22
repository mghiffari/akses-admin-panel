import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { constants } from 'src/app/shared/common/constants';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-special-offer-list',
  templateUrl: './special-offer-list.component.html',
  styleUrls: []
})
export class SpecialOfferListComponent implements OnInit {
  now = new Date();
  paginatorProps = { ...constants.paginatorProps};

  offerColumns: string[] = [
    'number',
    'title',
    'preview',
    'endDate',
    'lastEdited',
    'status',
    'approval',
    'action'
  ]

  offers = [];
  search = '';
  closeText = '';
  loading = false;
  isFocusedInput = false;
  allowCreate = false;
  allowEdit = false;
  approvalStatus = constants.approvalStatus;

  private table: any;
  @ViewChild('offersTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private offerService: SpecialOfferService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('SpecialOfferListComponent | ngOnInit');
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.specialOffer)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.lazyLoadData()
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  // edit button handler
  onEdit(offer) {
    console.log('SpecialOfferListComponent | onEdit')
    if(this.allowEdit){
      if (this.isEditableOffer(offer)) {
        this.router.navigate(['/master/special-offers/update', offer.id])
      } else {
        this.lazyLoadData()
        this.editOfferError();
      }
    } else {
      this.authService.blockPageAction()
    }
  }

  // show error if to be edited offer data is not valid eq: immediate notif & notif <= 1 hr
  editOfferError() {
    console.log('SpecialOfferListComponent | editOfferError')
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: {
        title: 'error',
        content: {
          text: 'specialOfferDetailsScreen.cantUpdate.minDuration',
          data: null
        }
      }
    })
  }

  // event handling paginator value changed (page index and page size)
  onPaginatorChange(e) {
    console.log('SpecialOfferListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // event handling when user is typing on search input
  onSearch() {
    console.log('SpecialOfferListComponent | onSearch');
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  //check whether offer is editable
  isEditableOffer(offer) {
    console.log('SpecialOfferListComponent | isEditableOffer');
    return CustomValidation.durationFromNowValidation(new Date(offer.end_date)) 
      && offer.status !== this.approvalStatus.approved
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
    console.log('SpecialOfferListComponent | lazyLoadData');
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.offerService.getOfferList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize,
      this.search).subscribe(
        (response: any) => {
          try {
            console.table(response);
            this.offers = response.data;
            this.paginatorProps.length = response.count;
            this.now = new Date()
          } catch (error) {
            console.table(error);
            this.offers = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0
          }
        },
        error => {
          try {
            console.table(error);
            this.offers = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'specialOfferListScreen.loadFailed',
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
          if (this.table) {
            this.table.renderRows();
          }
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
