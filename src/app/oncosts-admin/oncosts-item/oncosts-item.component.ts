import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OncostsItem } from '../oncosts-item';

@Component({
  selector: 'app-oncosts-item',
  templateUrl: './oncosts-item.component.html',
  styleUrls: ['./oncosts-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OncostsItemComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OncostsItemComponent),
      multi: true,
    },
  ]
})
export class OncostsItemComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
  @Input() oncostItem: OncostsItem;
  @Input() oncostItems: OncostsItem[] = [];
  @Input() placeholderText: string;
  @Input() isUniqueItemType = false;
  @Input() duplicatedErrorText: string = 'Item type already exists. Please rename.';
  @Input() canAddAnother = false;
  @Output() addAnotherItem = new EventEmitter<null>();
  @Output() deleteItem = new EventEmitter<number>();

  @ViewChild('itemTypeInput') itemTypeInput: ElementRef;

  form: FormGroup;
  subscriptions: Subscription[] = [];

  get canShowItemTypeError(): boolean | null | undefined {
    return this.itemTypeControl
      && this.itemTypeControl.invalid
      && this.itemTypeControl.touched;
  }

  get canShowItemTypeRequiredError(): boolean | null | undefined {
    return this.canShowItemTypeError
      && this.itemTypeControl?.errors?.required;
  }

  get canShowItemTypeDuplicatedError(): boolean | null | undefined {
    return this.isUniqueItemType
      && this.form?.errors?.duplicated;
  }

  get canShowAmountError(): boolean | null | undefined {
    return this.amountControl
      && this.amountControl.invalid
      && this.amountControl.touched;
  }

  get canShowAmountRequiredError(): boolean | null | undefined {
    return this.canShowAmountError
      && this.amountControl?.errors?.required;
  }

  get canShowMinAmountError(): boolean | null | undefined {
    return this.canShowAmountError
      && this.amountControl?.errors?.min;
  }

  get isEmptyOncostItem(): boolean {
    if (!this.oncostItem) { return false; }

    return !this.oncostItem.itemType
      && !this.oncostItem.amount;
  }

  get value(): OncostsItem {
    return this.form.value;
  }

  set value(value: OncostsItem) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get itemTypeControl(): AbstractControl {
    return this.form?.controls?.itemType;
  }

  get amountControl(): AbstractControl {
    return this.form?.controls?.amount;
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      itemID: this.oncostItem.itemID,
      itemType: [this.oncostItem.itemType,
        [
          Validators.required,
        ]],
      amount: [this.oncostItem.amount, [Validators.required, Validators.min(0.01)]],
    }, {
      validators: [this.validateItemTypeNotDuplicated.bind(this)],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.isEmptyOncostItem) {
      this.itemTypeInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  validateItemTypeNotDuplicated (control: AbstractControl) {
    if (!this.isUniqueItemType) { return null; }

    const id = control.get('itemID').value;
    const itemType = control.get('itemType').value?.toLowerCase();
    if (!itemType || !itemType.trim()) { return null; }

    const otherItems = Object.values(this.oncostItems)
      .filter(i => i.itemID !== id);
    const index = otherItems.findIndex(i =>
      i.itemType.toLocaleLowerCase() === itemType);

    return index < 0
      ? null
      : { 'duplicated': true };
  }

  onAddAnotherItem() {
    if (!this.form.valid) {return; }

    this.addAnotherItem.emit();
  }

  onDelete() {
    this.cdRef.markForCheck();
    this.deleteItem.emit(this.oncostItem.itemID);
  }

  onChange: any = () => {};
  onTouched: any =() => {};

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    this.cdRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(): ValidationErrors | null {
    return this.form?.valid
      ? null
      : { item: { valid: false }}
  }
}
