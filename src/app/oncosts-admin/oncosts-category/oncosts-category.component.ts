import { ChangeDetectionStrategy, Component, OnInit, forwardRef, Output, OnDestroy, Input, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder, FormGroup, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  oncostsItems: OncostsItem[] = [];

  form: FormGroup;
  subscriptions: Subscription[] = [];

  get isOncostsCategoryValid(): boolean {
    if (!this.form) { return false; }

    return this.form.valid;
  }

  constructor(
    private fb: FormBuilder
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
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid
      ? null
      : { invalidForm: { valid: false, message: 'invalid item' } };  }

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
    const maxItemID = this.oncostsItems.length == 0
    ? 0
    : Math.max.apply(Math, this.oncostsItems.map(i => i.itemID));

    const newItem: OncostsItem = {itemID: maxItemID + 1, itemType: '', amount: 0 };
    this.oncostsItems.push(newItem);
    //this.loadItems();
    this.addItemAsControl(newItem);
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

    this.form.updateValueAndValidity();
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
