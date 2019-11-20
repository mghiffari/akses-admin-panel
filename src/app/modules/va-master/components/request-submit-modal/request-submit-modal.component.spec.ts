import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSubmitModalComponent } from './request-submit-modal.component';

describe('RequestSubmitModalComponent', () => {
  let component: RequestSubmitModalComponent;
  let fixture: ComponentFixture<RequestSubmitModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSubmitModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSubmitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});