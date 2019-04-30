import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PIListComponent } from './pages/pi-list/pi-list.component';
import { PIDetailsComponent } from './pages/pi-details/pi-details.component';
import { CanDeactivateGuard } from 'src/app/_guard/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: PIListComponent,
    data: {
      title: 'Payment Instructions'
    }
  },
  {
    path: 'create/:paymentType',
    component: PIDetailsComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      title: 'Create Payment Instruction'
    }
  },
  {
    path: 'update/:id',
    component: PIDetailsComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      title: 'Update Payment Instruction'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayInstRoutingModule { }
