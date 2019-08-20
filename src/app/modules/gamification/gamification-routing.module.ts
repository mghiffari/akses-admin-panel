import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleListComponent } from './pages/rule-list/rule-list.component';

const routes: Routes = [
  {
    path: 'rule',
    component: RuleListComponent,
    data: {
      title: 'Gamification Rule'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamificationRoutingModule { }
