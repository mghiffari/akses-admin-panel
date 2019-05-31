import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SpecialOfferService } from 'src/app/shared/services/special-offer.service';
import { SpecialOffer } from 'src/app/shared/models/special-offer';

@Component({
  selector: 'app-special-offer-list',
  templateUrl: './special-offer-list.component.html',
  styleUrls: []
})
export class SpecialOfferListComponent implements OnInit {
  now = new Date();
  paginatorProps = {
    pageSizeOptions: [10, 25, 50, 100],
    pageSize: 10,
    showFirstLastButtons: true,
    length: 0,
    pageIndex: 0
  }

  offerColumns: string[] = [
    'number',
    'title',
    'preview',
    'endDate',
    'lastEdited',
    'action'
  ]

  offers = [];
  search = '';
  closeText = '';
  loading = false;
  isFocusedInput = false;

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
    private modal: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('SpecialOfferListComponent | ngOnInit');
    this.lazyLoadData()
  }

  //delete
  onDelete(offer) {
    console.log("SpecialOfferListComponent | onDelete")
    const modalRef = this.modal.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'deleteConfirmation',
        content: {
          string: 'specialOfferListScreen.deleteConfirmation',
          data: {
            title: offer.title
          }
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let updatedOffer: SpecialOffer = Object.assign(new SpecialOffer(), offer)
        updatedOffer.is_deleted = true;
        this.offerService.updateOffer(updatedOffer).subscribe(
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

  // edit button handler
  onEdit(offer) {
    console.log('SpecialOfferListComponent | onEdit')
    if (this.isEditableOffer(offer)) {
      this.router.navigate(['/master/special-offers/update', offer.id])
    } else {
      this.table.renderRows();
      this.editOfferError();
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
