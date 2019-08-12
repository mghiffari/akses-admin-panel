import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';
import { LovService } from 'src/app/shared/services/lov.service';
import { PayInstService } from '../../services/pay-inst.service';
import { InstructionList } from '../../models/instruction-list';
import { LovData } from 'src/app/shared/models/lov';

@Component({
  selector: 'app-pi-list',
  templateUrl: './pi-list.component.html',
  styleUrls: []
})
export class PIListComponent implements OnInit {
  paymentTypes: LovData[] = [];
  data: InstructionList[] = [];
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
    private modalConfirmation: MatDialog,
    private payInstService: PayInstService) { }

  ngOnInit() {
    console.log("PIListComponent | ngOnInit");
    this.loading = true;
    this.lovService.getPaymentInstType().subscribe(
      response => {
        try {
          this.loading = false;
          console.table(response);
          this.paymentTypes = response.data;
          if (this.paymentTypes.length > 0) {
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
              title: 'paymentInstructionScreen.getTypeFailed',
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
    this.loadData()
  }

  // handling click arrow up event
  onOrderUp(index) {
    console.log("PIListComponent | onOrderUp");
    this.loading = true;
    if (this.data[index] && this.data[index - 1]) {
      let selectedData = new InstructionList();
      selectedData.id = this.data[index].id;
      selectedData.grp_order = this.data[index - 1].grp_order;
      let toBeSwappedOrderData = new InstructionList();
      toBeSwappedOrderData.id = this.data[index - 1].id;
      toBeSwappedOrderData.grp_order = this.data[index].grp_order;
      this.swapOrder([selectedData, toBeSwappedOrderData])
    }
  }

  // call swap order api
  swapOrder(data) {
    console.log("PIListComponent | swapOrder");
    this.payInstService.swapListOrder(data).subscribe(
      response => {
        this.loadData()
      }, error => {
        this.loading = false;
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: {
            title: 'paymentInstructionScreen.changeOrderFailed',
            content: {
              text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
              data: null
            }
          }
        })
      }
    )
  }

  // handling click arrow down event
  onOrderDown(index) {
    console.log("PIListComponent | onOrderDown");
    this.loading = true;
    if (this.data[index] && this.data[index + 1]) {
      let selectedData = new InstructionList();
      selectedData.id = this.data[index].id;
      selectedData.grp_order = this.data[index + 1].grp_order;
      let toBeSwappedOrderData = new InstructionList();
      toBeSwappedOrderData.id = this.data[index + 1].id;
      toBeSwappedOrderData.grp_order = this.data[index].grp_order;
      this.swapOrder([selectedData, toBeSwappedOrderData])
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
        let delInst = new InstructionList();
        delInst.id = instructionList.id
        delInst.grp_order = instructionList.grp_order
        delInst.grp_title = instructionList.grp_title
        delInst.instruction_type = instructionList.instruction_type
        delInst.icon = instructionList.icon
        delInst.is_deleted = true;
        this.payInstService.updateList(delInst).subscribe(
          (response: any) => {
            try {
              console.table(response);
              this.snackBar.openFromComponent(SuccessSnackbarComponent, {
                data: {
                  title: 'success',
                  content: {
                    text: 'dataDeleted',
                    data: null
                  }
                }
              })
              this.loadData()
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

  // call api to get data based on paymentType
  loadData() {
    console.log("PIListComponent | loadData");
    this.loading = true;
    this.payInstService.getListByType(this.paymentTypes[this.selectedIndex].name).subscribe(
      response => {
        try {
          console.table(response)
          this.loading = false;
          this.data = response.data;
          if(this.table){
            this.table.renderRows();
          }
        } catch (error) {
          console.table(error)
          this.data = [];
          if(this.table){
            this.table.renderRows();
          }
        }
      }, error => {
        try {
          console.table(error);
          this.loading = false;
          this.data = [];
          if(this.table){
            this.table.renderRows();
          }
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {
              title: 'paymentInstructionScreen.getInstructionListFailed',
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
}
