import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayInstRoutingModule } from './pay-inst-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PIListComponent } from './pages/pi-list/pi-list.component';

@NgModule({
  declarations: [PIListComponent],
  imports: [
    CommonModule,
    PayInstRoutingModule,
    SharedModule
  ]
})
export class PayInstModule { }
