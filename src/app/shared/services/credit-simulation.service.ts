import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreditSimulationService {
  creditSimulationApiUrl = environment.apiurl + 'creditsimulation/';
  productApiUrl = this.creditSimulationApiUrl + 'products/';
  componentApiUrl = this.creditSimulationApiUrl + 'components/';

  constructor(
    private authService: AuthService
  ) { }

  // get list of credit simulation products
  getProductList(){
    console.log('CreditSimulationService | getProductList ', this.productApiUrl)
    return this.authService.wrapTokenGetApi(this.productApiUrl);
  }

  // get credit simulation product by id
  getProductById(id){
    const url = this.productApiUrl + id;
    console.log('CreditSimulationService | getProductById ', url)
    return this.authService.wrapTokenGetApi(url);
  }

  // get list of components by product id
  getProductComponents(productId){
    const url = this.componentApiUrl + productId;
    console.log('CreditSimulationService | getProductComponents ', url)
    return this.authService.wrapTokenGetApi(url);
  }

  // get credit simulation based on product id and component id
  getProdCompCS(productId, compId){
    const url = this.creditSimulationApiUrl + productId + '/' + compId;
    console.log('CreditSimulationService | getProdCompCS ', url)
    return this.authService.wrapTokenGetApi(url);
  }

  // update credit simulation 
  updateProdCompCS(data: Array<any>){
    console.log('CreditSimulationService | updateProdCompCS ', this.creditSimulationApiUrl)
    return this.authService.wrapTokenPutApi(this.creditSimulationApiUrl, data);
  }
}
