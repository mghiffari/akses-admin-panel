import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCategoryDetailsComponent } from './article-category-details.component';

describe('ArticleCategoryDetailsComponent', () => {
  let component: ArticleCategoryDetailsComponent;
  let fixture: ComponentFixture<ArticleCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
