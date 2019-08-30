import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalListComponent } from './pages/approval-list/approval-list.component';
import { SpecialOfferComponent } from './pages/special-offer/special-offer.component';

const routes: Routes = [
  { 
    path: '',
    component: ApprovalListComponent,
    data: {
      title: 'Approval'
    }
  }, 
  {
    path: 'special-offers/:id',
    component: SpecialOfferComponent,
    data: {
      title: 'Special Offer'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
