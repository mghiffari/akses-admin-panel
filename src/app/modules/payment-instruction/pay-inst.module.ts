import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayInstRoutingModule } from './pay-inst-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PIListComponent } from './pages/pi-list/pi-list.component';
import { PIDetailsComponent } from './pages/pi-details/pi-details.component';
import { PayInstService } from './services/pay-inst.service';

@NgModule({
  declarations: [PIListComponent, PIDetailsComponent],
  imports: [
    CommonModule,
    PayInstRoutingModule,
    SharedModule
  ],
  providers: [
    PayInstService
  ]
})
export class PayInstModule { }
