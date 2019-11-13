import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TrackYourRequest} from '../../models/track-your-request';
import {constants} from '../../../../shared/common/constants';

@Component({
  selector: 'app-track-your-request',
  templateUrl: './track-your-request.component.html',
  styleUrls: []
})

export class TrackYourRequestListComponent implements OnInit{

  loading = false;
  paginatorProps = { ...constants.paginatorProps};

  trackYourRequest: TrackYourRequest[] = [];

  isFocusedSearch = false;

  tycColumns: string[] = [
    'number',
    'title',
    'banner',
    'startDate',
    'endDate',
    'status',
    'order',
    'action',
  ]

  // event handling paginator value changed (page index and page size)


  private table: any;
  @ViewChild('trackYourRequestTable') set tabl(table: ElementRef) {
    this.table = table;
  }



  ngOnInit() {
  }

  onPaginatorChange(e) {
    console.log('SpecialOfferListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {
  }

}
