import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormGroup, FormControl} from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';


@Component({
  selector: 'app-request-withdrawal',
  templateUrl: './request-withdrawal.component.html',
  styleUrls: []
})

export class RequestWithdrawalListComponent implements OnInit{

  //show detail page
  vShowPartialPage: boolean = false;
  vShowFullPage: boolean = false;

  //triggered when radio button URL Option clicked
  showPartialAmount() {
    console.log('WithdrawalPartial | showPartialAmount');
  }

  showFullAmount() {
    console.log('WithdrawalPartial | showFullAmount');
  }

  loading = false;
  requestForm
  data = []
  getAmount = []
  allowCreate = false;
  allowEdit = false;
  amountValue = 0;

  constructor(
    private authService: AuthService,
    private cashoutMasterService: CashoutMasterService
  ){}

  ngOnInit() {
    this.requestForm = new FormGroup({
      jenisvamaster : new FormControl(),
      amount: new FormControl()
    })

    console.log('ToDoListComponent | ngOnInit');
    this.loading = true;
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.requestwithdrawal)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.getDataSpinner();
      this.loading = false;
    } else {
      this.authService.blockOpenPage()
    }
  }

  changeAmount(event){
    this.amountValue = event.value.balance
  }

  get amount() {
    return this.requestForm.get('amount');
  }

  get jenisvamaster() {
    return this.requestForm.get('jenisvamaster');
  }


  getDataSpinner()
  {
    this.cashoutMasterService.getListVaMaster().subscribe(
      (response: any) => {
        try
        {
          console.table(response);
          this.data = response.data
        }
        catch(e)
        {
          console.table(e)
        }
      }
    )
  }
}
