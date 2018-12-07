import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
//~ components
import { PemeriksaanAwalComponent } from './components/pemeriksaan-awal/pemeriksaan-awal.component';
import { PemeriksaanAwalDetailComponent } from './components/pemeriksaan-awal-detail/pemeriksaan-awal-detail.component';
//~
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
    MatTabsModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "../../core/layout/layout.module";
import { PusintekUiModule } from "../../shared/pusintek-ui/pusintek-ui.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { PemeriksaanAwalInformationComponent } from './components/pemeriksaan-awal-information/pemeriksaan-awal-information.component';
import { WingModule } from '../../shared/wing/wing.module';
const routes = [
    {
        path: "pemeriksaan-awal",
        children: [
            {
                path: "",
                component: PemeriksaanAwalComponent,
                data: {
                    breadcrumbs: true,
                    text: "Daftar"
                },
            },
            {
                path: "edit/:id",
                component: PemeriksaanAwalDetailComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
                }
            },
            {
                path: "information/:id",
                component: PemeriksaanAwalInformationComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Kirim'
                }
            },
        ]
    },
]

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
        MatDatepickerModule,
        MatTooltipModule,
        MatDialogModule,
        PusintekUiModule,
        ReactiveFormsModule,
        DropdownModule,
        MatSelectModule,
        MatTabsModule,
        /* ANIMATIONS MODULE */
        BrowserModule,
        BrowserAnimationsModule,
        WingModule
    ],
    declarations: [PemeriksaanAwalComponent, PemeriksaanAwalDetailComponent, PemeriksaanAwalInformationComponent],
    entryComponents: [PemeriksaanAwalDetailComponent]
})
export class PemeriksaanAwalModule { }
