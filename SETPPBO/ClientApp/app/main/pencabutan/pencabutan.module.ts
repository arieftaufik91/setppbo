import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PencabutanListComponent } from './components/pencabutan-list/pencabutan-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LayoutModule } from '../../core/layout/layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PencabutanDetailComponent } from './components/pencabutan-detail/pencabutan-detail.component';
import { MatIconModule, MatDialogModule, MatButtonModule, MatInputModule, MatTooltipModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCardModule } from '@angular/material';
import { PusintekUiModule } from '../../shared/pusintek-ui/pusintek-ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PencabutanFormComponent } from './components/pencabutan-form/pencabutan-form.component';
import { ValidasiPencabutanListComponent } from './components/validasi-pencabutan-list/validasi-pencabutan-list.component';
import { ValidasiPencabutanFormComponent } from './components/validasi-pencabutan-form/validasi-pencabutan-form.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PencabutanEditComponent } from './components/pencabutan-edit/pencabutan-edit.component';

const routes: Routes = [
  {
    path: "pencabutan",
    component: PencabutanListComponent,
    data: {
        breadcrumbs: "Perekaman Pencabutan"
    }
  },
  {
    path: "validasi-pencabutan",
    component: ValidasiPencabutanListComponent,
    data: {
        breadcrumbs: "Validasi Pencabutan"
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
    /* MATERIAL MODULEs */
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    PusintekUiModule,
    ReactiveFormsModule,
    //PDFExportModule,
    HttpClientModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [PencabutanListComponent, PencabutanDetailComponent, PencabutanFormComponent, ValidasiPencabutanListComponent, ValidasiPencabutanFormComponent, PencabutanEditComponent],
  entryComponents: [PencabutanDetailComponent, PencabutanFormComponent, ValidasiPencabutanFormComponent, PencabutanEditComponent]
})
export class PencabutanModule { }
