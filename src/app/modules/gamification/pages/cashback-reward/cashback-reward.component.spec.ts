import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackRewardComponent } from './cashback-reward.component';

describe('CashbackRewardComponent', () => {
  let component: CashbackRewardComponent;
  let fixture: ComponentFixture<CashbackRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashbackRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashbackRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
