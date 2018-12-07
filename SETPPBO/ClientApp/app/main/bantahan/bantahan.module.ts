import { NgModule,Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BantahanListComponent } from './components/bantahan-list/bantahan-list.component';
import { Routes, RouterModule } from "@angular/router";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BantahanFormComponent } from './components/bantahan-form/bantahan-form.component';
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
  MatNativeDateModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BantahanDetailComponent } from './components/bantahan-detail/bantahan-detail.component';
import { ValidasiBantahanListComponent } from './components/validasi-bantahan-list/validasi-bantahan-list.component';
import { ValidasiBantahanFormComponent } from './components/validasi-bantahan-form/validasi-bantahan-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BantahanEditComponent } from './components/bantahan-edit/bantahan-edit.component';
import { BantahanDownloadComponent } from './components/bantahan-download/bantahan-download.component';
const routes: Routes = [
  {
    path: "Bantahan",
    component: BantahanListComponent,
    data: {
        breadcrumbs: "Data Bantahan"
    }
  },
  {
    path: "Validasi-Bantahan",
    component: ValidasiBantahanListComponent,
    data: {
        breadcrumbs: "Validasi Bantahan"
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
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    // PDFExportModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule
    

  ],
  declarations: [BantahanListComponent,
  BantahanFormComponent,
  BantahanDetailComponent,
  ValidasiBantahanListComponent,
  ValidasiBantahanFormComponent,
  BantahanEditComponent,
  BantahanDownloadComponent]
  ,entryComponents:[
  BantahanFormComponent,BantahanEditComponent,BantahanDownloadComponent,BantahanDetailComponent,ValidasiBantahanFormComponent]
})
export class BantahanModule { }
