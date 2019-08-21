import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamificationRoutingModule } from './gamification-routing.module';
import { RuleListComponent } from './pages/rule-list/rule-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RuleDetailsComponent } from './pages/rule-details/rule-details.component';
import { CashbackRewardComponent } from './pages/cashback-reward/cashback-reward.component';

@NgModule({
  declarations: [RuleListComponent, RuleDetailsComponent, CashbackRewardComponent],
  imports: [
    CommonModule,
    GamificationRoutingModule,
    SharedModule
  ]
})
export class GamificationModule { }
