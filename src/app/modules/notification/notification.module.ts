import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationListComponent } from './pages/notification-list/notification-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationDetailsComponent } from './pages/notification-details/notification-details.component';
import { NotifConfirmModalComponent } from './components/notif-confirm-modal/notif-confirm-modal.component';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [
    NotificationListComponent, 
    NotificationDetailsComponent, NotifConfirmModalComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule
  ],
  entryComponents: [
    NotifConfirmModalComponent
  ],
  providers: [
    NotificationService
  ]
})
export class NotificationModule { }
