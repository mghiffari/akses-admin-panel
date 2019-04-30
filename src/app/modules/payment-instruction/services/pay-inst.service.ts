import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayInstService {
  listApiUrl = environment.apiurl + 'paymentinstruction/list/';
  swapOrderListApiUrl = this.listApiUrl + 'swap-order/';

  constructor(
    private authService: AuthService
  ) { }

  // get list by payment type
  getListByType(type){
    console.log('PayInstService | getListByType')
    let url = this.listApiUrl + encodeURIComponent(type);
    return this.authService.wrapTokenGetApi(url)
  }

  // swap list order 
  swapListOrder(data){
    console.log('PayInstService | swapListOrder')
    return this.authService.wrapTokenPatchApi(this.swapOrderListApiUrl, data);
  }

  updateList(data){
    console.log('PayInstService | updateList')
    return this.authService.wrapTokenPutApi(this.listApiUrl, data);
  }
}
