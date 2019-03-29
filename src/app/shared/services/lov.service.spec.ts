import { TestBed } from '@angular/core/testing';

import { LovService } from './lov.service';

describe('LovService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LovService = TestBed.get(LovService);
    expect(service).toBeTruthy();
  });
});
