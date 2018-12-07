import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenetapanComponent } from './components/penetapan/penetapan.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LayoutModule } from '../../core/layout/layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { PencabutanDetailComponent } from './components/pencabutan-detail/pencabutan-detail.component';
import { MatIconModule, MatDialogModule, MatButtonModule, MatInputModule, MatTooltipModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCardModule } from '@angular/material';
import { PusintekUiModule } from '../../shared/pusintek-ui/pusintek-ui.module';
import { ReactiveFormsModule } from '@angular/forms';
//import { PencabutanFormComponent } from './components/pencabutan-form/pencabutan-form.component';
//import { ValidasiPencabutanListComponent } from './components/validasi-pencabutan-list/validasi-pencabutan-list.component';
//import { ValidasiPencabutanFormComponent } from './components/validasi-pencabutan-form/validasi-pencabutan-form.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PenetapanAddComponent } from './components/penetapan-add/penetapan-add.component';
import { PenetapanAddDetailComponent } from './components/penetapan-add-detail/penetapan-add-detail.component';
import { PenetapanPencabutanComponent } from './components/penetapan-pencabutan/penetapan-pencabutan.component';
import { PenetapanPencabutanAddComponent } from './components/penetapan-pencabutan-add/penetapan-pencabutan-add.component';
import { PenetapanPencabutanAddDetailComponent } from './components/penetapan-pencabutan-add-detail/penetapan-pencabutan-add-detail.component';
import { PenetapanEditComponent } from './components/penetapan-edit/penetapan-edit.component';
import { PenetapanEditDetailComponent } from './components/penetapan-edit-detail/penetapan-edit-detail.component';
import { PenetapanAcComponent } from './components/penetapan-ac/penetapan-ac.component';
import { PenetapanAcAddComponent } from './components/penetapan-ac-add/penetapan-ac-add.component';
import { PenetapanAcAddDetailComponent } from './components/penetapan-ac-add-detail/penetapan-ac-add-detail.component';
import { PenetapanAcEditComponent } from './components/penetapan-ac-edit/penetapan-ac-edit.component';
import { PenetapanAcEditDetailComponent } from './components/penetapan-ac-edit-detail/penetapan-ac-edit-detail.component';
import { PenetapanPencabutanEditComponent } from './components/penetapan-pencabutan-edit/penetapan-pencabutan-edit.component';
import { PenetapanPencabutanEditDetailComponent } from './components/penetapan-pencabutan-edit-detail/penetapan-pencabutan-edit-detail.component';
import { PenetepaanPencabutanEditTermohonComponent } from './components/penetepaan-pencabutan-edit-termohon/penetepaan-pencabutan-edit-termohon.component';

const routes: Routes = [
  {
    path: "penetapanac",
    component: PenetapanAcComponent,
    data: {
        breadcrumbs: "Penetapan AC"
    }
  }, 
  {
    path: "penetapanacadd",
    component: PenetapanAcAddDetailComponent,
    data: {
        breadcrumbs: "Perekaman Penetapan AC"
    }
  }, 
  
  {
    path: "penetapanacedit/:id",
    component: PenetapanAcEditDetailComponent,
    data: {
        breadcrumbs: "Perekaman Penetapan AC"
    }
  },
  {
    path: "penetapan",
    component: PenetapanComponent,
    data: {
        breadcrumbs: "Penetapan"
    }
  }, 
  {
    path: "penetapanadd",
    component: PenetapanAddDetailComponent,
    data: {
        breadcrumbs: "Perekaman Penetapan"
    }
  }, 
  
  {
    path: "penetapanedit/:id",
    component: PenetapanEditDetailComponent,
    data: {
        breadcrumbs: "Perekaman Penetapan"
    }
  },
  {
    path: "penetapanpencabutan",
    component: PenetapanPencabutanComponent,
    data: {
        breadcrumbs: "Penetapan Pencabutan"
    }
  },
  {
    path: "penetapanpencabutanadd",
    component: PenetapanPencabutanAddDetailComponent,
    data: {
        breadcrumbs: "Perekaman Penetapan Pencabutan"
    }
  },
  {
    path: "penetapanpencabutanedit/:id",
    component: PenetapanPencabutanEditDetailComponent,
    data: {
        breadcrumbs: "Perekaman Penetapan Pencabutan"
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
  declarations: [PenetapanComponent, PenetapanAddComponent, PenetapanAddDetailComponent, PenetapanPencabutanComponent, PenetapanPencabutanAddComponent, PenetapanPencabutanAddDetailComponent,  PenetapanEditComponent, PenetapanEditDetailComponent, PenetapanAcComponent, PenetapanAcAddComponent, PenetapanAcAddDetailComponent, PenetapanAcEditComponent, PenetapanAcEditDetailComponent, PenetapanPencabutanEditComponent, PenetapanPencabutanEditDetailComponent, PenetepaanPencabutanEditTermohonComponent],
  entryComponents: [PenetapanAddComponent, PenetapanPencabutanAddComponent, PenetepaanPencabutanEditTermohonComponent]
})
export class PenetapanModule { }
