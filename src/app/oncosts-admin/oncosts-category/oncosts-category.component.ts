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

  isUniqueItemType = true;

  oncostsItems: OncostsItem[] = [];

  form: FormGroup;
  subscriptions: Subscription[] = [];

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

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.subscriptions.push()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onDeleteItem(itemID: number) {
    this.oncostsItems = this.oncostsItems.filter(i => i.itemID !== itemID);
    this.form.removeControl(itemID.toString());
    this.cdRef.markForCheck();
    if (!this.isUniqueItemType) { return; }

    this.subscriptions.push(
      timer(100).subscribe(() => {
        Object.keys(this.form.controls).forEach(key => {
          const itemForm = this.form.get(key);
          if (itemForm.invalid) {
            const value = {...itemForm.value};
            itemForm.setValue(value);
          }
        })
      })
    )
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return this.form.valid
      ? null
      : { invalidForm: { valid: false, message: 'invalid item' } };
  }

  writeValue(val: any): void {
    if (val) {
      this.oncostsItems = val;
      this.loadItems();
    }
  }

  registerOnChange(fn: any): void {
    this.subscriptions.push(this.form.valueChanges.subscribe(fn));
  }

  registerOnTouched(fn: any): void { }

  addOncostsItem() {
    const newItem: OncostsItem = {
      itemID: this.nextItemID,
      itemType: '',
      amount: 0
    };
    this.oncostsItems.push(newItem);
    this.addItemAsControl(newItem);
    this.cdRef.markForCheck();
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

  private initialiseItems(oncostsItems: OncostsItem[]) {
    oncostsItems.forEach(item => {
      this.form.addControl(
        item.itemID.toString(),
        new FormControl({
          itemID: item.itemID,
          itemType: '',
          amount: 0,
        })
      )
    })
  }

  private loadItems() {
    if (!this.oncostsItems) {
      return;
    }

    this.form.setValue(this.oncostsItems, { emitEvent: false });
  }
}
