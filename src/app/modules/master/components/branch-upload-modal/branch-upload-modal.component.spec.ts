import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUploadModalComponent } from './branch-upload-modal.component';

describe('BranchUploadModalComponent', () => {
  let component: BranchUploadModalComponent;
  let fixture: ComponentFixture<BranchUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
