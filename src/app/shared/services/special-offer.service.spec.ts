import { TestBed } from '@angular/core/testing';

import { SpecialOfferService } from './special-offer.service';

describe('SpecialOfferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecialOfferService = TestBed.get(SpecialOfferService);
    expect(service).toBeTruthy();
  });
});
