import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextFieldComponent } from './dashboard/text-field/text-field.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsComponent } from './dashboard/stats/stats.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    TextFieldComponent,
    DashboardComponent,
    StatsComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
