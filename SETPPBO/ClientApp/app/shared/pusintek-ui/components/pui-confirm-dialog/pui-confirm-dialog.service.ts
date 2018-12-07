import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PuiConfirmDialogComponent } from './pui-confirm-dialog.component';

@Injectable()
export class PuiConfirmDialogService {

    constructor(private dialog: MatDialog) { }

    public confirm(title: string, message: string): Observable<boolean> {

        let dialogRef: MatDialogRef<PuiConfirmDialogComponent>;

        dialogRef = this.dialog.open(PuiConfirmDialogComponent);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }
}