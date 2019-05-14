import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifConfirmModalComponent } from './notif-confirm-modal.component';

describe('NotifConfirmModalComponent', () => {
  let component: NotifConfirmModalComponent;
  let fixture: ComponentFixture<NotifConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
