import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-notif-confirm-modal',
  templateUrl: './notif-confirm-modal.component.html',
  styleUrls: []
})
export class NotifConfirmModalComponent implements OnInit {
  notificationLinkType = constants.notificationLinkType;
  constructor(public dialogRef: MatDialogRef<NotifConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
