import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface OncostformValues {
  itemType: string;
  amount: number;
}

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
export class OncostsItemComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholderText: string;
  @Input() duplicatedErrorText: string;

  form: FormGroup;
  subscriptions: Subscription[] = [];

  get canShowItemTypeError(): boolean | null | undefined {
    return this.itemTypeControl
      && this.itemTypeControl.invalid
      && this.itemTypeControl.touched;
  }

  get canShowItemTypeRequiredError(): boolean | null | undefined {
    return this.canShowItemTypeError && this.itemTypeControl?.errors?.required;
  }

  get canShowItemTypeDuplicatedError(): boolean | null | undefined {
    return this.itemTypeControl
      && this.itemTypeControl.invalid
      && this.itemTypeControl?.errors?.unique;
  }

  get canShowAmountError(): boolean | null | undefined {
    return this.amountControl
      && this.amountControl.invalid
      && this.amountControl.touched;
  }

  get canShowAmountRequiredError(): boolean | null | undefined {
    return this.canShowAmountError && this.amountControl?.errors?.required;
  }

  get canShowMinAmountError(): boolean | null | undefined {
    return this.canShowAmountError && this.amountControl?.errors?.min;
  }

  get value(): OncostformValues {
    return this.form.value;
  }

  set value(value: OncostformValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get itemTypeControl(): AbstractControl {
    return this.form.controls.itemType;
  }

  get amountControl(): AbstractControl {
    return this.form.controls.amount;
  }

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      itemType: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any =() => {};

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.form.valid
      ? null
      : { item: { valid: false }}
  }
}
