import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CSProductComponent } from "./pages/cs-product/cs-product";
import { CanDeactivateGuard } from "src/app/_guard/can-deactivate.guard";

const routes: Routes = [
  {
    path: "product/:productId",
    component: CSProductComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      title: "Credit Simulation"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CSRoutingModule {}
