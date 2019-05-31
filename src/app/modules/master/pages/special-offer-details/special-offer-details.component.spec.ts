import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOfferDetailsComponent } from './special-offer-details.component';

describe('SpecialOfferDetailsComponent', () => {
  let component: SpecialOfferDetailsComponent;
  let fixture: ComponentFixture<SpecialOfferDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialOfferDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialOfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
