import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackYourRequestListComponent} from './track-your-request.component';

describe('TrackYourRequestListComponent', () => {
  let component: TrackYourRequestListComponent;
  let fixture: ComponentFixture<TrackYourRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackYourRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackYourRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
