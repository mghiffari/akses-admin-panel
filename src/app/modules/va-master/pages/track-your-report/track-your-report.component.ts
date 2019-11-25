import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { constants } from 'src/app/shared/common/constants';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';
import { ReportDetailsModalComponent } from '../../components/report-details-modal/report-details-modal.component';
import { ToDoList } from '../../models/todolist';

@Component({
    selector: 'app-track-you1r-report',
    templateUrl: './track-your-report.component.html',
    styleUrls: ['./track-your-report.component.scss']
})

export class TrackYourReport implements OnInit{
    paginatorProps = { ...constants.paginatorProps };
    typeApproval = constants.approvalStatus;
    loading = false;
    report: ToDoList[] = [];
    allowCreate = false;
    allowEdit = false;
    search = '';
    isFocusedInput = false;
  
    reportColumns: string[] = [
        'number',
        'jenisva',
        'tanggalpengajuan',
        'amount',
        'initiator',
        'approver',
        'status'
    ]
    
    private table: any;
    @ViewChild('reportTable') set tabl(table: ElementRef) {
      this.table = table;
    }
  
    private searchInput: ElementRef;
    @ViewChild('searchInput') set searcInput(searchInput: ElementRef) {
      this.searchInput = searchInput;
    }
  
    constructor(
        private cashOutMasterService: CashoutMasterService,    
        private snackBar: MatSnackBar,
        private router: Router,
        private authService: AuthService,
        private modal: MatDialog
    ) { }
    
    ngOnInit() {
        console.log('TrackYourReport | ngOnInit');
        this.allowCreate = false;
        this.allowEdit = false;
        let prvg = this.authService.getFeaturePrivilege(constants.features.approvecashout)
        if(this.authService.getFeatureViewPrvg(prvg)){
          this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
          this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
          this.lazyLoadData()
        } else {
          this.authService.blockOpenPage()
        }    
    }

    onDetails(list)
    {
      console.log('TrackYourReport | onDetails');
      if (this.allowEdit) {
        const modalRef = this.modal.open(ReportDetailsModalComponent, {
          width: '80%',
          minWidth: '260px',
          maxWidth: '400px',
          data: {
            listData: { ...list }
          }
        });
        modalRef.afterClosed().subscribe(result => {
          if (result) {
            this.lazyLoadData();
          }
        });
      } else {
        this.authService.blockPageAction()
      }
    }

    onSearch() {
        console.log('TrackYourReport | onSearch');
        if (this.paginatorProps.pageIndex !== 0) {
          //this will call paginator change
          this.paginatorProps.pageIndex = 0;
        } else {
          this.lazyLoadData();
        }
    }
    
    onPaginatorChange(e) {
        console.log('TrackYourReport | onPaginatorChange');
        this.paginatorProps = Object.assign(this.paginatorProps, e)
        this.lazyLoadData()
    }

    lazyLoadData()
    {
        console.log('TrackYourReport | lazyLoadData');
        let isFocusedInput = this.isFocusedInput;
        this.loading = true;
        this.cashOutMasterService.getReport(
          this.paginatorProps.pageIndex + 1,
          this.paginatorProps.pageSize,
          this.search).subscribe(
            (response: any) => {
              try {
                console.table(response);
                this.report = response.data.rows;
                this.paginatorProps.length = response.data.totalData;
              } catch (error) {
              console.table(error);
                this.report = [];
                this.paginatorProps.length = 0;
                this.paginatorProps.pageIndex = 0
              }
            },
            error => {
              try {
                console.table(error);
                this.report = [];
                this.paginatorProps.length = 0;
                this.paginatorProps.pageIndex = 0;
                this.authService.handleApiError('TrackYourReportScreen.loadFailed', error);
              } catch (error) {
                console.log(error)
              }
            }
        ).add(
          () => {
            this.loading = false;
            if (this.table) {
              this.table.renderRows();
            }
            if (this.searchInput && isFocusedInput) {
                setTimeout(() => {
                this.searchInput.nativeElement.focus();
              });
            }
          }
        );
    }
}