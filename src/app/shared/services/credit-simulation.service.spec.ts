import { TestBed } from '@angular/core/testing';

import { CreditSimulationService } from './credit-simulation.service';

describe('CreditSimulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditSimulationService = TestBed.get(CreditSimulationService);
    expect(service).toBeTruthy();
  });
});
