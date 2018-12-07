import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RoleListComponent } from "./components/role-list/role-list.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import {
  MatExpansionModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { RoleDetailComponent } from "./components/role-detail/role-detail.component";
import { RoleFormComponent } from "./components/role-form/role-form.component";
import { ActionRoleFormComponent } from "./components/action-role-form/action-role-form.component";
import { ActionRoleListComponent } from "./components/action-role-list/action-role-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../layout/layout.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    PusintekUiModule
  ],
  declarations: [
    RoleListComponent,
    RoleDetailComponent,
    RoleFormComponent,
    ActionRoleFormComponent,
    ActionRoleListComponent
  ]
})
export class RoleModule {}
