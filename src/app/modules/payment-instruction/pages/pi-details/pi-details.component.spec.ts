import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PIDetailsComponent } from './pi-details.component';

describe('PIDetailsComponent', () => {
  let component: PIDetailsComponent;
  let fixture: ComponentFixture<PIDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PIDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PIDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
