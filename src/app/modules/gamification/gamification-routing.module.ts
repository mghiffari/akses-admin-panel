import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleListComponent } from './pages/rule-list/rule-list.component';
import { CashbackRewardComponent } from './pages/cashback-reward/cashback-reward.component';

const routes: Routes = [
  {
    path: 'rule',
    component: RuleListComponent,
    data: {
      title: 'Gamification Rule'
    }
  },
  {
    path: 'cashback-reward',
    component: CashbackRewardComponent,
    data: {
      title: 'Cashback Reward'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamificationRoutingModule { }
