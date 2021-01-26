import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef, Optional, Self, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, FormControl, Validators, NgControl } from '@angular/forms';

@Component({
  selector: 'app-oncosts-amount',
  templateUrl: './oncosts-amount.component.html',
  styleUrls: ['./oncosts-amount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OncostsAmountComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() label: string;

  inputControl = new FormControl('', [Validators.required, Validators.min(0)]);
  val = '';

  set value(value) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  get isInvalidFeedback(): boolean {
    return this.controlDir
      && this.controlDir.control
      && this.controlDir.control.invalid
      && this.controlDir.control.touched;
  }

  get isRequired(): boolean {
    return this.isInvalidFeedback
      && this.controlDir.control.errors?.required;
  }

  get isMin(): boolean {
    return this.isInvalidFeedback
      && this.controlDir.control.errors?.min;
  }

  get canShowError(): boolean {
    return this.isInvalidFeedback;
  }

  get canShowRequiredError(): boolean {
    return this.canShowError
      && this.controlDir.control.errors?.required;
  }

  get canShowMinAmountError(): boolean {
    return this.canShowError
      && this.controlDir.control.errors?.min;
  }

  get controlClass(): string {
    if (!this.controlDir
      || !this.controlDir.control
      || !this.controlDir.control.touched) {
      return null;
    }
    if (this.isInvalidFeedback) {
      return 'is-invalid';
    }

    return 'is-valid';
  }

  constructor(
    @Optional() @Self() private controlDir: NgControl,
    private cdRef: ChangeDetectorRef,
    ) {
      if (this.controlDir) {
        this.controlDir.valueAccessor = this;
      }
   }

  ngOnInit(): void {
    if (this.controlDir) {
      const control = this.controlDir.control
      const validators = control.validator
        ? [control.validator, this.inputControl.validator]
        : this.inputControl.validator
      control.setValidators(validators)
      control.updateValueAndValidity({ emitEvent: false })
    }
   }

  onChange: any = (event) => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.input.nativeElement.value = value || '0';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
