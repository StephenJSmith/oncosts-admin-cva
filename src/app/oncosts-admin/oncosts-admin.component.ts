import { ClassField } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  get isSuperannuationItemsValid(): boolean {
    return this.adminForm.controls.superannuation.valid;
  }

  get isOtherItemsValid(): boolean {
    return this.adminForm.controls.other.valid;
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
    })
  }

  populateOncostsAdmin() {

  }

  addTaxesItem() {

  }

  addSuperannuationItem() {

  }

  addOtherItems() {

  }

  onSaveChanges() {
    this.adminForm.markAsPristine();
    console.log(this.adminForm.value);
  }

  onCancel() {}
}
