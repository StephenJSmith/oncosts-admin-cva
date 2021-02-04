import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { OncostsAdmin } from './oncosts-admin';
import { OncostsItem } from './oncosts-item';
import { OncostsCategoryComponent } from './oncosts-category/oncosts-category.component';

@Component({
  selector: 'app-oncosts-admin',
  templateUrl: './oncosts-admin.component.html',
  styleUrls: ['./oncosts-admin.component.css']
})
export class OncostsAdminComponent implements OnInit, OnDestroy {
  @ViewChild('taxesCategory') taxesCategory: OncostsCategoryComponent;
  @ViewChild('insurancesCategory') insurancesCategory: OncostsCategoryComponent;
  @ViewChild('otherCategory') otherCategory: OncostsCategoryComponent;

  form: FormGroup;
  duplicatedErrorText = "Oncost item already added. Please remove.";
  isUniqueItemType = true;

  subscriptions: Subscription[] = [];
  lastPersisted: OncostsAdmin;
  persistedDeepCopy: OncostsAdmin;
  emptyOncostsAdmin = {
    casualLoading: 0,
    superannuation: 0,
    taxes: [],
    insurances: [],
    other: [],
  } as OncostsAdmin;

  get canPopulate(): boolean {
    if (!this.form) { return false; }

    return !this.form.touched;
  }

  get isTaxesItemsValid(): boolean {
    if (!this.form) { return false; }

    return this.form.controls.taxes.valid;
  }

  get isInsuranceItemsValid(): boolean {
    return this.form?.controls?.insurances?.valid;
  }

  get isOtherItemsValid(): boolean {
    return this.form?.controls?.other?.valid;
  }

  get canShowCasualLoadingError(): boolean | null | undefined {
    return this.form?.controls?.casualLoading.invalid
      && this.form?.controls?.casualLoading.touched;
  }

  get canShowCasualLoadingRequiredError(): boolean | null| undefined {
    return this.canShowCasualLoadingError
      && this.form?.controls?.casualLoading?.errors?.required;
  }

  get canShowCasualLoadingMinAmountError(): boolean | null| undefined {
    return this.canShowCasualLoadingError
      && this.form?.controls?.casualLoading?.errors?.min;
  }

  get canShowSuperannuationError(): boolean | null | undefined {
    return this.form?.controls?.superannuation.invalid
      && this.form?.controls?.superannuation.touched;
  }

  get canShowSuperannuationRequiredError(): boolean | null| undefined {
    return this.canShowSuperannuationError
      && this.form?.controls?.superannuation?.errors?.required;
  }

  get canShowSuperannuationMinAmountError(): boolean | null| undefined {
    return this.canShowSuperannuationError
      && this.form?.controls?.superannuation?.errors?.min;
  }

  set lastPersistedSettings(value: OncostsAdmin) {
    this.lastPersisted = {...value};
    this.persistedDeepCopy = JSON.parse(JSON.stringify(this.lastPersisted));
  }

  get lastPersistedSettings(): OncostsAdmin {
    return JSON.parse(JSON.stringify(this.persistedDeepCopy));
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.lastPersistedSettings = this.emptyOncostsAdmin;
    this.createAdminForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  createAdminForm() {
    this.form = this.fb.group({
      casualLoading: [0, [Validators.required, Validators.min(0)]],
      superannuation: [0, [Validators.required, Validators.min(0)]],
      taxes: [],
      insurances: [],
      other: [],
    });
  }

  populateOncostsAdmin() {
    if (!this.canPopulate) { return; }

    // simulate existing values when form opened
    const taxes: OncostsItem[] = [
      { itemID: 0, isSaved: true, itemType: 'PAYG', amount: 13} as OncostsItem,
      { itemID: 0, isSaved: true, itemType: 'FBT', amount: 7} as OncostsItem,
    ];

    const insurances: OncostsItem[] = [
      { itemID: 0, isSaved: true, itemType: 'Workers Comp - NSW', amount: 4.5} as OncostsItem,
      { itemID: 0, isSaved: true, itemType: 'Workers Comp - VIC', amount: 5} as OncostsItem,
    ];

    const other: OncostsItem[] = [
      { itemID: 0, isSaved: true, itemType: 'Misc', amount: 6} as OncostsItem,
    ];

    const populated: OncostsAdmin = {
      casualLoading: 12,
      superannuation: 11,
      taxes,
      insurances,
      other,
    };

    this.lastPersistedSettings = populated;

    this.setFormControlsToLastPersistedValues();
  }

  onSaveChanges() {
    if (!this.form.valid) { return; }

    // TODO: persist
    this.markAllValidItemsAsSaved();
    this.lastPersistedSettings = this.form.value;
    this.form.markAsPristine();
  }

  markAllValidItemsAsSaved() {
    this.taxesCategory.markAllValidItemsAsSaved();
    this.insurancesCategory.markAllValidItemsAsSaved();
    this.otherCategory.markAllValidItemsAsSaved();
  }

  onCancel() {
    this.setFormControlsToLastPersistedValues();
  }

  private setFormControlsToLastPersistedValues() {
    this.form.setValue(this.emptyOncostsAdmin);

    this.lastPersisted = this.lastPersistedSettings;
    this.form.controls.casualLoading.setValue(this.lastPersisted.casualLoading);
    this.form.controls.superannuation.setValue(this.lastPersisted.superannuation);
    this.cdRef.markForCheck();

    this.subscriptions.push(
      timer(0).subscribe(() => {
        this.loadCategoryItems('taxes', (this.lastPersisted.taxes));
        this.loadCategoryItems('insurances', (this.lastPersisted.insurances));
        this.loadCategoryItems('other', (this.lastPersisted.other));

        this.cdRef.markForCheck();
        this.form.markAsPristine();
      })
    )
  }

  private loadCategoryItems(key: string, items: OncostsItem[]) {
    this.form.patchValue(
      { [key]: items },
      { emitEvent: false }
    );

    this.cdRef.markForCheck();
  }
}
