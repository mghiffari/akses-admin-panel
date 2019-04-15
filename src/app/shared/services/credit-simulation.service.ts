import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreditSimulationService {
  creditSimulationApiUrl = environment.apiurl + 'creditsimulation/';
  productApiUrl = this.creditSimulationApiUrl + 'products/';

  constructor(
    private authService: AuthService
  ) { }

  // get list of credit simulation products
  getProductList(){
    console.log('CreditSimulationService | getProductList ', this.productApiUrl)
    return this.authService.wrapTokenGetApi(this.productApiUrl);
  }
}
