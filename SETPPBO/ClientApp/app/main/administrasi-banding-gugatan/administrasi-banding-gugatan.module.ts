import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { LayoutModule } from "../../core/layout/layout.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable/release";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PermintaanBantahanComponent } from "./components/permintaan-bantahan/permintaan-bantahan.component";
import { 
  MatIconModule, 
  MatButtonModule, 
  MatDialogModule, 
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatTabsModule,
  MatListModule,
  MatExpansionModule,
  MatCardModule,
  MatDatepickerModule,
  MatNativeDateModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WingModule } from "../../shared/wing/wing.module";
import { AdministrasiBandingGugatanComponent } from './components/administrasi-banding-gugatan/administrasi-banding-gugatan.component';
import { PenyampaianSalinanComponent } from "./components/penyampaian-salinan/penyampaian-salinan.component";
import { TandaTerimaSubstFormComponent } from '../abg/components/tanda-terima-subst/tanda-terima-subst-form/tanda-terima-subst-form.component';
import { GugatanMenuComponent } from './components/gugatan-menu/gugatan-menu.component';
import { TandaTerimaPermintaanComponent } from './components/tanda-terima-permintaan/tanda-terima-permintaan.component';
import { SharedDataService } from './services/shared-data.service';
import { DropdownModule } from 'primeng/components/dropdown/dropdown'


const routes: Routes = [{
  path     : "banding",
  children: [
    {
      path     : "",
      component: AdministrasiBandingGugatanComponent,
      data     : {breadcrumbs: true, text: "Administrasi Banding"},
    },
    {
      path     : "detail/:id",
      component: PermintaanBantahanComponent,
      data     : {breadcrumbs: true, text: "Permintaan Bantahan"},
    },
    //add link here for parent  
  ],
},
{
  path: "gugatan",
  children: [
    {
      path     : "",
      component: GugatanMenuComponent,
      data     : {breadcrumbs: true, text: "Administrasi Gugatan"},
    },
    {
      path     : "detail/:id",
      component: PermintaanBantahanComponent,
      data     : {breadcrumbs: true, text: "Permintaan Bantahan"},
    },
    //add link here for parent  
  ]
},];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    LayoutModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    WingModule,
    DropdownModule
  ],
  declarations: [PermintaanBantahanComponent, AdministrasiBandingGugatanComponent, PenyampaianSalinanComponent, TandaTerimaSubstFormComponent, GugatanMenuComponent, TandaTerimaPermintaanComponent],
  providers: [SharedDataService],
  entryComponents: [PermintaanBantahanComponent, PenyampaianSalinanComponent, TandaTerimaSubstFormComponent]
})
export class AdministrasiBandingGugatanModule { }
