import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaintenanceModeListComponent } from "./pages/maintenance-list/maintenance-list";
import { MaintenanceRoutingModule } from "./maintenance-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [MaintenanceModeListComponent],
  imports: [CommonModule, MaintenanceRoutingModule, SharedModule]
})
export class MaintenanceModule {}
