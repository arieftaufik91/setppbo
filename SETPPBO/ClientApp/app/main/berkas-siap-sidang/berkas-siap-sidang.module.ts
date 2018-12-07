import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BerkasSiapSidangListComponent } from './components/berkas-siap-sidang-list/berkas-siap-sidang-list.component';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule,
} from "@angular/material";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const routes: Routes = [
  {
    path: "siapsidang",
    component: BerkasSiapSidangListComponent,
    data: {
        breadcrumbs: "Daftar Berkas Siap Sidang"
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
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
    
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [BerkasSiapSidangListComponent]
})
export class BerkasSiapSidangModule { }
