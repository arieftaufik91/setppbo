import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
  MatCheckbox
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RefjenisnormawaktuComponent  } from "./components/referensi-jenisNormaWaktu/referensi-jenisNormaWaktu.component";
import { RefjenisnormawaktuFormComponent } from "./components/referensi-jenisNormaWaktu-form/referensi-jenisNormaWaktu-form.component";
import { RefnormawaktuComponent  } from "./components/referensi-normaWaktu/referensi-normaWaktu.component";
import { RefnormawaktuFormComponent } from "./components/referensi-normaWaktu-form/referensi-normaWaktu-form.component";
import { ReferensiDokumenlistComponent } from "./components/referensi-dokumenlist/referensi-dokumenlist.component";
import { ReferensiDokumenformComponent } from "./components/referensi-dokumenform/referensi-dokumenform.component";
import { ReferensiMajelisComponent } from './components/referensi-majelis/referensi-majelis.component';
import { ReferensiMajelisformComponent } from './components/referensi-majelisform/referensi-majelisform.component';
import { RefAlasanComponent } from './components/ref-alasan/ref-alasan.component';
import { RefAlasanFormComponent } from './components/ref-alasan-form/ref-alasan-form.component';
import { RefConfigComponent } from './components/ref-config/ref-config.component';
import { RefConfigFormComponent } from './components/ref-config-form/ref-config-form.component';
import { ReferensiTemplateListComponent } from './components/referensi-template-list/referensi-template-list.component';
import { ReferensiTemplateFormComponent } from './components/referensi-template-form/referensi-template-form.component';
import { ReferensiJenisKetetapanComponent } from './components/referensi-jenis-ketetapan/referensi-jenis-ketetapan.component';
import { ReferensiJenisKetetapanFormComponent } from './components/referensi-jenis-ketetapan-form/referensi-jenis-ketetapan-form.component';
import { RefHakimComponent } from './components/ref-hakim/ref-hakim.component';
import { RefHakimFormComponent } from './components/ref-hakim-form/ref-hakim-form.component';
import { RefPenandatanganComponent } from './components/ref-penandatangan/ref-penandatangan.component';
import { RefPenandatanganFormComponent } from './components/ref-penandatangan-form/ref-penandatangan-form.component';
import { RefKodeTermohonComponent } from './components/ref-kode-termohon/ref-kode-termohon.component';
import { RefKodeTermohonFormComponent } from './components/ref-kode-termohon-form/ref-kode-termohon-form.component';
import { RefJenisPenomoranComponent } from './components/ref-jenis-penomoran/ref-jenis-penomoran.component';
import { RefJenisPenomoranFormComponent } from './components/ref-jenis-penomoran-form/ref-jenis-penomoran-form.component';
import { RefPenomoranComponent } from './components/ref-penomoran/ref-penomoran.component';
import { RefPenomoranFormComponent } from './components/ref-penomoran-form/ref-penomoran-form.component';
import { RefCaraKirimComponent } from './components/ref-cara-kirim/ref-cara-kirim.component';
import { RefCaraKirimFormComponent } from './components/ref-cara-kirim-form/ref-cara-kirim-form.component';
import { ReferensiJenisPajakComponent } from './components/referensi-jenis-pajak/referensi-jenis-pajak.component';
import { ReferensiJenisPajakFormComponent } from './components/referensi-jenis-pajak-form/referensi-jenis-pajak-form.component';
import { ReferensiPermohonanComponent } from './components/referensi-permohonan/referensi-permohonan.component';
import { WingModule } from '../../shared/wing/wing.module';
import { ReferensiPermohonanFormComponent } from './components/referensi-permohonan-form/referensi-permohonan-form.component';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';

