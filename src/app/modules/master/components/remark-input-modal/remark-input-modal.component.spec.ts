import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkInputModalComponent } from './remark-input-modal.component';

describe('RemarkInputModalComponent', () => {
  let component: RemarkInputModalComponent;
  let fixture: ComponentFixture<RemarkInputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarkInputModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarkInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
