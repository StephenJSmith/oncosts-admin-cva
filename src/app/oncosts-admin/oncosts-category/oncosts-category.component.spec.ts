import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncostsCategoryComponent } from './oncosts-category.component';

describe('OncostsCategoryComponent', () => {
  let component: OncostsCategoryComponent;
  let fixture: ComponentFixture<OncostsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncostsCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncostsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
