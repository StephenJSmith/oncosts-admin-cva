import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OncostsAdminComponent } from './oncosts-admin/oncosts-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OncostsItemComponent } from './oncosts-admin/oncosts-item/oncosts-item.component';

@NgModule({
  declarations: [
    AppComponent,
    OncostsAdminComponent,
    OncostsItemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
