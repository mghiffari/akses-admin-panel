import { TestBed } from '@angular/core/testing';

import { PayInstService } from './pay-inst.service';

describe('PayInstService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayInstService = TestBed.get(PayInstService);
    expect(service).toBeTruthy();
  });
});
