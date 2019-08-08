import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullLayoutComponent } from './containers/full-layout/full-layout.component';
import { AuthGuard } from './_guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    canActivateChild: [AuthGuard],
    data: {
      title: 'Contents'
    },
    children: [
      {
        path: '',
        loadChildren: './modules/home/home.module#HomeModule',
      },
      {
        path: 'master',
        loadChildren: './modules/master/master.module#MasterModule',
      },
      {
        path: 'account',
        loadChildren: './modules/account/account.module#AccountModule'
      },
      {
        path: 'credit-simulation',
        loadChildren: './modules/credit-simulation/cs.module#CSModule'
      },
      {
        path: 'payment-instructions',
        loadChildren: './modules/payment-instruction/pay-inst.module#PayInstModule'
      },
      {
        path: 'notifications',
        loadChildren: './modules/notification/notification.module#NotificationModule'
      },
      {
        path: 'user-management',
        loadChildren: './modules/user-management/user-management.module#UserManagementModule'
      }
    ]
  },
  {
    path: "login",
    loadChildren: './modules/login/login.module#LoginModule'
  },
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
