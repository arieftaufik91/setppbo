import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlexLayoutModule } from "@angular/flex-layout";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";

import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataTambahanPermohonanComponent } from '../data-tambahan/components/data-tambahan-permohonan/data-tambahan-permohonan.component';
import { DataTambahanListComponent } from './components/data-tambahan-list/data-tambahan-list.component';
import { DataTambahanFormComponent } from './components/data-tambahan-form/data-tambahan-form.component';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatTooltipModule, MatDialogModule, MatSelectModule, MatDatepicker, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { DataTambahanUploadComponent } from './components/data-tambahan-upload/data-tambahan-upload.component';
import { DataTambahanKonfirmasiComponent } from './components/data-tambahan-konfirmasi/data-tambahan-konfirmasi.component';
import { DataTambahanDetailComponent } from './components/data-tambahan-detail/data-tambahan-detail.component';
import { ValidasiDataTambahanFormComponent } from './components/validasi-data-tambahan-form/validasi-data-tambahan-form.component';
import { ValidasiDataTambahanListComponent } from './components/validasi-data-tambahan-list/validasi-data-tambahan-list.component';
import { TandaTerimaPencabutanComponent } from "./components/data-tambahan-tt/tanda-terima-pencabutan.component";
import { TesArrayComponent } from "./components/tes-array/tes-array.component";
import { TesDataComponent } from "./components/tes-data/tes-data.component";
import { TesUploadComponent } from "./components/tes-upload/tes-upload.component";
import { UploadComponent } from "./components/upload/upload.component";
import { SnackbarComponent } from "../../shared/snackbar/snackbar.component";


const routes: Routes = [
  {   path: "datatambahan",    
      component: DataTambahanPermohonanComponent,    
      data: {
          breadcrumbs: "Daftar Data Tambahan"    
      }  
  },
  {   path: "datatambahan/:id",    
      component: DataTambahanListComponent,    
      data: {        
          breadcrumbs: "Daftar Surat Pengantar"    
      }  
  },
  {   
      path :"datatambahanupload/:id", 
      component: DataTambahanUploadComponent, 
      data : { 
          breadcrumbs: "Entry Data Tambahan"
      }
  },
  {   
      path :"data-tambahan-detail", 
      component: DataTambahanDetailComponent, 
      data : { 
          breadcrumbs: "Detail Data Tambahan"
      }
  }, 
  {   
    path :"datatambahanvalidasi", 
    component: ValidasiDataTambahanListComponent, 
    data : { 
        breadcrumbs: "Validasi Data Tambahan"
    }
}, 
  {
      path :"datatambahantt/:id" , 
      component: DataTambahanKonfirmasiComponent, 
      data : { 
          breadcrumbs: "Tanda Terima Data Tambahan"
        }} 
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
    MatSelectModule,
    MatDatepickerModule, 
    MatNativeDateModule,      
    PusintekUiModule,
    ReactiveFormsModule,
    /* ANIMATIONS MODULE */
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
    

  ],
  declarations: [
      DataTambahanPermohonanComponent, 
      DataTambahanListComponent, 
      DataTambahanFormComponent,
      DataTambahanUploadComponent,
      DataTambahanDetailComponent,
      DataTambahanKonfirmasiComponent,
      ValidasiDataTambahanFormComponent,
      ValidasiDataTambahanListComponent,
      TandaTerimaPencabutanComponent,
      TesArrayComponent,
      TesDataComponent,
      TesUploadComponent,
      UploadComponent,
      SnackbarComponent
],
  entryComponents: [
    DataTambahanFormComponent,
    DataTambahanDetailComponent,
    ValidasiDataTambahanFormComponent
  ]
})
export class DataTambahanModule {}
