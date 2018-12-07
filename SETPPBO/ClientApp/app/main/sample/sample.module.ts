import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SampleComponent } from "./components/sample/sample.component";
import { Routes, RouterModule } from "@angular/router";
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
import { QuoteFormComponent } from "./components/quote-form/quote-form.component";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const routes: Routes = [
  {
    path: "sample",
    component: SampleComponent,
    data: {
        breadcrumbs: "Sample Data"
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
  declarations: [SampleComponent, QuoteFormComponent],
  entryComponents: [QuoteFormComponent]
})
export class SampleModule {}
