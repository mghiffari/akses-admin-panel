import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQDetailsComponent } from './faq-details.component';

describe('FAQDetailsComponent', () => {
  let component: FAQDetailsComponent;
  let fixture: ComponentFixture<FAQDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FAQDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
