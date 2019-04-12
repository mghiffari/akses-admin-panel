import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditSimulationProductComponent } from './pages/credit-simulation-product/credit-simulation-product';

const routes: Routes = [
  { 
    path: 'product/:product-id',
    component: CreditSimulationProductComponent,
    data: {
      title: 'Credit Simulation'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditSimulationRoutingModule { }
