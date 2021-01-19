import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncostsAdminComponent } from './oncosts-admin.component';

describe('OncostsAdminComponent', () => {
  let component: OncostsAdminComponent;
  let fixture: ComponentFixture<OncostsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncostsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncostsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
