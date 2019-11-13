import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
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
  loading = false;
  requestForm: FormGroup;
  data = []
  allowCreate = false;
  allowEdit = false;

  get amount() {
    return this.requestForm.get('amount');
  }

  vShowPartialPage: boolean = false;

  vShowFullPage: boolean = false;

  //triggered when radio button URL Option clicked
  showPartialPage() {
    console.log('WithdrawalPartial | showPartialPage');
  }

  constructor(
    private authService: AuthService,
    private cashoutMasterService: CashoutMasterService
  ){}

  ngOnInit() {
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