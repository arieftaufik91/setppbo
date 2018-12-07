import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
//~ components
import { AuditUserComponent } from './components/audit-user/audit-user.component';
import { AuditUserDetailComponent } from './components/audit-user-detail/audit-user-detail.component';
import { AuditSengketaComponent } from './components/audit-sengketa/audit-sengketa.component';
import { AuditSengketaDetailComponent } from './components/audit-sengketa-detail/audit-sengketa-detail.component';
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

const routes: Routes = [
  {
    path: "audit-sengketa",
    component: AuditSengketaComponent,
    data: {
      breadcrumbs: "Audit Sengketa"
    }
  },
  {
    path: "audit-user",
    component: AuditUserComponent,
    data: {
      breadcrumbs: "Audit User"
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
    BrowserAnimationsModule
  ],
    declarations: [AuditSengketaComponent, AuditUserComponent, AuditUserDetailComponent, AuditSengketaDetailComponent],
    entryComponents: [AuditUserDetailComponent, AuditSengketaDetailComponent]
})
export class AuditModule { }
