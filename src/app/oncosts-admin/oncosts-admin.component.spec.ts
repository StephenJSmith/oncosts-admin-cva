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

  describe('onSaveChanges()', () => {
    it('should be invoked by clicking Save button', () => {
      spyOn(component, 'onSaveChanges');
      const saveChangesButton: HTMLElement = fixture.debugElement.nativeElement.querySelector('.r-save-changes-button');

      saveChangesButton.click();

      expect(component.onSaveChanges).toHaveBeenCalledTimes(1);
    });

    it('should set new last persisted values', () => {
      const initial = component.lastPersistedSettings;
      const testCasualLoading = 5.45;
      const testSuperannuation = 7.3;

      component.form.get('casualLoading').setValue(testCasualLoading);
      component.form.get('superannuation').setValue(testSuperannuation);
      component.form.markAsDirty();
      fixture.detectChanges();

      component.onSaveChanges();

      const postSaved = component.lastPersistedSettings;
      expect(postSaved.casualLoading).toBe(testCasualLoading);
      expect(postSaved.superannuation).toBe(testSuperannuation);

      expect(postSaved.casualLoading).not.toBe(initial.casualLoading);
      expect(postSaved.superannuation).not.toBe(initial.superannuation);
    });
  })

  describe('onCancel()', () => {
    it('should be invoked by clicking on Cancel button', () => {
      spyOn(component, 'onCancel');
      const cancelButton: HTMLElement = fixture.debugElement.nativeElement.querySelector('.r-cancel-button');
      component.form.markAsDirty();
      fixture.detectChanges();

      cancelButton.click();

      expect(component.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should revert to last persisted values', () => {
      const initialValues = component.lastPersistedSettings;

      component.form.get('casualLoading').setValue(4.5);
      component.form.get('superannuation').setValue(7.25);
      component.form.markAsDirty();
      fixture.detectChanges();

      component.onCancel();

      expect(component.form.get('casualLoading').value).toBe(initialValues.casualLoading);
      expect(component.form.get('superannuation').value).toBe(initialValues.superannuation);
    });
  })
});
