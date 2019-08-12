import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';

<<<<<<< HEAD
describe('ProductService', () => {
=======
describe('EncryptionService', () => {
>>>>>>> sprint_10
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductService = TestBed.get(ProductService);
    expect(service).toBeTruthy();
  });
});
