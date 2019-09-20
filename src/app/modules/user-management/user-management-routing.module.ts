import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { CanDeactivateGuard } from 'src/app/_guard/can-deactivate.guard';

const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent,
    data: {
      title: 'Users'
    }
  },
  {
    path: 'roles',
    component: RoleListComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      title: 'Roles'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }