import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
//~ components
import { PemohonComponent } from './components/pemohon/pemohon.component';
import { PemohonFormComponent } from './components/pemohon-form/pemohon-form.component';
import { PemohonRegistrationFormComponent } from './components/pemohon-registration-form/pemohon-registration-form.component';
import { PemohonVerificationComponent } from './components/pemohon-verification/pemohon-verification.component';
import { PemohonVerificationFormComponent } from './components/pemohon-verification-form/pemohon-verification-form.component';
import { PemohonDetailComponent } from './components/pemohon-detail/pemohon-detail.component';
//~
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropdownModule } from 'primeng/components/dropdown/dropdown'; //~ primeng p-dropdown

const routes: Routes = [
  {
    path: "pemohon",
    component: PemohonComponent,
    data: {
      breadcrumbs: "Pemohon"
    }
  },
  {
    path: "pemohon-verifikasi",
    component: PemohonVerificationComponent,
    data: {
      breadcrumbs: "Pemohon"
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
    ReactiveFormsModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
      BrowserAnimationsModule,
    //~
    DropdownModule
  ],
  declarations: [PemohonVerificationFormComponent, PemohonRegistrationFormComponent, PemohonFormComponent, PemohonComponent, PemohonVerificationComponent, PemohonDetailComponent],
    entryComponents: [PemohonVerificationFormComponent, PemohonRegistrationFormComponent, PemohonFormComponent, PemohonDetailComponent]
})
export class PemohonModule { }
