import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { filter, map, mergeMap, startWith, pairwise } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/shared/form-validation/custom-validation';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';
import { MaskedInputType } from 'src/app/shared/components/masked-num-input/masked-num-input.component';
import { requestForm } from '../../models/init-sub-req';
import { RequestSubmitModalComponent } from '../../components/request-submit-modal/request-submit-modal.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-request-withdrawal',
  templateUrl: './request-withdrawal.component.html',
  styleUrls: []
})

export class RequestWithdrawalListComponent implements OnInit {

  //show detail page
  vShowPartialPage: boolean = false;
  vShowFullPage: boolean = false;

  inputMaskType = {
    currency: MaskedInputType.Currency
  };

  //triggered when radio button URL Option clicked
  requestForm: FormGroup;
  userModel: requestForm;
  loading = false;
  data = []
  getAmount = []
  allowCreate = false;
  allowEdit = false;
  id;
  amountValue;
  vaname;
  vanumber;

  constructor(
    private authService: AuthService,
    private cashoutMasterService: CashoutMasterService,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    this.amountValue = 0

    this.requestForm = new FormGroup({
      jenisvamaster: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      checkedbutton: new FormControl('', [Validators.required]),
    })

    this.inputMaskType = {
      currency: MaskedInputType.Currency
    };

    console.log('RequestWithdrawalListComponent | ngOnInit');
    this.loading = true;
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.requestwithdrawal)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
      this.getDataSpinner();
      this.loading = false;
    } else {
      this.authService.blockOpenPage()
    }

    this.handleTypeChange();
  }

  changeAmount(event) {
    this.id = event.value.id;
    this.vaname = event.value.va_name;
    this.vanumber = event.value.va_number;
    this.amountValue = event.value.balance
  }

  get amount() {
    return this.requestForm.get('amount');
  }

  get jenisvamaster() {
    return this.requestForm.get('jenisvamaster');
  }

  get checkedbutton() {
    return this.requestForm.get('checkedbutton');
  }

  handleTypeChange() {
    console.log('WithdrawalPartial | showPartialAmount');
    this.checkedbutton.valueChanges.pipe(startWith(null), pairwise()).subscribe((
      [prev, next]) => {
      if (prev === false) {
        this.requestForm.patchValue({ amount: 0 })
      } else if (next === false) {
        this.requestForm.patchValue({ amount: parseInt(this.amountValue) })
      }
    })
  }


  //get loading status for button submit
  isLoading() {
    console.log('RequestWithdrawalListComponent | isLoading');
    return this.cashoutMasterService.isLoading();
  }

  //when button submit clicked
  submitRequestWithdrawal(list) {
    console.log('RequestSubmitModalComponent | submitRequestWithdrawal');
    // this.cashoutMasterService.buttonSubmit();
    if (this.allowEdit) {
      const modalRef = this.modal.open(RequestSubmitModalComponent, {
        width: '80%',
        minWidth: '260px',
        maxWidth: '400px',
        data: {
          id: this.id,
          vaname: this.vaname,
          vanumber: this.vanumber,
          amount: this.requestForm.value.amount
        }
      });
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.requestForm.patchValue({
            amount: 0,
            jenisvamaster: ''
          });
          this.amountValue = 0
        }
      });
    } else {
      this.cashoutMasterService.blockPageAction()
    }
  }


  getDataSpinner() {
    this.cashoutMasterService.getListVaMaster().subscribe(
      (response: any) => {
        try {
          console.table(response);
          this.data = response.data
        }
        catch (e) {
          console.table(e)
        }
      }
    )
  }
}
