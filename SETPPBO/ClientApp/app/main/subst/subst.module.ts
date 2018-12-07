import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstListComponent } from './components/subst-list/subst-list.component';
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
  MatNativeDateModule,
  MatTabsModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
//import { QuoteFormComponent } from "./components/quote-form/quote-form.component";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {DatePipe} from '@angular/common';
import { SubstFormComponent } from './components/subst-form/subst-form.component';
import { SubstViewComponent } from './components/subst-view/subst-view.component';
import { SubstValidasiComponent } from './components/subst-validasi/subst-validasi.component';
import { SubstDetailComponent } from './components/subst-detail/subst-detail.component';
import { SubstEditComponent } from './components/subst-edit/subst-edit.component';
import { DropdownModule } from 'primeng/components/dropdown/dropdown'


const routes: Routes = [
  {
    path: "subst",    
    component: SubstListComponent,
    data: {
        breadcrumbs: "Daftar Surat Uraian Banding/Gugatan"
    }
  },
  {
    path: "subst-validasi",    
    component: SubstValidasiComponent,
    data: {
        breadcrumbs: "Daftar Validasi Surat Uraian Banding/Gugatan"
    }
  }
];

@NgModule({
  providers: [DatePipe],
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
    MatSelectModule,
    MatDatepickerModule, 
    MatNativeDateModule, 
    PusintekUiModule,
    ReactiveFormsModule,
    MatTabsModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule,
    DropdownModule
  ],
  declarations: [SubstListComponent, SubstFormComponent, SubstViewComponent, SubstValidasiComponent, SubstDetailComponent, SubstEditComponent],
  entryComponents: [SubstFormComponent, SubstViewComponent, SubstEditComponent, SubstDetailComponent]
})
export class SubstModule { }
