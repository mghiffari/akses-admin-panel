import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationListComponent } from './pages/notification-list/notification-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationDetailsComponent } from './pages/notification-details/notification-details.component';

@NgModule({
  declarations: [
    NotificationListComponent, 
    NotificationDetailsComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule
  ]
})
export class NotificationModule { }
