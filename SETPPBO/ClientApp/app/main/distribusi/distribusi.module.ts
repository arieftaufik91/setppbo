import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { Routes, RouterModule } from '@angular/router';
import { DistribusiListComponent } from './components/distribusi-list/distribusi-list.component';
import { DistribusiComponent } from './components/distribusi/distribusi.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '../../core/layout/layout.module';
import { PusintekUiModule } from '../../shared/pusintek-ui/pusintek-ui.module';
import { DistribusiRekapComponent } from './components/distribusi-rekap/distribusi-rekap.component';
import { DistribusiRekapFormComponent } from './components/distribusi-rekap-form/distribusi-rekap-form.component';
import { DistribusiRekapDetailComponent } from './components/distribusi-rekap-detail/distribusi-rekap-detail.component';
import { MatDialogModule, MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { WingModule } from '../../shared/wing/wing.module';

const routes: Routes = [
  {
    path: "distribusi",
    component: DistribusiComponent,
    data: {
        breadcrumbs: "Beban Kerja"
    }
  },
  {
    path: "proses-distribusi",
    component: DistribusiListComponent,
    data: {
        breadcrumbs: "Proses Distribusi"
    }
  },
  {
    path: "rekap-distribusi",
    component: DistribusiRekapComponent,
    data: {
        breadcrumbs: "Rekap Distribusi"
    }
  },
];

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    LayoutModule,
    FlexLayoutModule,
    PusintekUiModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    WingModule
  ],
  declarations: [DistribusiComponent, DistribusiListComponent, DistribusiRekapComponent, DistribusiRekapFormComponent, DistribusiRekapDetailComponent],
  entryComponents: [DistribusiRekapFormComponent, DistribusiRekapDetailComponent]
})
export class DistribusiModule { }
