import { TestBed } from '@angular/core/testing';

import { BannerDetailsService } from './banner-details.service';

describe('BannerDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BannerDetailsService = TestBed.get(BannerDetailsService);
    expect(service).toBeTruthy();
  });
});
