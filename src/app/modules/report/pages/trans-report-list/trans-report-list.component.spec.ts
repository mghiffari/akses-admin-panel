import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransReportListComponent } from './trans-report-list.component';

describe('TransReportListComponent', () => {
  let component: TransReportListComponent;
  let fixture: ComponentFixture<TransReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
