import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { TreeModule, TreeNode, ContextMenuModule, PanelMenuModule, TreeTableModule } from 'primeng/primeng';
import { MatExpansionModule, MatInputModule, MatCardModule, MatButtonModule, MatListModule, MatChipsModule, MatDialogModule, MatRadioModule, MatSlideToggleModule, MatSelectModule, MatIconModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MenuFormComponent } from './components/menu-form/menu-form.component';
import { MenuDetailComponent } from './components/menu-detail/menu-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        TreeModule,
        ContextMenuModule,
        PanelMenuModule,
        MatExpansionModule,
        MatInputModule,
        NgxDatatableModule,
        TreeTableModule,
        MatCardModule,
        MatButtonModule,
        MatListModule,
        MatChipsModule,
        MatDialogModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatIconModule,
        MatCheckboxModule,
        FlexLayoutModule,
        MatTooltipModule
    ],
    declarations: [MenuListComponent, MenuFormComponent, MenuDetailComponent]
})
export class MenuModule { }
