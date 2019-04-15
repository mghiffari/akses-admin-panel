import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CSProductComponent } from './pages/cs-product/cs-product';

const routes: Routes = [
  { 
    path: 'product/:productId',
    component: CSProductComponent,
    data: {
      title: 'Credit Simulation'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CSRoutingModule { }
