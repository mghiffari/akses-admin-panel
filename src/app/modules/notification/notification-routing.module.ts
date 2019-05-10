import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationListComponent } from './pages/notification-list/notification-list.component';
import { NotificationDetailsComponent } from './pages/notification-details/notification-details.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationListComponent,
    data: {
      title: 'Notifications'
    }
  },
  {  
    path: 'create',
    component: NotificationDetailsComponent,
    data: {
      title: 'Create Notification'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
