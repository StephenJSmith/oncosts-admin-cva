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

  persisted: OncostsAdmin;

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

  get taxes(): OncostsItem[] {
    if (!this.persisted?.taxes) { return []; }

    return this.persisted.taxes;
  }

  get insurances(): OncostsItem[] {
    if (!this.persisted?.insurances) { return []; }

    return this.persisted.insurances;
  }

  get other(): OncostsItem[] {
    if (!this.persisted?.other) { return []; }

    return this.persisted.other;
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
      casualLoading: [0],
      superannuation: [0],
      taxes: [],
      insurance: [],
      other: [],
    });
  }

  populateOncostsAdmin() {
    // simulate existing values when form opened
    const taxes: OncostsItem[] = [
      { itemType: 'PAYG', amount: 13} as OncostsItem,
      { itemType: 'FBT', amount: 7} as OncostsItem,
    ];

    const insurances: OncostsItem[] = [
      { itemType: 'Workers Comp - NSW', amount: 4.5} as OncostsItem,
      { itemType: 'Workers Comp - VIC', amount: 5} as OncostsItem,
    ];

    const other: OncostsItem[] = [
      { itemType: 'Misc', amount: 6} as OncostsItem,
    ];

    const populated: OncostsAdmin = {
      casualLoading: 12,
      superannuation: 11,
      taxes,
      insurances,
      other,
    };

    this.persisted = {... populated};
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

  private loadTaxesCategoryItems() {

  }
}
