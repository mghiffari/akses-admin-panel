import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToDoListForm } from '../../models/todolist-form';
import { constants } from 'src/app/shared/common/constants';
import { CashoutMasterService } from 'src/app/shared/services/cashout-master.service';
import { SuccessSnackbarComponent } from 'src/app/shared/components/success-snackbar/success-snackbar.component';

@Component({
  selector: "app-cashout-details-modal",
  templateUrl: "./cashout-details-modal.component.html",
  styleUrls: ["./cashout-details-modal.component.scss"]
})
export class CashoutDetailsModalComponent implements OnInit {
  onSubmittingForm = false;
  ToDoListForm: FormGroup;
  ToDoListModel: ToDoListForm;
  isCreate;
  id;
  jnsva;
  vanum;
  amount;
  locale = "id";

  get addings() {
    return this.ToDoListForm.get("addings");
  }

  // constructor
  constructor(
    public dialogRef: MatDialogRef<CashoutDetailsModalComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private cashOutMasterService: CashoutMasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("CashoutDetailsModalComponent | constructor");
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log("CashoutDetailsModalComponent | ngOnInit");
    let prvg = this.authService.getFeaturePrivilege(
      constants.features.approvecashout
    );
    if (this.authService.getFeatureViewPrvg(prvg)) {
      let dataSend = this.data;
      this.isCreate = dataSend.isCreate;
      this.id = dataSend.listData.id;
      this.jnsva = dataSend.listData.vamaster_name;
      this.vanum = dataSend.listData.vamaster_number;
      this.amount = dataSend.listData.will_cashout;
      this.ToDoListForm = new FormGroup({
        addings: new FormControl("")
      });
    } else {
      this.authService.blockOpenPage();
    }
  }

  save() {
    console.log("CashoutDetailsModalComponent | save");
    this.onSubmittingForm = true;
    this.ToDoListModel = {
      id: this.id,
      desc: this.ToDoListForm.value.addings
    };
    if (this.isCreate == true) {
      this.cashOutMasterService.approveRequest(this.ToDoListModel).subscribe(
        (data: any) => {
          this.handleUpdateCreateSuccess("toDoListScreen.succesApprove", data);
        },
        error => {
          this.handleApiError("toDoListScreen.failedApprove", error);
        }
      );
    } else {
      this.cashOutMasterService.rejectRequest(this.ToDoListModel).subscribe(
        (data: any) => {
          this.handleUpdateCreateSuccess("toDoListScreen.succesReject", data);
        },
        error => {
          this.handleApiError("toDoListScreen.failedReject", error);
        }
      );
    }
  }

  handleUpdateCreateSuccess(successTitle, response) {
    console.log("CashoutDetailsModalComponent | handleUpdateCreateSuccess");
    try {
      console.table(response);
      this.onSubmittingForm = false;
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: {
          title: "success",
          content: {
            text: successTitle,
            data: null
          }
        }
      });
      this.dialogRef.close(true);
    } catch (error) {
      console.log(error);
    }
  }

  handleApiError(errorTitle, apiError) {
    console.log("CashoutDetailsModalComponent | handleApiError");
    console.table(apiError);
    this.onSubmittingForm = false;
    this.authService.handleApiError(errorTitle, apiError);
  }
}
  