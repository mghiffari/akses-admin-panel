import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransReportListComponent } from './pages/trans-report-list/trans-report-list.component';

const routes: Routes = [
  {
    path: 'transaction-report',
    component: TransReportListComponent,
    data: {
      title: 'Transaction Report'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
