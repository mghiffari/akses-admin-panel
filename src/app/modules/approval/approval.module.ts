import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalListComponent } from './pages/approval-list/approval-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpecialOfferComponent } from './pages/special-offer/special-offer.component';

@NgModule({
  declarations: [ApprovalListComponent, SpecialOfferComponent],
  imports: [
    CommonModule,
    ApprovalRoutingModule,
    SharedModule
  ]
})
export class ApprovalModule { }
