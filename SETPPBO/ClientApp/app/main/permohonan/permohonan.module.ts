import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermohonanListComponent } from './components/permohonan-list/permohonan-list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../core/layout/layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatTooltipModule, MatDialogModule, MatSelectModule, MatDatepicker, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { PusintekUiModule } from '../../shared/pusintek-ui/pusintek-ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { PermohonanFormComponent } from './components/permohonan-form/permohonan-form.component';
import { PermohonanViewComponent } from './components/permohonan-view/permohonan-view.component';
import { PermohonanTabComponent } from './components/permohonan-tab/permohonan-tab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PermohonanInformationComponent } from './components/permohonan-information/permohonan-information.component';
import { PermohonanDocumentComponent } from './components/permohonan-document/permohonan-document.component';
import { PermohonanValidasiTabComponent } from './components/permohonan-validasi-tab/permohonan-validasi-tab.component';
import { PermohonanValidasiInformationComponent } from './components/permohonan-validasi-information/permohonan-validasi-information.component';
import { PermohonanPemeriksaanTabComponent } from './components/permohonan-pemeriksaan-tab/permohonan-pemeriksaan-tab.component';
import { PermohonanPemeriksaanInformationComponent } from './components/permohonan-pemeriksaan-information/permohonan-pemeriksaan-information.component';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { WingModule } from '../../shared/wing/wing.module';
import { PermohonanValidasiListComponent } from './components/permohonan-validasi-list/permohonan-validasi-list.component';

const routes = [
    {
        path: "permohonan",
        children: [
            {
                path: "",
                component: PermohonanListComponent,
                data: {
                    breadcrumbs: true,
                    text: "Daftar"
                },
            },
            {
                path: "validasi",
                component: PermohonanValidasiListComponent,
                data: {
                    breadcrumbs: true,
                    text: "Daftar"
                },
            },
            {
                path: "add",
                component: PermohonanFormComponent,
                data: {
                    breadcrumbs: true,
                    text: "Tambah"
                }
            },
            {
                path: "edit/:id",
                component: PermohonanTabComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
                }
            },
            {
                path: "editValidasi/:id",
                component: PermohonanValidasiTabComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
                }
            },
            {
                path: "editPemeriksaan/:id",
                component: PermohonanPemeriksaanTabComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
                }
            },
            {
                path: "information/:id",
                component: PermohonanInformationComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
                }
            },
            {
                path: "informationValidasi/:id",
                component: PermohonanValidasiInformationComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
                }
            },
            {
                path: "informationPemeriksaan/:id",
                component: PermohonanPemeriksaanInformationComponent,
                data: {
                    breadcrumbs: true,
                    text: 'Ubah'
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
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        PusintekUiModule,
        ReactiveFormsModule,
        MatTabsModule,
        /* ANIMATIONS MODULE */
        BrowserModule,
        BrowserAnimationsModule,
        DropdownModule,
        WingModule
    ],
    declarations: [PermohonanListComponent, PermohonanFormComponent, PermohonanViewComponent, PermohonanTabComponent, PermohonanInformationComponent, PermohonanDocumentComponent, PermohonanValidasiTabComponent, PermohonanValidasiInformationComponent, PermohonanPemeriksaanTabComponent, PermohonanPemeriksaanInformationComponent, PermohonanValidasiListComponent],
    entryComponents: [PermohonanFormComponent, PermohonanViewComponent, PermohonanTabComponent]
})
export class PermohonanModule { }
