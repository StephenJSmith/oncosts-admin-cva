import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { OncostsCategoryComponent } from './oncosts-category.component';

describe('OncostsCategoryComponent', () => {
  let component: OncostsCategoryComponent;
  let fixture: ComponentFixture<OncostsCategoryComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ OncostsCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncostsCategoryComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial setup', () => {
    xit('should display the input passed category name', fakeAsync(() => {
      const testCategoryName = 'Taxes';
      component.categoryName = testCategoryName;
      fixture.detectChanges();

      flush();

      const category: HTMLElement = fixture.nativeElement.querySelector('.category');
      const categoryLabel: HTMLElement = fixture.nativeElement.querySelector('.r-category-name');

      expect(categoryLabel.textContent).toContain(testCategoryName);
    }));

    it('should be initialised with zero form controls', () => {
      fixture.detectChanges();

      expect(component.formKeys.length).toBe(0);
    });
  })

  describe('onAddOncostsItem', () => {
    it('should be invoked by clicking on the Add Item link', fakeAsync(() => {
      component.categoryName = 'Taxes';
      fixture.detectChanges();

      spyOn(component, 'onAddOncostsItem');

      const addItemLink = fixture.debugElement.nativeElement.querySelector('.r-add-item-link');
      addItemLink.click();

      flush();

      expect(component.onAddOncostsItem).toHaveBeenCalledTimes(1);
    }));

    it('should add another control with a new empty oncosts item and next unique itemID', () => {
      component.categoryName = 'Taxes';
      fixture.detectChanges();

      const expectedKey = String(component.nextItemID);
      const preKeys = component.formKeys;
      const expectedKeysCount = preKeys.length + 1;

      component.onAddOncostsItem();

      const postKeys = component.formKeys;
      expect(postKeys.length).toBe(expectedKeysCount);

      const addedKey = postKeys.filter(k => !preKeys.includes(k))[0];
      expect(addedKey).toBe(expectedKey);

      const newFormValues = component.form.controls[addedKey].value;
      expect(newFormValues.itemType).toBe('');
      expect(newFormValues.amount).toBe(0);
    });
  })

  describe('onDeleteItem', () => {
    it('should remove the specified control', () => {
      component.categoryName = 'Taxes';
      fixture.detectChanges();
      component.onAddOncostsItem();
      component.onAddOncostsItem();
      component.onAddOncostsItem();

      const preKeys = component.formKeys;
      const testID = preKeys[preKeys.length - 2];
      const expectedKeysLength = preKeys.length - 1;

      component.onDeleteItem(+testID);

      const postKeys = component.formKeys;
      expect(postKeys.length).toBe(expectedKeysLength);
      const index = postKeys.findIndex(k => k === testID);
      expect(index).toBe(-1);
    });
  })

  describe('getInvalidItemTypes', () => {
    it('should return an empty list when NOT isUniqueItemTyp', () => {

    });

    it('should return a list of itemType values for all NON itemID valued items', () => {

    });
  })

});
