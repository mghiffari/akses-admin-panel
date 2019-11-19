import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VAMasterRoutingModule} from './va-master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestWithdrawalListComponent} from './pages/request-withdrawal/request-withdrawal.component';
import { TrackYourRequestListComponent} from './pages/track-your-request/track-your-request.component';
import { ToDoListComponent} from './pages/todo-list/todo-list.component';
import { TrackYourReport} from './pages/track-your-report/track-your-report.component';
import { CashoutDetailsModalComponent } from './components/cashout-details-modal/cashout-details-modal.component';
import { ReportDetailsModalComponent } from './components/report-details-modal/report-details-modal.component';

@NgModule({
  declarations: [
    RequestWithdrawalListComponent,
    TrackYourRequestListComponent,
    ToDoListComponent,
    TrackYourReport,
    CashoutDetailsModalComponent,
    ReportDetailsModalComponent
  ],
  imports: [
    CommonModule,
    VAMasterRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CashoutDetailsModalComponent,
    ReportDetailsModalComponent
  ]
})
export class VAMasterModule { }
