import { TestBed } from '@angular/core/testing';

import { ArticleDetailsService } from './article-details.service';

describe('ArticleDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArticleDetailsService = TestBed.get(ArticleDetailsService);
    expect(service).toBeTruthy();
  });
});
