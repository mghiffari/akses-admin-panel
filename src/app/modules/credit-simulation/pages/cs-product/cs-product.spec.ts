import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CSProductComponent } from './cs-product';

describe('CSProductComponent', () => {
  let component: CSProductComponent;
  let fixture: ComponentFixture<CSProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
