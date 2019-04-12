import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditSimulationProductComponent } from './credit-simulation-product';

describe('CreditSimulationProductComponent', () => {
  let component: CreditSimulationProductComponent;
  let fixture: ComponentFixture<CreditSimulationProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditSimulationProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditSimulationProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
