import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWithdrawalListComponent} from './request-withdrawal.component';

describe('RequestWithdrawalListComponent', () => {
  let component: RequestWithdrawalListComponent;
  let fixture: ComponentFixture<RequestWithdrawalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWithdrawalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWithdrawalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
