import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutDetailsModalComponent } from './cashout-details-modal.component';

describe('CashoutDetailsModalComponent', () => {
  let component: CashoutDetailsModalComponent;
  let fixture: ComponentFixture<CashoutDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashoutDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashoutDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});