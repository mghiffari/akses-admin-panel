import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-warning-snackbar',
  templateUrl: './warning-snackbar.component.html',
  styleUrls: ['./warning-snackbar.component.scss']
})
export class WarningSnackbarComponent implements OnInit {

  constructor(
    public snackbarRef: MatSnackBarRef<WarningSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

  onClose(){
    this.snackbarRef.dismiss();
  }

}
