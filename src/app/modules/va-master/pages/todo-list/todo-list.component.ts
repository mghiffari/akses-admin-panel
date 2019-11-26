import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { constants } from 'src/app/shared/common/constants';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';
import { CashoutDetailsModalComponent } from '../../components/cashout-details-modal/cashout-details-modal.component';
import { ToDoList } from '../../models/todolist';

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"]
})
export class ToDoListComponent implements OnInit {
  paginatorProps = { ...constants.paginatorProps };

  todoListColumns: string[] = [
    "number",
    "jenisva",
    "tanggalpengajuan",
    "amount",
    "initiator",
    "actions"
  ];
  locale = "id";
  loading = false;
  toDoList: ToDoList[] = [];
  allowCreate = false;
  allowEdit = false;
  search = "";
  isFocusedInput = false;

  private table: any;
  @ViewChild("todolistTable") set tabl(table: ElementRef) {
    this.table = table;
  }

  private searchInput: ElementRef;
  @ViewChild("searchInput") set searcInput(searchInput: ElementRef) {
    this.searchInput = searchInput;
  }

  constructor(
    private cashOutMasterService: CashoutMasterService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private modal: MatDialog
  ) {}

  ngOnInit() {
    console.log("ToDoListComponent | ngOnInit");
    this.allowCreate = false;
    this.allowEdit = false;
    let prvg = this.authService.getFeaturePrivilege(
      constants.features.approvecashout
    );
    if (this.authService.getFeatureViewPrvg(prvg)) {
      this.allowCreate = this.authService.getFeatureCreatePrvg(prvg);
      this.allowEdit = this.authService.getFeatureEditPrvg(prvg);
      this.lazyLoadData();
    } else {
      this.authService.blockOpenPage();
    }
  }

  onSearch() {
    console.log("ToDoListComponent | onSearch");
    if (this.paginatorProps.pageIndex !== 0) {
      //this will call paginator change
      this.paginatorProps.pageIndex = 0;
    } else {
      this.lazyLoadData();
    }
  }

  onPaginatorChange(e) {
    console.log("ToDoListComponent | onPaginatorChange");
    this.paginatorProps = Object.assign(this.paginatorProps, e);
    this.lazyLoadData();
  }

  onReject(list) {
    console.log("ToDoListComponent | onReject");
    if (this.allowEdit) {
      const modalRef = this.modal.open(CashoutDetailsModalComponent, {
        width: "80%",
        minWidth: "260px",
        maxWidth: "400px",
        data: {
          isCreate: false,
          listData: { ...list }
        }
      });
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.lazyLoadData();
        }
      });
    } else {
      this.authService.blockPageAction();
    }
  }

  onApprove(list) {
    console.log("ToDoListComponent | onApprove");
    if (this.allowEdit) {
      const modalRef = this.modal.open(CashoutDetailsModalComponent, {
        width: "80%",
        minWidth: "260px",
        maxWidth: "400px",
        data: {
          isCreate: true,
          listData: { ...list }
        }
      });
      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.lazyLoadData();
        }
      });
    } else {
      this.authService.blockPageAction();
    }
  }

  lazyLoadData() {
    console.log("ToDoListComponent | lazyLoadData");
    let isFocusedInput = this.isFocusedInput;
    this.loading = true;
    this.cashOutMasterService
      .getToDoList(
        this.paginatorProps.pageIndex + 1,
        this.paginatorProps.pageSize,
        this.search
      )
      .subscribe(
        (response: any) => {
          try {
            console.table(response);
            this.toDoList = response.data.rows;
            this.paginatorProps.length = response.data.totalData;
          } catch (error) {
            console.table(error);
            this.toDoList = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
          }
        },
        error => {
          try {
            console.table(error);
            this.toDoList = [];
            this.paginatorProps.length = 0;
            this.paginatorProps.pageIndex = 0;
            this.authService.handleApiError("toDoListScreen.loadFailed", error);
          } catch (error) {
            console.log(error);
          }
        }
      )
      .add(() => {
        this.loading = false;
        if (this.table) {
          this.table.renderRows();
        }
        if (this.searchInput && isFocusedInput) {
          setTimeout(() => {
            this.searchInput.nativeElement.focus();
          });
        }
      });
  }
}
