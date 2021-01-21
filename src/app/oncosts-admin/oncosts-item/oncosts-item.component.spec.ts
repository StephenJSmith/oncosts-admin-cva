import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncostsItemComponent } from './oncosts-item.component';

describe('OncostsItemComponent', () => {
  let component: OncostsItemComponent;
  let fixture: ComponentFixture<OncostsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncostsItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncostsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
