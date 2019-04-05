import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePhonenumberRequestRejectedRemarkInputModalComponent } from './change-phonenumber-request-rejected-remark-input-modal.component';

describe('ChangePhonenumberRequestRejectedRemarkInputModalComponent', () => {
  let component: ChangePhonenumberRequestRejectedRemarkInputModalComponent;
  let fixture: ComponentFixture<ChangePhonenumberRequestRejectedRemarkInputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePhonenumberRequestRejectedRemarkInputModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePhonenumberRequestRejectedRemarkInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
