import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup, MatTab, MatTabHeader, MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CreditSimulationService } from 'src/app/shared/services/credit-simulation.service';
import { CSProduct } from 'src/app/shared/models/cs-product';
import { map, catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorSnackbarComponent } from 'src/app/shared/components/error-snackbar/error-snackbar.component';
import { CSProductComp } from '../../models/cs-product-comp';
import { CreditSimulation } from '../../models/credit-simulation';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-cs-product',
  templateUrl: './cs-product.component.html',
  styleUrls: ['./cs-product.component.scss']
})
export class CSProductComponent implements OnInit {
  loading = false;
  components: CSProductComp[] = [];
  data: CreditSimulation[] = [];
  productId;
  product: CSProduct;
  tenureMonths = [
    3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60
  ]
  tenure = [1, 2, 3, 4, 5]
  tableColumns = [];
  selectedIndex = -1;
  edit = false;
  locale = 'id';
  csFormGroup: FormGroup;

  private table: any;
  @ViewChild('areaTenureTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private tabs: MatTabGroup;
  @ViewChild('tabs') set tabsEl(tabs: MatTabGroup) {
    this.tabs = tabs;
  }

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private creditSimulationService: CreditSimulationService,
    private snackBar: MatSnackBar,
    private modalConfirmation: MatDialog
  ) { }

  ngOnInit() {
    console.log('CreditSimulationProductComponent | ngOnInit')
    this.route.params.subscribe(params => {
      try {
        console.table(params);
        this.productId = params.productId;
        this.components = [];
        this.product = new CSProduct();
        this.edit = false;
        this.tabs._handleClick = this.interceptTabChange.bind(this)
        this.tableColumns = ['area']
        this.loading = true;
        this.selectedIndex = -1;
        this.csFormGroup = new FormGroup({
          areaForms: new FormArray([])
        });

        this.tenureMonths.forEach(month => {
          this.tableColumns.push('tnr' + month)
        })

        this.translateService.get('angularLocale').subscribe(res => {
          this.locale = res;
        });

        let tasks = [
          this.creditSimulationService.getProductById(this.productId).pipe(map(res => res), catchError(e => of(e))),
          this.creditSimulationService.getProductComponents(this.productId).pipe(map(res => res), catchError(e => of(e)))
        ]

        forkJoin(tasks).subscribe((response: any) => {
          try {
            console.table(response[0])
            const error = response[0];
            if (response[0] instanceof HttpErrorResponse) {
              this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                data: {
                  title: 'productCreditSimulationScreen.getProductFailed',
                  content: {
                    text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                    data: null
                  }
                }
              })
            } else {
              this.product = response[0].data;
            }
          } catch (error) {
            console.table(error)
          } finally {
            try {
              console.table(response[1])
              const error = response[1];
              if (response[1] instanceof HttpErrorResponse) {
                this.snackBar.openFromComponent(ErrorSnackbarComponent, {
                  data: {
                    title: 'productCreditSimulationScreen.getProdCompFailed',
                    content: {
                      text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                      data: null
                    }
                  }
                })
              } else {
                this.components = response[1].data;
                if (this.components.length > 0) {
                  this.selectedIndex = 0;
                }
              }
            } catch (error) {
              console.table(error)
            } finally {
              this.loading = false;
            }
          }
        })
      } catch (error) {
        console.table(error)
      }
    })
  }

  // method to intercept tab click event, to verify when editing
  interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    console.log('CreditSimulationProductComponent | interceptTabChange');
    if (this.edit && idx !== this.selectedIndex) {
      let args = arguments;
      const modalRef = this.modalConfirmation.open(ConfirmationModalComponent, {
        width: '260px',
        restoreFocus: false,
        data: {
          title: 'productCreditSimulationScreen.confirmationModal.title',
          content: {
            string: 'productCreditSimulationScreen.confirmationModal.content',
            data: null
          }
        }
      })
      modalRef.afterClosed().subscribe((result) => {
        if(result){
          this.selectedIndex = idx
        } 
      })
    } else {
      MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
    }
  }

  // handle tabChange
  onChangeTabIndex(index) {
    console.log('CreditSimulationProductComponent | onChangeTabIndex');
    this.selectedIndex = index;
    this.edit = false;
    this.csFormGroup = new FormGroup({
      areaForms: new FormArray([])
    });
    this.loadData();
  }

  // get form control of area form based on index and form control name
  getAreaFormControl(index, formControlName){
    console.log('CreditSimulationProductComponent | getAreaFormControl');
    let formArray = this.csFormGroup.get('areaForms') as FormArray;
    return formArray.at(index).get(formControlName);
  }

  //change to edit mode for component
  onEdit() {
    console.log('CreditSimulationProductComponent | onEdit');
    this.onResetForm()
    this.edit = true;
  }

  //reinitialize value for form
  onResetForm(){
    console.log('CreditSimulationProductComponent | onResetForm');
    let areaForms = [];
    for(let i=0; i< this.data.length; i++){
      let cs: CreditSimulation = this.data[i];
      let formGroupContent: any = {};
      formGroupContent.id = new FormControl(cs.id);
      for(let month of this.tenureMonths){
        const key = 'tnr_'+month+'m';
        formGroupContent[key] = new FormControl(cs[key], [Validators.required, Validators.min(0)])
      }
      for(let num of this.tenure){
        const key = 'tnr_'+num;
        formGroupContent[key] = new FormControl(cs[key])
      }
      areaForms.push(new FormGroup(formGroupContent))
    }
    let formArray = new FormArray(areaForms)
    this.csFormGroup = new FormGroup({
      areaForms: formArray
    })
  }

  // change from edit mode to view mode
  onCloseEdit(){
    console.log('CreditSimulationProductComponent | onCloseEdit');
    this.edit = false;
    this
  }
  // call api to load table data base on product id and component id
  loadData() {
    console.log('CreditSimulationProductComponent | loadData')
    this.loading = true;

    if(this.selectedIndex >= 0){
      let component = this.components[this.selectedIndex]
      this.creditSimulationService.getProdCompCS(this.productId, component.component_id).subscribe(
        response => {
          try {
            console.table(response)
            this.data = response.data;
          } catch (error) {
            console.table(error)
          } finally {
            this.loading = false;
          }
        }, error => {
          try {
            console.table(error)
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {
                title: 'productCreditSimulationScreen.getCreditSimulationFailed',
                content: {
                  text: 'apiErrors.' + (error.status ? error.error.err_code : 'noInternet'),
                  data: null
                }
              }
            })
          } catch (error) {
            console.table(error)
          } finally {
            this.loading = false;
          }
        }
      )
      if (this.table) {
        this.table.renderRows();
      }
      this.loading = false;
    } else {
      this.loading = false;
    }
  }
}
