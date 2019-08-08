import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransReportComponent } from './trans-report.component';

describe('TransReportListComponent', () => {
  let component: TransReportComponent;
  let fixture: ComponentFixture<TransReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
