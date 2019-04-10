import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePhonenumberRequestListComponent } from './change-phonenumber-request-list.component';

describe('ChangePhonenumberRequestListComponent', () => {
  let component: ChangePhonenumberRequestListComponent;
  let fixture: ComponentFixture<ChangePhonenumberRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePhonenumberRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePhonenumberRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
