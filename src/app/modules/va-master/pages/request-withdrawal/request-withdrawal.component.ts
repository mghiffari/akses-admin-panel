import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-request-withdrawal',
  templateUrl: './request-withdrawal.component.html',
  styleUrls: []
})

export class RequestWithdrawalListComponent implements OnInit{

  ngOnInit() {
  }

}
