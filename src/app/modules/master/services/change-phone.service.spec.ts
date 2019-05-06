import { TestBed } from '@angular/core/testing';

import { ChangePhoneService } from './change-phone.service';

describe('ChangePhoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangePhoneService = TestBed.get(ChangePhoneService);
    expect(service).toBeTruthy();
  });
});
