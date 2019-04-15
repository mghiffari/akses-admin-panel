import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSProductComponent } from './pages/cs-product/cs-product';
import { CSRoutingModule } from './cs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CSProductComponent],
  imports: [
    CommonModule,
    CSRoutingModule,
    SharedModule
  ]
})
export class CSModule { }
