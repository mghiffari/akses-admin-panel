import { TestBed } from '@angular/core/testing';

import { ChangePhonenumberRequestService } from './change-phonenumber-request.service';

describe('ChangePhonenumberRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangePhonenumberRequestService = TestBed.get(ChangePhonenumberRequestService);
    expect(service).toBeTruthy();
  });
});
