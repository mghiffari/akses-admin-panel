import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';

import { TransReportListComponent } from './pages/trans-report-list/trans-report-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TransReportListComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ],
  entryComponents: [
    TransReportListComponent
  ]
})
export class ReportModule { }
