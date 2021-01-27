import { ChangeDetectionStrategy, Component, OnInit, forwardRef, Output, OnDestroy, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder, FormGroup, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { OncostsItem } from '../oncosts-item';

@Component({
  selector: 'app-oncosts-category',
  templateUrl: './oncosts-category.component.html',
  styleUrls: ['./oncosts-category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OncostsCategoryComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OncostsCategoryComponent),
      multi: true,
    },
  ]
})
export class OncostsCategoryComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() categoryName: string;
  @Input() placeholderText: string;
  @Input() duplicatedErrorText = 'Item type already exists. Please rename.';
  @Input() isUniqueItemType = false;

  oncostsItems: OncostsItem[] = [];

  form: FormGroup;
  subscriptions: Subscription[] = [];

  get formOncostItems(): OncostsItem[] {
    if (!this.form) { return []; }

    return Object.values(this.form.value);
  }

  get isOncostsCategoryValid(): boolean {
    if (!this.form) { return false; }

    return this.form.valid;
  }

  get nextItemID(): number {
    if (!this.oncostsItems) { return 1; }

    return this.oncostsItems.length == 0
      ? 1
      : Math.max.apply(Math, this.oncostsItems.map(i => i.itemID)) + 1;
  }

  get lastOncostItem(): OncostsItem {
    if (!this.oncostsItems || !this.oncostsItems.length)
    { return null; }

    return [...this.oncostsItems].pop();
  }

  get formKeys(): string[] {
    if (!this.form) { return []; }

    return Object.keys(this.form.controls);
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  canAddAnotherItem(itemID: number): boolean {
    if (itemID !== this.lastOncostItem.itemID)
    { return false; }

    return this.isOncostsCategoryValid;
  }

  onDeleteItem(itemID: number) {
    this.oncostsItems = this.oncostsItems.filter(i => i.itemID !== itemID);
    this.form.removeControl(itemID.toString());
    this.cdRef.markForCheck();
    if (!this.isUniqueItemType) { return; }

    this.subscriptions.push(
      timer(0).subscribe(() => {
        Object.keys(this.form.controls).forEach(key => {
          const itemForm = this.form.get(key);
          if (itemForm.invalid) {
            const value = {...itemForm.value};
            itemForm.setValue(value);
            this.cdRef.markForCheck();
          }
        })
      })
    )
  }

  onChange: any = () => {};
  onTouched: any =() => {};

  validate(_: AbstractControl): ValidationErrors | null {
    return this.form.valid
      ? null
      : { invalidForm: { invalid: true, message: 'invalid item' } };
  }

  writeValue(val: any): void {
    const isEmpty = !val || Array.isArray(val) && val.length === 0;

    if (isEmpty) {
      this.oncostsItems = [];
      this.removeAllFormGroupControls();
    } else {
      this.oncostsItems = Array.isArray(val)
        ? val
        : Object.values(val);
      this.setUniqueItemIDs(this.oncostsItems);
      this.loadItems();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
   }

  onAddOncostsItem() {
    const newItem: OncostsItem = {
      itemID: this.nextItemID,
      itemType: '',
      amount: 0
    };
    this.oncostsItems.push(newItem);
    this.addItemAsControl(newItem);
    this.cdRef.markForCheck();
  }

  getInvalidItemTypes(itemID: number): string[] {
    if (!this.isUniqueItemType) { return []; }

    const invalidItemTypes = this.getOtherItemTypes(itemID)
      .map(itemType => itemType.toLowerCase())

    return invalidItemTypes
  }

  private removeAllFormGroupControls() {
    const keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      this.subscriptions.push(
        timer(0).subscribe(() => {
          this.form.removeControl(key);
          this.cdRef.markForCheck();
        })
      );
    })
  }

  private setUniqueItemIDs(items: OncostsItem[]) {
    items.forEach(i => {
      const itemID = (this.isUniqueItemID(i.itemID, items))
        ? i.itemID
        : this.nextItemID;
      i.itemID = itemID;
    });
  }

  private isUniqueItemID(id: number, items: OncostsItem[]): boolean {
    if (!id) { return false; }

    const countItemIDs = this.getItemIDCount(id, items);

    return countItemIDs === 1;
  }

  private getItemIDCount(id: number, items: OncostsItem[]): number {
    const count = items.reduce((acc, curr) => curr.itemID === id ? ++acc : acc, 0);

    return count;
  }

  private getOtherItemTypes(itemID: number): string[] {
    const itemTypes =  this.formOncostItems
      .filter(i => i.itemID !== itemID)
      .map(i => i.itemType);

    return itemTypes;
  }

  private addItemAsControl(item: OncostsItem) {
    this.form.addControl(
      item.itemID.toString(),
      new FormControl({
        itemID: item.itemID,
        itemType: item.itemType,
        amount: item.amount,
      })
    )
  }

  private loadItems() {
    if (!this.oncostsItems) {
      return;
    }

    this.oncostsItems.forEach(i => {
      this.addItemAsControl(i);
      this.cdRef.markForCheck();
    });
  }
}
