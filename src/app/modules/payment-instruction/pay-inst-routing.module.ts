import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PIListComponent } from './pages/pi-list/pi-list.component';

const routes: Routes = [
  {
    path: '',
    component: PIListComponent,
    data: {
      title: 'Payment Instructions'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayInstRoutingModule { }
