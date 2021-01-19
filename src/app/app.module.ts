import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OncostsAdminComponent } from './oncosts-admin/oncosts-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    OncostsAdminComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
