import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { OncostsItemComponent } from './oncosts-item.component';

describe('OncostsItemComponent', () => {
  let component: OncostsItemComponent;
  let fixture: ComponentFixture<OncostsItemComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [OncostsItemComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncostsItemComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    component.oncostItem = { itemID: 1, itemType: '', amount: 0 };
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('isEmptyOncostItem', () => {
    it('should be true when no itemType and zero amount', () => {
      component.oncostItem = { itemID: 3, itemType: '', amount: 0 };
      component.invalidItemTypes = [];
      fixture.detectChanges();

      expect(component.isEmptyOncostItem).toBeTrue();
    })

    it('should be false when no itemType contains a value', () => {
      component.oncostItem = { itemID: 3, itemType: 'Pa', amount: 0 };
      component.invalidItemTypes = [];
      fixture.detectChanges();

      expect(component.isEmptyOncostItem).toBeFalse();
    })

    it('should be false when no amount contains a value', () => {
      component.oncostItem = { itemID: 3, itemType: '', amount: 5.5 };
      component.invalidItemTypes = [];
      fixture.detectChanges();

      expect(component.isEmptyOncostItem).toBeFalse();
    })
  });

  describe('new empty item', () => {
    xit('should set the focus to item type input', fakeAsync(() => {
      component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
      component.invalidItemTypes = [];
      fixture.detectChanges();
      component.ngAfterViewInit();

      flush();

      const focusInput = fixture.nativeElement.querySelector('.item-type:focus');

      const itemTypeInput = el.query(By.css('.item-type')).nativeElement;
      const focusElement = el.query(By.css(':focus'));
      if (!focusElement) { fail('No focussed element found'); }

      expect(focusElement.nativeElement).toBe(itemTypeInput);
    }));

    it('should NOT show any errors even though initially invalid', () => {
      component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
      component.invalidItemTypes = [];
      fixture.detectChanges();

      expect(component.form.valid).toBeFalse();

      expect(component.canShowItemTypeError).toBeFalse();
      expect(component.canShowItemTypeInvalidError).toBeFalsy();
      expect(component.canShowAmountError).toBeFalse();
    });
  })

  describe('property binding', () => {
    it('should bind input values to Component form', () => {
      const testItemType = 'Workers Comp';
      const testAmount = '5.5';
      component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
      component.invalidItemTypes = [];
      fixture.detectChanges();

      const hostElem: HTMLElement = fixture.nativeElement;
      const itemTypeInput: HTMLInputElement = hostElem.querySelector('.r-item-type-input');
      const amountInput: HTMLInputElement = hostElem.querySelector('.r-amount-input');
      fixture.detectChanges();

      itemTypeInput.value = testItemType;
      amountInput.value = testAmount;

      itemTypeInput.dispatchEvent(new Event('input'));
      amountInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.itemTypeControl.value).toBe(testItemType);
      expect(component.amountControl.value).toBe(testAmount);
      expect(component.form.valid).toBeTrue();
    });

    it('should bind passed input values to Component form values', () => {
      const testItemType = 'Workers Comp';
      const testAmount = 5.5;
      component.oncostItem = { itemID: 2, itemType: testItemType, amount: testAmount };
      component.invalidItemTypes = [];
      fixture.detectChanges();

      const hostElem: HTMLElement = fixture.nativeElement;
      const itemTypeInput: HTMLInputElement = hostElem.querySelector('.r-item-type-input');
      const amountInput: HTMLInputElement = hostElem.querySelector('.r-amount-input');
      fixture.detectChanges();

      itemTypeInput.value = testItemType;
      amountInput.value = String(testAmount);

      expect(itemTypeInput.value).toBe(testItemType);
      expect(amountInput.value).toBe(String(testAmount));
    });
  })

  describe('can show error messages', () => {
    describe('canShowItemTypeRequiredError', () => {
      it('should show touches empty item type control', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const itemTypeInput: HTMLInputElement = elem.querySelector('.r-item-type-input');

        expect(component.canShowItemTypeError).toBeFalsy();
        expect(component.canShowItemTypeRequiredError).toBeFalsy();

        itemTypeInput.focus();
        itemTypeInput.value = '';
        itemTypeInput.dispatchEvent(new Event('input'));
        itemTypeInput.blur();
        component.itemTypeControl.markAsTouched();

        fixture.detectChanges();

        expect(component.canShowItemTypeError).toBeTrue();
        expect(component.canShowItemTypeRequiredError).toBeTrue();
        const itemTypeRequiredError: HTMLElement = elem.querySelector('.r-item-type-required-error');
        expect(itemTypeRequiredError).toBeTruthy();
      });

      it('should not show when a valid item type is entered', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const itemTypeInput: HTMLInputElement = elem.querySelector('.r-item-type-input');

        expect(component.canShowItemTypeError).toBeFalsy();
        expect(component.canShowItemTypeRequiredError).toBeFalsy();

        itemTypeInput.focus();
        itemTypeInput.value = 'Workers Comp';
        itemTypeInput.dispatchEvent(new Event('input'));
        itemTypeInput.blur();
        component.itemTypeControl.markAsTouched();

        fixture.detectChanges();

        expect(component.canShowItemTypeError).toBeFalse();
        expect(component.canShowItemTypeRequiredError).toBeFalse();
        const itemTypeRequiredError: HTMLElement = elem.querySelector('.r-item-type-required-error');
        expect(itemTypeRequiredError).toBeFalsy();
      });
    });

    describe('canShowItemTypeInvalidError', () => {
      it(`should show when an invalid value is entered into the item type
        with the passed invalid item type error text
        without having to be touched`, () => {
        const testErrorMessage = 'This item type is already entered. Please remove.';
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = ['workers comp', 'payg'];
        component.invalidItemTypeErrorText = testErrorMessage;
        const testItemType = 'PAY';
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const itemTypeInput: HTMLInputElement = elem.querySelector('.r-item-type-input');

        itemTypeInput.value = testItemType;
        itemTypeInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.canShowItemTypeInvalidError).toBeFalsy();

        itemTypeInput.value = testItemType + 'G';
        itemTypeInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.canShowItemTypeInvalidError).toBeTrue();
        const invalidItemTypeError = elem.querySelector('.r-item-type-invalid-error');
        expect(invalidItemTypeError.textContent).toContain(testErrorMessage);

        itemTypeInput.value = testItemType + 'R';
        itemTypeInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.canShowItemTypeInvalidError).toBeFalsy();
      });

      it(`should show the passed invalid itemType error message`, () => {
        const testItemType = 'PAYG';
        const testErrorMessage = 'This item type is already entered. Please remove.';
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = ['workers comp', 'payg'];
        component.invalidItemTypeErrorText = testErrorMessage;
        component
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const itemTypeInput: HTMLInputElement = elem.querySelector('.r-item-type-input');

        expect(component.canShowItemTypeInvalidError).toBeFalsy();

        itemTypeInput.value = testItemType;
        itemTypeInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.canShowItemTypeInvalidError).toBeTrue();
        const invalidItemTypeError = elem.querySelector('.r-item-type-invalid-error');
        expect(invalidItemTypeError.textContent).toContain(testErrorMessage);
      });
    });

    describe('canShowAmountRequiredError', () => {
      it('should show when touches empty amount control', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const amountInput: HTMLInputElement = elem.querySelector('.r-amount-input');

        expect(component.canShowAmountError).toBeFalsy();
        expect(component.canShowAmountRequiredError).toBeFalsy();

        amountInput.focus();
        amountInput.value = '';
        amountInput.dispatchEvent(new Event('input'));
        amountInput.blur();
        component.amountControl.markAsTouched();

        amountInput.focus();
        fixture.detectChanges();

        expect(component.canShowAmountError).toBeTrue();
        expect(component.canShowAmountRequiredError).toBeTrue();
        const amountRequiredError: HTMLElement = elem.querySelector('.r-amount-required-error');
        expect(amountRequiredError).toBeTruthy();
      });

      it('should NOT show when am amount entered', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const amountInput: HTMLInputElement = elem.querySelector('.r-amount-input');

        expect(component.canShowAmountError).toBeFalsy();
        expect(component.canShowAmountRequiredError).toBeFalsy();

        amountInput.focus();
        amountInput.value = '4.5';
        amountInput.dispatchEvent(new Event('input'));
        amountInput.blur();
        component.amountControl.markAsTouched();

        amountInput.focus();
        fixture.detectChanges();

        expect(component.canShowAmountError).toBeFalse();
        expect(component.canShowAmountRequiredError).toBeFalse();
        const amountRequiredError: HTMLElement = elem.querySelector('.r-amount-required-error');
        expect(amountRequiredError).toBeFalsy();
      });
    })

    describe('canShowMinAmountError', () => {
      it('should show when a negative amount is entered', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const amountInput: HTMLInputElement = elem.querySelector('.r-amount-input');

        expect(component.canShowAmountError).toBeFalsy();
        expect(component.canShowMinAmountError).toBeFalsy();

        amountInput.focus();
        amountInput.value = '-3';
        amountInput.dispatchEvent(new Event('input'));
        amountInput.blur();
        component.amountControl.markAsTouched();

        amountInput.focus();
        fixture.detectChanges();

        expect(component.canShowAmountError).toBeTrue();
        expect(component.canShowMinAmountError).toBeTruthy();
        const minAmountError: HTMLElement = elem.querySelector('.r-amount-min-error');
        expect(minAmountError).toBeTruthy();
      });

      it('should show when zero amount is entered', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const amountInput: HTMLInputElement = elem.querySelector('.r-amount-input');

        expect(component.canShowAmountError).toBeFalsy();
        expect(component.canShowMinAmountError).toBeFalsy();

        amountInput.focus();
        amountInput.value = '0';
        amountInput.dispatchEvent(new Event('input'));
        amountInput.blur();
        component.amountControl.markAsTouched();

        amountInput.focus();
        fixture.detectChanges();

        expect(component.canShowAmountError).toBeTrue();
        expect(component.canShowMinAmountError).toBeTruthy();
        const minAmountError: HTMLElement = elem.querySelector('.r-amount-min-error');
        expect(minAmountError).toBeTruthy();
      });

      it('should NOT show when a positive amount is entered', () => {
        component.oncostItem = { itemID: 2, itemType: '', amount: 0 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        const elem: HTMLElement = fixture.nativeElement;
        const amountInput: HTMLInputElement = elem.querySelector('.r-amount-input');

        expect(component.canShowAmountError).toBeFalsy();
        expect(component.canShowMinAmountError).toBeFalsy();

        amountInput.focus();
        amountInput.value = '.05';
        amountInput.dispatchEvent(new Event('input'));
        amountInput.blur();
        component.amountControl.markAsTouched();

        amountInput.focus();
        fixture.detectChanges();

        expect(component.canShowAmountError).toBeFalsy();
        expect(component.canShowMinAmountError).toBeFalsy();
        const minAmountError: HTMLElement = elem.querySelector('.r-amount-min-error');
        expect(minAmountError).toBeFalsy();
      });
    })

    describe('deleteItem', () => {
      it('should invoke deleteItem when click on Delete', () => {
        component.oncostItem = { itemID: 2, itemType: 'PAYG', amount: 4.5 };
        component.invalidItemTypes = [];
        fixture.detectChanges();

        spyOn(component, 'onDelete');

        const deleteItem = fixture.debugElement.nativeElement.querySelector('.r-delete-item');
        deleteItem.click();

        expect(component.onDelete).toHaveBeenCalledTimes(1);
      });
    })
  })
});
