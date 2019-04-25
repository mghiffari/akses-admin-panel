import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { LovService } from 'src/app/shared/services/lov.service';

@Component({
  selector: 'app-pi-list',
  templateUrl: './pi-list.component.html',
  styleUrls: []
})
export class PIListComponent implements OnInit {
  paymentTypes = [];
  data = [
    {
      id: 'id1',
      grp_title: 'ATM Danamon',
      modified_dt: new Date(),
      modified_by: 'test@mail.com'
    },
    {
      id: 'id2',
      grp_title: 'D-Mobile',
      modified_dt: new Date(2019, 1, 2),
      modified_by: 'natashajanicetambunan@mail.com'
    },
    {
      id: 'id3',
      grp_title: 'ATM Bank Lain',
      modified_dt: new Date(2019, 3, 2),
      modified_by: 'natashajanicetambunan@mail.com'
    }
  ];
  selectedIndex = -1;
  tableColumns = ['orderButton', 'order', 'title', 'lastUpdated', 'action']
  loading = false;
  private table: any;
  @ViewChild('table') set tabl(table: ElementRef) {
    this.table = table;
  }

  // constructor
  constructor(
    private lovService: LovService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog) { }

  ngOnInit() {
    console.log("PIListComponent | ngOnInit");
    this.loading = true;
    this.lovService.getPaymentInstType().subscribe(
      response => {
        try {
          this.loading = false;
          console.table(response);
          this.paymentTypes = response.data;
          if(this.paymentTypes.length > 0){
            this.selectedIndex = 0;
          }
        } catch (error) {
          console.table(error)
        }
      }, error => {
        try {
          console.table(error);
          this.loading = false;
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'getTypeFailed',
              content: {
                text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                data: null
              }
            }
          })
        } catch (error) {
          console.table(error)
        }
      })
  }

  onChangeTabIndex(index) {
    console.log("PIListComponent | onChangeTabIndex");
    this.selectedIndex = index;
    this.loadData
  }

  // handling click arrow up event
  onOrderUp(index) {
    console.log("PIListComponent | onOrderUp");
    this.loading = true;
    if (this.data[index] && this.data[index - 1]) {
      // call swap api
      // if success load data
      let selectedData = this.data[index];
      this.data[index] = this.data[index - 1];
      this.data[index - 1] = selectedData;
      this.loading = false;
      this.loadData();
    }
  }

  // handling click arrow down event
  onOrderDown(index) {
    console.log("PIListComponent | onOrderDown");
    this.loading = true;
    if (this.data[index] && this.data[index + 1]) {
      // call swap api
      // if success load data
      let selectedData = this.data[index];
      this.data[index] = this.data[index + 1];
      this.data[index + 1] = selectedData;
      this.loading = false;
      this.loadData();
    }
  }

  // delete 
  onDelete(instructionList) {
    console.log("PIListComponent | onDelete")
    const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
      width: '260px',
      data: {
        title: 'deleteConfirmation',
        content: {
          string: 'paymentInstructionScreen.deleteConfirmation',
          data: {
            grpTitle: instructionList.grp_title
          }
        }
      }
    })
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let delInst = Object.assign({}, instructionList);
        delInst.is_deleted = true;
        // this.payInstService.updateInstList(delInst).subscribe(
        //   (response: any) => {
        //     try {
        //       console.table(response);
        //       this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        //         data: {
        //           title: 'success',
        //           content: {
        //             text: 'dataDeleted',
        //             data: null
        //           }
        //         }
        //       })
        this.loadData()
        //     } catch (error) {
        //       console.table(error)
        //     }
        //   },
        //   error => {
        //     try {
        //       console.table(error);
        //       this.loading = false;
        //       let errorSnackbar = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        //         data: {
        //           title: 'failedToDelete',
        //           content: {
        //             text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
        //             data: null
        //           }
        //         }
        //       })
        //     } catch (error) {
        //       console.table(error)
        //     }
        //   }
        // )
      }
    })
  }

  // call api to get data based on paymentType
  loadData() {
    console.log("PIListComponent | loadData");
    this.loading = true;
    this.table.renderRows();
    this.loading = false;
  }

}
