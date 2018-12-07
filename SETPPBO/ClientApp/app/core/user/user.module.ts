import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { MatListModule, MatChipsModule, MatCardModule, MatButtonModule, MatExpansionModule, MatInputModule, MatSlideToggleModule, MatIconModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataListModule } from 'primeng/primeng';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LayoutModule } from "../layout/layout.module";
import { PusintekUiModule } from '../../shared/pusintek-ui/pusintek-ui.module';

@NgModule({
    declarations: [
        UserListComponent,
        UserFormComponent,
        UserDetailComponent
    ],
    imports: [
        BrowserModule,
        MatListModule,
        LayoutModule,
        // material modules
        MatDialogModule,
        MatChipsModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatListModule,
        MatExpansionModule,
        MatInputModule,
        MatSlideToggleModule,
        DataListModule,
        NgxDatatableModule,
        MatDialogModule,
        PusintekUiModule
    ],
    providers: [
    ],
})
export class UserModule { }
