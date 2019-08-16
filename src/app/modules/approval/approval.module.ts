import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalListComponent } from './pages/approval-list/approval-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ApprovalListComponent],
  imports: [
    CommonModule,
    ApprovalRoutingModule,
    SharedModule
  ]
})
export class ApprovalModule { }
