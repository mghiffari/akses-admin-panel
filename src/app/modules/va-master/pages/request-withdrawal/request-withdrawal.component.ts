import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-request-withdrawal',
  templateUrl: './request-withdrawal.component.html',
  styleUrls: []
})

export class RequestWithdrawalListComponent implements OnInit{

  vClickableChecked: boolean = false;

  //show detail page
  vShowPartialPage: boolean = false;

  vShowFullPage: boolean = false;

  //triggered when radio button URL Option clicked
  showPartialPage() {
    console.log('WithdrawalPartial | showPartialPage');
  }

  showFullPage() {

  }


  // onSubmittingForm = false;
  // offerForm: FormGroup;
  //



  ngOnInit() {
  }

  // showDetailPage() {
  //   console.log('BannerDetailComponent | showDetailPage');
  //   this.vShowDetailPage = true;
  //   this.vShowURL = false;
  //   this.vShowModul = false;
  //   this.vShowExternalURL = false;
  //   this._bannerDetailService.getCreateBannerData().clickable_is_detail = true;
  //   this._bannerDetailService.resetClickable(true, null,"");
  // }



}
