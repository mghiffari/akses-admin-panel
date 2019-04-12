import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditSimulationRoutingModule } from './credit-simulation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditSimulationProductComponent } from './pages/credit-simulation-product/credit-simulation-product';

@NgModule({
  declarations: [CreditSimulationProductComponent],
  imports: [
    CommonModule,
    CreditSimulationRoutingModule,
    SharedModule
  ]
})
export class CreditSimulationModule { }
