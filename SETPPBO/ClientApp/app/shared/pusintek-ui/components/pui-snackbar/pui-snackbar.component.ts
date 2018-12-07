import { Component, OnInit, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";

@Component({
  templateUrl: "./pui-snackbar.component.html",
  styleUrls: ["./pui-snackbar.component.css"]
})
export class PuiSnackbarComponent implements OnInit {
  icon: string;
  snackbarClass: string;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snRef: MatSnackBarRef<PuiSnackbarComponent>
  ) {}
  ngOnInit(): void {
    if (this.data.type == "success") {
      this.icon = "check_circle";
      this.snackbarClass="snackbar-success";
    } else if (this.data.type == "error") {
      this.icon = "error";
      this.snackbarClass = "snackbar-error";
    } else {
      this.icon = "info";
      this.snackbarClass = "snackbar-info";
    }
  }
  close() {
    this.snRef.dismiss();
  }
}
