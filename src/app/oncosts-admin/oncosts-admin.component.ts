import { ClassField } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-oncosts-admin',
  templateUrl: './oncosts-admin.component.html',
  styleUrls: ['./oncosts-admin.component.css']
})
export class OncostsAdminComponent implements OnInit {
  adminForm: FormGroup;
  duplicatedErrorText = "Oncost item already added. Please remove.";

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

  constructor(
    private fb: FormBuilder
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
}
