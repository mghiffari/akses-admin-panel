import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PIListComponent } from './pi-list.component';

describe('PIListComponent', () => {
  let component: PIListComponent;
  let fixture: ComponentFixture<PIListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PIListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PIListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
