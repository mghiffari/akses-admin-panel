import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayInstService {
  paymentInstructionApiUrl = environment.apiurl + 'paymentinstruction'
  listApiUrl = this.paymentInstructionApiUrl + '/list';
  detailApiUrl = this.paymentInstructionApiUrl + '/detail';
  swapOrderListApiUrl = this.listApiUrl + '/swap-order';
  listByIdApiUrl = this.listApiUrl + '/id';

  constructor(
    private authService: AuthService
  ) { }

  // get list by payment type
  getListByType(type){
    console.log('PayInstService | getListByType')
    let url = this.listApiUrl + '/' + encodeURIComponent(type);
    return this.authService.wrapTokenGetApi(url)
  }

  // swap list order 
  swapListOrder(data){
    console.log('PayInstService | swapListOrder')
    // return this.authService.wrapTokenPatchApi(this.swapOrderListApiUrl, data);
    return this.authService.wrapTokenPutApi(this.swapOrderListApiUrl, data);
  }

  // update list
  updateList(data){
    console.log('PayInstService | updateList')
    return this.authService.wrapTokenPutApi(this.listApiUrl, data);
  }

  // create list
  createList(data){
    console.log('PayInstService | createList')
    return this.authService.wrapTokenPostApi(this.listApiUrl, data)
  }

  // create list 
  createListDetails(data: any[]){
    console.log('PayInstService | createListDetails')
    return this.authService.wrapTokenPostApi(this.detailApiUrl, data)
  }

  // get list by id
  getListById(id){
    let url = this.listByIdApiUrl + '/' + id;
    console.log('PayInstService | getListById ', url)
    return this.authService.wrapTokenGetApi(url)
  }

  // get instruction list(steps)
  getListDetails(listId){
    let url = this.detailApiUrl + '/' + listId;
    console.log('PayInstService | getListDetails ', url)
    return this.authService.wrapTokenGetApi(url)
  }

  updatePaymentInstructions(data){
    console.log('PayInstService | updatePaymentInstructions ')
    return this.authService.wrapTokenPutApi(this.paymentInstructionApiUrl, data)
  }
}
