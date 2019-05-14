import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-notif-confirm-modal',
  templateUrl: './notif-confirm-modal.component.html',
  styleUrls: []
})
export class NotifConfirmModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotifConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
