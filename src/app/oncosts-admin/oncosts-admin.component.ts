import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OncostsAdmin } from './oncosts-admin';
import { OncostsItem } from './oncosts-item';

@Component({
  selector: 'app-oncosts-admin',
  templateUrl: './oncosts-admin.component.html',
  styleUrls: ['./oncosts-admin.component.css']
})
export class OncostsAdminComponent implements OnInit {
  adminForm: FormGroup;
  duplicatedErrorText = "Oncost item already added. Please remove.";
  isUniqueItemType = true;

  persisted: OncostsAdmin;

  get canPopulate(): boolean {
    if (!this.adminForm) { return false; }

    return !this.adminForm.touched;
  }

  get isTaxesItemsValid(): boolean {
    if (!this.adminForm) { return false; }

    return this.adminForm.controls.taxes.valid;
  }

  get isInsuranceItemsValid(): boolean {
    return this.adminForm?.controls?.insurance?.valid;
  }

  get isOtherItemsValid(): boolean {
    return this.adminForm?.controls?.other?.valid;
  }

  get canShowCasualLoadingError(): boolean | null | undefined {
    return this.adminForm?.controls?.casualLoading.invalid
      && this.adminForm?.controls?.casualLoading.touched;
  }

  get canShowCasualLoadingRequiredError(): boolean | null| undefined {
    return this.canShowCasualLoadingError
      && this.adminForm?.controls?.casualLoading?.errors?.required;
  }

  get canShowCasualLoadingMinAmountError(): boolean | null| undefined {
    return this.canShowCasualLoadingError
      && this.adminForm?.controls?.casualLoading?.errors?.min;
  }

  get canShowSuperannuationError(): boolean | null | undefined {
    return this.adminForm?.controls?.superannuation.invalid
      && this.adminForm?.controls?.superannuation.touched;
  }

  get canShowSuperannuationRequiredError(): boolean | null| undefined {
    return this.canShowSuperannuationError
      && this.adminForm?.controls?.superannuation?.errors?.required;
  }

  get canShowSuperannuationMinAmountError(): boolean | null| undefined {
    return this.canShowSuperannuationError
      && this.adminForm?.controls?.superannuation?.errors?.min;
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.createAdminForm();
  }

  createAdminForm() {
    this.adminForm = this.fb.group({
      casualLoading: [0, [Validators.required, Validators.min(0)]],
      superannuation: [0, [Validators.required, Validators.min(0)]],
      miscAmount: [0, [Validators.required, Validators.min(0)]],
      taxes: [],
      insurance: [],
      other: [],
    });
  }

  populateOncostsAdmin() {
    if (!this.canPopulate) { return; }

    // simulate existing values when form opened
    const taxes: OncostsItem[] = [
      { itemID: 0, itemType: 'PAYG', amount: 13} as OncostsItem,
      { itemID: 0, itemType: 'FBT', amount: 7} as OncostsItem,
    ];

    const insurances: OncostsItem[] = [
      { itemID: 0, itemType: 'Workers Comp - NSW', amount: 4.5} as OncostsItem,
      { itemID: 0, itemType: 'Workers Comp - VIC', amount: 5} as OncostsItem,
    ];

    const other: OncostsItem[] = [
      { itemID: 0, itemType: 'Misc', amount: 6} as OncostsItem,
    ];

    const populated: OncostsAdmin = {
      casualLoading: 12,
      superannuation: 11,
      taxes,
      insurances,
      other,
    };

    this.persisted = {... populated};

    this.adminForm.controls.casualLoading.setValue(this.persisted.casualLoading);
    this.adminForm.controls.superannuation.setValue(this.persisted.superannuation);
    this.loadCategoryItems('taxes', this.persisted.taxes);
    this.loadCategoryItems('insurance', this.persisted.insurances);
    this.loadCategoryItems('other', this.persisted.other);
  }

  createNewItem(): FormGroup {
    return new FormGroup({
      'itemType': new FormControl('', [Validators.required]),
      'amount': new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });
  }

  onSaveChanges() {
    this.adminForm.markAsPristine();
    console.log(this.adminForm.value);
  }

  onCancel() {}

  private loadCategoryItems(key: string, items: OncostsItem[]) {
    this.adminForm.patchValue(
      { [key]: items },
      { emitEvent: false }
    );

    this.cdRef.markForCheck();
  }
}
