import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOfferListComponent } from './special-offer-list.component';

describe('SpecialOfferListComponent', () => {
  let component: SpecialOfferListComponent;
  let fixture: ComponentFixture<SpecialOfferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialOfferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialOfferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
