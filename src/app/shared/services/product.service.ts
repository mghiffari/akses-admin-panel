// This file is to encrypt and decrypt the values in the session storage
import { Injectable } from '@angular/core';

import * as Crypto from 'crypto-js';
import { constants } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // Method to encrypt a string
  setProduct(product: string): string {
    try {
      let value = this.getCommonProduct();
      let productId = Crypto.AES.encrypt(product, value);
      productId = productId + value;
      return productId;
    } catch (error) {
      console.error(error);
    }
  };

  // Method to decrypt a string
  getProduct(product: string): string {
    try {
      if(product) {
        let value = product.substring(product.length - constants.productScreen.productName.length);
        let result = Crypto.AES.decrypt(product.substring(0, product.length - constants.productScreen.productName.length), value);
        return result.toString(Crypto.enc.Utf8);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Method to generate a key
  private getCommonProduct() {
    let value = '';
    let possible = constants.productScreen.productName;
    for (let i = 0; i < constants.productScreen.productName.length; i++) {
      value += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return value.toString();
  };
}
