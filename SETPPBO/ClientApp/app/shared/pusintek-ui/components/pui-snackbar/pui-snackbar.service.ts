import { Injectable } from "@angular/core";
import { PuiSnackbarComponent } from "./pui-snackbar.component";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class PuiSnackbarService {
  constructor(public snackBar: MatSnackBar) {}

  showSnackBar(type: string = "success", msg: string = "") {
    if (type == "success") {
      msg = msg == "" ? "Simpan Berhasil" : msg;
    } else if (type == "error") {
      msg = msg == "" ? "Simpan Gagal" : msg;
    }
    let snackBarRef = this.snackBar.openFromComponent(PuiSnackbarComponent, {
      duration: 3000,
      data: { type: type, msg: msg }
    });
  }
}
