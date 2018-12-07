import { NgModule,Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefmajelisComponent } from './components/refmajelis/refmajelis.component';
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
  MatSelectModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RefmajelisFormComponent } from './components/refmajelis-form/refmajelis-form.component';


const routes: Routes = [
  {
    path: "refmajelis",
    component: RefmajelisComponent,
    data: {
        breadcrumbs: "Referensi Majelis"
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
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
    PusintekUiModule,
    MatSelectModule,
    ReactiveFormsModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule,
  ],
  declarations: [RefmajelisComponent, RefmajelisFormComponent
  ],
  entryComponents: [
    RefmajelisFormComponent
    ]
})
export class RefmajelisModule { }
