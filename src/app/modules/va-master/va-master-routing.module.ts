import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/_guard/can-deactivate.guard';
import { RequestWithdrawalListComponent} from './pages/request-withdrawal/request-withdrawal.component';
import { TrackYourRequestListComponent} from './pages/track-your-request/track-your-request.component';
import { ToDoListComponent} from './pages/todo-list/todo-list.component';

const routes: Routes = [
  {
    path: 'requestWithdrawal',
    component: RequestWithdrawalListComponent,
    data: {
      title: 'Request Withdrawal'
    }
  },
  {
    path: 'trackYourRequest',
    component: TrackYourRequestListComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      title: 'Track Your Request'
    }
  },
  {
    path: 'todo-list',
    component: ToDoListComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      title: 'To Do List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VAMasterRoutingModule { }
