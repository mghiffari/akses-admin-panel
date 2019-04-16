import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskedNumInputComponent } from './masked-num-input.component';

describe('MaskedNumInputComponent', () => {
  let component: MaskedNumInputComponent;
  let fixture: ComponentFixture<MaskedNumInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskedNumInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskedNumInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