const routes: Routes = [
  {    path: "refjenisnormatwaktu",    component: RefjenisnormawaktuComponent,    data: {        breadcrumbs: "refjenisnormatwaktu"    }},
  { path: "refnormawaktu",    component: RefnormawaktuComponent,    data: {        breadcrumbs: "refnormawaktu"    }},
  { path: "refdokumen",    component: ReferensiDokumenlistComponent,    data: {        breadcrumbs: "Referensi Kelengkapan Banding dan Gugatan"    }},
  { path: "refmajelis",   component: ReferensiMajelisComponent,   data: {        breadcrumbs: "Referensi Majelis" }},
  { path: "refjenisketetapan",   component: ReferensiJenisKetetapanComponent,   data: {        breadcrumbs: "Referensi Jenis Ketetapan" }},
    { path: "ref-alasan", component: RefAlasanComponent, data: { breadcrumbs: "Referensi Alasan" } },
    { path: "ref-config", component: RefConfigComponent, data: { breadcrumbs: "Referensi Config" } },
    { path: "ref-hakim", component: RefHakimComponent, data: { breadcrumbs: "Referensi Hakim" } },
    { path: "reftemplate", component: ReferensiTemplateListComponent, data: { breadcrumbs: "Referensi Template" } },
    { path: "ref-ttd", component: RefPenandatanganComponent, data: { breadcrumbs: "Referensi TTD" } },
    { path: "ref-kode-termohon", component: RefKodeTermohonComponent, data: { breadcrumbs: "Referensi Kode Termohon" } },
    { path: "refjenispenomoran", component: RefJenisPenomoranComponent, data: { breadcrumbs: "Referensi Jenis Penomoran" } },
    { path: "refpenomoran", component: RefPenomoranComponent, data: { breadcrumbs: "Referensi Penomoran" } },
    { path: "refcarakirim", component: RefCaraKirimComponent, data: { breadcrumbs: "Referensi Cara Kirim" } },
    { path: "refjenispajak", component: ReferensiJenisPajakComponent, data: { breadcrumbs: "Referensi Jenis Pajak" } },
    { path: "refpermohonan", component: ReferensiPermohonanComponent, data: { breadcrumbs: "Referensi Permohonan" } }

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
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule,
    WingModule,
    DropdownModule
  ],
  declarations: [RefjenisnormawaktuComponent, 
      RefjenisnormawaktuFormComponent, RefnormawaktuComponent, RefnormawaktuFormComponent, ReferensiDokumenlistComponent, ReferensiDokumenformComponent, ReferensiMajelisComponent, ReferensiMajelisformComponent, RefAlasanComponent, RefAlasanFormComponent, RefConfigComponent, RefConfigFormComponent, ReferensiTemplateListComponent, ReferensiTemplateFormComponent, ReferensiJenisKetetapanComponent, ReferensiJenisKetetapanFormComponent, RefHakimComponent, RefHakimFormComponent, RefPenandatanganComponent, RefPenandatanganFormComponent, RefKodeTermohonComponent, RefKodeTermohonFormComponent, RefJenisPenomoranComponent, RefJenisPenomoranFormComponent, RefPenomoranComponent, RefPenomoranFormComponent, RefCaraKirimComponent, RefCaraKirimFormComponent, ReferensiJenisPajakFormComponent, ReferensiJenisPajakComponent, ReferensiPermohonanComponent, ReferensiPermohonanFormComponent
],
  entryComponents: [
      RefjenisnormawaktuFormComponent, RefnormawaktuFormComponent, ReferensiDokumenformComponent, ReferensiMajelisformComponent, RefAlasanFormComponent, RefConfigFormComponent, ReferensiTemplateFormComponent, ReferensiJenisKetetapanFormComponent, RefHakimFormComponent, RefPenandatanganFormComponent, RefKodeTermohonFormComponent, RefJenisPenomoranFormComponent, RefPenomoranFormComponent, RefCaraKirimFormComponent, ReferensiJenisPajakFormComponent , ReferensiPermohonanFormComponent
    ]
})


export class ReferensiModule { }

