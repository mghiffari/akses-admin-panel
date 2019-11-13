import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { constants } from 'src/app/shared/common/constants';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: []
})

export class ToDoListComponent implements OnInit{
  paginatorProps = { ...constants.paginatorProps };

  todoListColumns: string[] = [
    'number',
    'jenisva',
    'tanggalpengajuan',
    'amount',
    'initiator',
    'actions'
  ]
  loading = false;
  toDoList = [];
  allowCreate = false;
  allowEdit = false;

  private table: any;
  @ViewChild('todolistTable') set tabl(table: ElementRef) {
    this.table = table;
  }

  constructor(
    private cashOutMasterService: CashoutMasterService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('ToDoListComponent | ngOnInit');
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(constants.features.approvecashout)
    if(this.authService.getFeatureViewPrvg(prvg)){
      this.lazyLoadData()
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg)
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg)
    } else {
      this.authService.blockOpenPage()
    }
  }

  onPaginatorChange(e) {
    console.log('ToDoListComponent | onPaginatorChange');
    this.paginatorProps = Object.assign(this.paginatorProps, e)
    this.lazyLoadData()
  }

  lazyLoadData() {
    console.log('ToDoListComponent | lazyLoadData');
    this.loading = true;
    this.cashOutMasterService.getToDoList(
      this.paginatorProps.pageIndex + 1,
      this.paginatorProps.pageSize).subscribe(
        (response: any) => {
          try {
            console.table(response);
            this.toDoList = response.data.rows;
            this.paginatorProps.length = response.data.totalPage;
          } catch (error) {
            console.table(error);
            this.toDoList = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0
          }
        },
        error => {
          try {
            console.table(error);
            this.toDoList = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
            this.authService.handleApiError('toDoListScreen.loadFailed', error);
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
