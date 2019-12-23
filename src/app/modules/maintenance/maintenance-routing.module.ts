import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintenanceModeListComponent } from './pages/maintenance-list/maintenance-list';
import { CanDeactivateGuard } from 'src/app/_guard/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceModeListComponent,
    data: {
      title: 'Maintenance Mode'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {}
