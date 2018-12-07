import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: "pui-confirm-dialog",
  templateUrl: "./pui-confirm-dialog.component.html"
})
export class PuiConfirmDialogComponent {
  public title: string;
  public message: string;

  constructor(public dialogRef: MatDialogRef<PuiConfirmDialogComponent>) {}
}