import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleListComponent } from './pages/rule-list/rule-list.component';
import { RuleDetailsComponent } from './pages/rule-details/rule-details.component';

const routes: Routes = [
  {
    path: 'rule',
    component: RuleListComponent,
    data: {
      title: 'Gamification Rule'
    }
  },
  {
    path: 'rule/create',
    component: RuleDetailsComponent,
    data: {
      title: 'Gamification Rule'
    }
  },
  {
    path: 'rule/update',
    component: RuleDetailsComponent,
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
