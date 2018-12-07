import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogsService } from './dialogs.service';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [ConfirmDialogComponent],
    exports: [ConfirmDialogComponent],
    entryComponents: [ConfirmDialogComponent],
    providers: [DialogsService]
})
export class DialogsModule { }