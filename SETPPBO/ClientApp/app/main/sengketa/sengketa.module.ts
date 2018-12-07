import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from "@angular/router";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatTabsModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SengketaListComponent } from '../sengketa/component/sengketa-list/sengketa-list.component';

const routes = [
  {
    path: "sengketa",
    component: SengketaListComponent,
    data: {
      breadcrumbs: "Daftar Sengketa"
    }
  }
  

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    FormsModule,
    LayoutModule,
    NgxDatatableModule,
    FlexLayoutModule,
    /* MATERIAL MODULES */
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatDatepickerModule,
    PusintekUiModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTabsModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule,
  ],
  declarations: [SengketaListComponent],
  providers: []
})
export class SengketaModule { }
