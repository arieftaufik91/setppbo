import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaftarBandingGugatanListComponent } from './components/daftar-banding-gugatan/daftar-banding-gugatan-list/daftar-banding-gugatan-list.component';
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
import { DataCoverBerkasComponent } from './components/daftar-banding-gugatan/data-cover-berkas/data-cover-berkas.component';
import { TandaTerimaSubstListComponent } from './components/tanda-terima-subst/tanda-terima-subst-list/tanda-terima-subst-list.component';
import { TandaTerimaSubstFormComponent } from './components/tanda-terima-subst/tanda-terima-subst-form/tanda-terima-subst-form.component';
import { SharedDataService } from './services/shared-data.service';
import { GugatanListComponent } from './components/tanda-terima-subst/gugatan-list/gugatan-list.component';

const routes = [
  {
    path: "daftarbandinggugatan",
    component: DaftarBandingGugatanListComponent,
    data: {
      breadcrumbs: "Daftar Permohonan Banding dan Gugatan"
    }
  },
  
  {   
    path :"abg-form", 
    component: TandaTerimaSubstFormComponent, 
    data : { 
        breadcrumbs: "Administrasi Banding & Gugatan"
    }
},
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
  declarations: [DaftarBandingGugatanListComponent, DataCoverBerkasComponent, TandaTerimaSubstListComponent, GugatanListComponent],
  providers: [SharedDataService]
})
export class AbgModule { }
