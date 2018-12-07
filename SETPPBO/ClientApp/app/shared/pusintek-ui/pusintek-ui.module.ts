import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule, MatButtonModule, MatIconModule } from '@angular/material';
import { PuiConfirmDialogService } from './components/pui-confirm-dialog/pui-confirm-dialog.service';
import { PuiConfirmDialogComponent } from './components/pui-confirm-dialog/pui-confirm-dialog.component';
import { PuiSnackbarComponent } from './components/pui-snackbar/pui-snackbar.component';
import { PuiSnackbarService } from './components/pui-snackbar/pui-snackbar.service';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [PuiConfirmDialogComponent, PuiSnackbarComponent],
  exports: [PuiConfirmDialogComponent],
  entryComponents: [PuiConfirmDialogComponent, PuiSnackbarComponent],
  providers: [PuiConfirmDialogService, PuiSnackbarService]
})
export class PusintekUiModule {}
