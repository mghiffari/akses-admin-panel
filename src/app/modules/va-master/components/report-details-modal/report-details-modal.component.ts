import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { constants } from 'src/app/shared/common/constants';
import { ToDoListForm } from '../../models/todolist-form';
import { DISABLED } from '@angular/forms/src/model';
import { disableBindings } from '@angular/core/src/render3';

@Component({
    selector: 'app-report-details-modal',
    templateUrl: './report-details-modal.component.html',
    styleUrls: ['./report-details-modal.component.scss']
})
export class ReportDetailsModalComponent implements OnInit {
  ToDoListForm: FormGroup;

  // constructor
  constructor(public dialogRef: MatDialogRef<ReportDetailsModalComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("ReportDetailsModalComponent | constructor")
    dialogRef.disableClose = true;
  }

  get desc() {
    return this.ToDoListForm.get('desc');
  }

  ngOnInit()
  {
    console.log("ReportDetailsModalComponent | ngOnInit")
    let prvg = this.authService.getFeaturePrivilege(constants.features.approvecashout)
    if(this.authService.getFeatureViewPrvg(prvg)){
      let dataSend = this.data;
      this.ToDoListForm = new FormGroup({
        desc: new FormControl({
          value: dataSend.listData.description,
          disabled: true
        })
      });
    } else {
      this.authService.blockOpenPage()
    }
  }

  ok()
  {
    console.log('ReportDetailsModalComponent | handleUpdateOK')
    this.dialogRef.close(true);
  }
}