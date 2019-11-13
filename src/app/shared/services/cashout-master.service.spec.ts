import { TestBed } from '@angular/core/testing';

import { CashoutMasterService } from './cashout-master.service';

describe('CashoutMasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashoutMasterService = TestBed.get(CashoutMasterService);
    expect(service).toBeTruthy();
  });
});