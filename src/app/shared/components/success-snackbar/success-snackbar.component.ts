import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-success-snackbar',
  templateUrl: './success-snackbar.component.html',
  styleUrls: ['./success-snackbar.component.scss']
})
export class SuccessSnackbarComponent implements OnInit {

  constructor(
    public snackbarRef: MatSnackBarRef<SuccessSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

  onClose(){
    this.snackbarRef.dismiss();
  }

}
