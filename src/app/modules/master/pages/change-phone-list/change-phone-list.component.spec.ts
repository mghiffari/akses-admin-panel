import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePhoneListComponent } from './change-phone-list.component';

describe('ChangePhoneListComponent', () => {
  let component: ChangePhoneListComponent;
  let fixture: ComponentFixture<ChangePhoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePhoneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePhoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
