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
    it('should be invoked by clicking on the Add Item link', () => {
      component.categoryName = 'Taxes';
      fixture.detectChanges();

      spyOn(component, 'onAddOncostsItem');

      const addItemLink = fixture.debugElement.nativeElement.querySelector('.r-add-item-link');
      addItemLink.click();

      expect(component.onAddOncostsItem).toHaveBeenCalledTimes(1);
    });

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
    it(`should return a list of itemType values for all NON itemID valued items
        when isUniqueItemType is true`, () => {
      component.categoryName = 'Taxes';
      component.isUniqueItemType = true;
      fixture.detectChanges();

      let testID: number;
      let itemID: number;
      const expected = ['payg', 'fbt'];

      component.onAddOncostsItem();
      itemID = component.lastOncostItem.itemID;
      component.form.get(String(itemID))
        .patchValue ({ itemID, itemType: 'PAYG', amount: 4.5 });

      component.onAddOncostsItem();
      itemID = component.lastOncostItem.itemID;
      testID = itemID;
      component.form.get(String(testID))
        .patchValue({ itemID, itemType: 'Workers Comp', amount: 4.7});

      component.onAddOncostsItem();
      itemID = component.lastOncostItem.itemID;
      component.form.get(String(itemID))
        .patchValue ({ itemID, itemType: 'FBT', amount: 6 });

      const actual = component.getInvalidItemTypes(testID);

      expect(actual.length).toBe(expected.length);
      const differences = actual.filter(i => !expected.includes(i));
      expect(differences.length).toBe(0);
    });

    it(`should return an empty list of itemType values for all NON itemID valued items
        when isUniqueItemType is false`, () => {
      component.categoryName = 'Taxes';
      component.isUniqueItemType = false;
      fixture.detectChanges();

      let testID: number;
      let itemID: number;
      const expected = [];

      component.onAddOncostsItem();
      itemID = component.lastOncostItem.itemID;
      component.form.get(String(itemID))
        .patchValue ({ itemID, itemType: 'PAYG', amount: 4.5 });

      component.onAddOncostsItem();
      itemID = component.lastOncostItem.itemID;
      testID = itemID;
      component.form.get(String(testID))
        .patchValue({ itemID, itemType: 'Workers Comp', amount: 4.7});

      component.onAddOncostsItem();
      itemID = component.lastOncostItem.itemID;
      component.form.get(String(itemID))
        .patchValue ({ itemID, itemType: 'FBT', amount: 6 });

      const actual = component.getInvalidItemTypes(testID);

      expect(actual.length).toBe(expected.length);
      const differences = actual.filter(i => !expected.includes(i));
      expect(differences.length).toBe(0);
    });
  })
});
