import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VAMasterRoutingModule} from './va-master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestWithdrawalListComponent} from './pages/request-withdrawal/request-withdrawal.component';
import { TrackYourRequestListComponent} from './pages/track-your-request/track-your-request.component';
import { ToDoListComponent} from './pages/todo-list/todo-list.component';
import { CashoutDetailsModalComponent } from './components/cashout-details-modal/cashout-details-modal.component';

@NgModule({
  declarations: [
    RequestWithdrawalListComponent,
    TrackYourRequestListComponent,
    ToDoListComponent,
    CashoutDetailsModalComponent
  ],
  imports: [
    CommonModule,
    VAMasterRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CashoutDetailsModalComponent
  ]
})
export class VAMasterModule { }
