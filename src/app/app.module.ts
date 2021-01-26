import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OncostsAdminComponent } from './oncosts-admin/oncosts-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OncostsItemComponent } from './oncosts-admin/oncosts-item/oncosts-item.component';
import { OncostsCategoryComponent } from './oncosts-admin/oncosts-category/oncosts-category.component';
import { OncostsAmountComponent } from './oncosts-admin/oncosts-amount/oncosts-amount.component';

@NgModule({
  declarations: [
    AppComponent,
    OncostsAdminComponent,
    OncostsItemComponent,
    OncostsCategoryComponent,
    OncostsAmountComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
