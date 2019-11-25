import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackYourReport } from './track-your-report.component';

describe('TrackYourReport', () => {
  let component: TrackYourReport;
  let fixture: ComponentFixture<TrackYourReport>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackYourReport ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackYourReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
