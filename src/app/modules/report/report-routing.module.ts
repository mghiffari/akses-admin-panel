import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransReportComponent } from './pages/trans-report/trans-report.component';
import { BalanceReportComponent } from './pages/balance-report/balance-report.component';

const routes: Routes = [
  {
    path: 'transaction-report',
    component: TransReportComponent,
    data: {
      title: 'Laporan Transaksi'
    }
  },
  {
    path: 'balance-report',
    component: BalanceReportComponent,
    data: {
      title: 'Laporan Balance'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
