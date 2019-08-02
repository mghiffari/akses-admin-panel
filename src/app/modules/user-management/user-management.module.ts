import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailsModalComponent } from './components/user-details-modal/user-details-modal.component';
import { UserGroupDetailsComponent } from './pages/group-details/user-group-details.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailsModalComponent,
    UserGroupDetailsComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ],
  entryComponents: [
    UserDetailsModalComponent
  ]
})
export class UserManagementModule { }
