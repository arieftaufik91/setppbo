import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Routes, RouterModule } from "@angular/router";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DashboardDaftarBerkasSudahDistribusiComponent } from './components/dashboard-daftar-berkas-sudah-distribusi/dashboard-daftar-berkas-sudah-distribusi.component';
import { DashboardDaftarBerkasMasukComponent } from './components/dashboard-daftar-berkas-masuk/dashboard-daftar-berkas-masuk.component';
import { DashboardDaftarBerkasBelumSiapSidangComponent } from './components/dashboard-daftar-berkas-belum-siap-sidang/dashboard-daftar-berkas-belum-siap-sidang.component';
import { DashboardDaftarBerkasSudahPenetapanComponent } from './components/dashboard-daftar-berkas-sudah-penetapan/dashboard-daftar-berkas-sudah-penetapan.component';
import { LayoutModule } from '../../core/layout/layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    data: {
        breadcrumbs: "Dashboard"
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    LayoutModule,
    FlexLayoutModule
  ],
  declarations: [
    DashboardComponent,
    DashboardDaftarBerkasMasukComponent, 
    DashboardDaftarBerkasBelumSiapSidangComponent, 
    DashboardDaftarBerkasSudahDistribusiComponent, 
    DashboardDaftarBerkasSudahPenetapanComponent
  ]
})
export class DashboardModule { }
