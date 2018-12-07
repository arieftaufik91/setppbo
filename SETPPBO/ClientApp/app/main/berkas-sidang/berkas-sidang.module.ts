import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { DaftarSengketaComponent } from './components/daftar-sengketa/daftar-sengketa.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ProsesSidangComponent } from "./components/proses-sidang/proses-sidang.component";
import { LayoutModule } from "../../core/layout/layout.module";
import { FlexLayoutModule } from "@angular/flex-layout";

const routes: Routes = [
  {
    path: "berkas-sidang",
    component: DaftarSengketaComponent,
    data: {
        breadcrumbs: "Berkas Sidang"
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    LayoutModule,
    FlexLayoutModule
  ],
  declarations: [DaftarSengketaComponent, ProsesSidangComponent]
})
export class BerkasSidangModule { }
