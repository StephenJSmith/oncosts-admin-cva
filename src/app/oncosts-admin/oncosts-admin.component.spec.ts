import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { OncostsAdminComponent } from './oncosts-admin.component';
import { OncostsAmountComponent } from './oncosts-amount/oncosts-amount.component';
import { OncostsCategoryComponent } from './oncosts-category/oncosts-category.component';
import { OncostsItemComponent } from './oncosts-item/oncosts-item.component';

describe('OncostsAdminComponent', () => {
  let component: OncostsAdminComponent;
  let fixture: ComponentFixture<OncostsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        OncostsAdminComponent,
        OncostsAmountComponent,
        OncostsCategoryComponent,
        OncostsItemComponent,
      ]
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
