import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';

import { TransReportComponent } from './pages/trans-report/trans-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BalanceReportComponent } from './pages/balance-report/balance-report.component';

@NgModule({
  declarations: [
    TransReportComponent,
    BalanceReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ],
})
export class ReportModule { }
