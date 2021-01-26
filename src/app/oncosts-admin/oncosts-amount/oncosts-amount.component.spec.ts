import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncostsAmountComponent } from './oncosts-amount.component';

describe('OncostsAmountComponent', () => {
  let component: OncostsAmountComponent;
  let fixture: ComponentFixture<OncostsAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncostsAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncostsAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
