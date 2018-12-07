import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { SampleModule } from "./sample/sample.module";
import { PermohonanModule } from './permohonan/permohonan.module';
import { ReferensiModule } from './referensi/referensi.module';
import { BerkasSidangModule } from "./berkas-sidang/berkas-sidang.module";
import { SubstModule } from "./subst/subst.module";
import { DashboardModule } from './dashboard/dashboard.module';
import { PencabutanModule } from './pencabutan/pencabutan.module';
import { PemohonModule } from './pemohon/pemohon.module';
import { DistribusiModule } from './distribusi/distribusi.module';
import { DataTambahanModule } from './data-tambahan/data-tambahan.module';
import { PemeriksaanAwalModule } from './pemeriksaan-awal/pemeriksaan-awal.module';
import { BantahanModule } from './bantahan/bantahan.module';
import { AdministrasiBandingGugatanModule } from "./administrasi-banding-gugatan/administrasi-banding-gugatan.module";
import { AbgModule } from './abg/abg.module';
import { BerkasSiapSidangModule } from './berkas-siap-sidang/berkas-siap-sidang.module';
import { PenetapanModule } from './penetapan/penetapan.module'
import { AuditModule } from './audit/audit.module';
import { SengketaModule } from './sengketa/sengketa.module';


@NgModule({
    imports: [
        CommonModule,
        HomeModule,
        SampleModule,
        PemohonModule,
        PermohonanModule,
        PemeriksaanAwalModule,
        BerkasSidangModule,
        SubstModule,
        ReferensiModule,
        DashboardModule,
        PencabutanModule,
        DistribusiModule,
        DataTambahanModule,
        BantahanModule,
        AdministrasiBandingGugatanModule,
        AbgModule,
        BerkasSiapSidangModule,
        PenetapanModule,
        AuditModule,
        SengketaModule
    ],
    declarations: []
})
export class MainModule { }
