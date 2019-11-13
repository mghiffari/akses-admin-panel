import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VAMasterRoutingModule} from './va-master-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestWithdrawalListComponent} from './pages/request-withdrawal/request-withdrawal.component';
import { TrackYourRequestListComponent} from './pages/track-your-request/track-your-request.component';
import { ToDoListComponent} from './pages/todo-list/todo-list.component';

@NgModule({
  declarations: [
    RequestWithdrawalListComponent,
    TrackYourRequestListComponent,
    ToDoListComponent
  ],
  imports: [
    CommonModule,
    VAMasterRoutingModule,
    SharedModule
  ]
})
export class VAMasterModule { }
