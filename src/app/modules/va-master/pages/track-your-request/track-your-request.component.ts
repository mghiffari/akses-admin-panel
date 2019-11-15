import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TrackYourRequest } from '../../models/track-your-request';
import { constants } from '../../../../shared/common/constants';
import { CashoutMasterService } from '../../../../shared/services/cashout-master.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-track-your-request',
  templateUrl: './track-your-request.component.html',
  styleUrls: []
})

export class TrackYourRequestListComponent implements OnInit {

  allowCreate = false;
  allowEdit = false;
  loading = false;
  paginatorProps = { ...constants.paginatorProps };
  typeApproval = constants.approvalStatus;
  trackYourRequest: TrackYourRequest[] = [];
  tyc = [];


  isFocusedSearch = false;

  tycColumns: string[] = [
    'number',
    'jenisva',
    'tanggalpengajuan',
    'amount',
    'status'
  ]

  // event handling paginator value changed (page index and page size)
  private table: any;
  @ViewChild('tycTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private cashOutMasterService: CashoutMasterService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('TrackYourRequestComponent | ngOnInit');
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.approvecashout)
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.lazyLoadData()
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  onPaginatorChange(e) {
    console.log('TrackYourRequestComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  // call api to get data based on table page, page size, and search keyword
  lazyLoadData() {

    console.log('TrackYourRequestComponent | lazyLoadData');
    this.loading = true;
    this.cashOutMasterService.getTrackRequest(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize).subscribe(
        (response: any) => {
          try {
            console.table(response);
            this.tyc = response.data.rows;
            this.paginatorProps.length = response.data.totalPage;
          } catch (error) {
            console.table(error);
            this.tyc = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0
          }
        },
        error => {
          try {
            console.table(error);
            this.tyc = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
            this.authService.handleApiError('tycScreen.loadFailed', error);
          } catch (error) {
            console.log(error)
          }
        }
      ).add(
        () => {
          if (this.table) {
            this.table.renderRows();
          }
          this.loading = false;
        }
      )
  }

}
