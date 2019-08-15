import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailsModalComponent } from './components/user-details-modal/user-details-modal.component';
import { RoleListComponent } from './pages/role-list/role-list.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailsModalComponent,
    RoleListComponent
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
