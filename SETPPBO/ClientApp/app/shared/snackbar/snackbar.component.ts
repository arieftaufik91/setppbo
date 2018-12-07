import { Component, OnInit, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";

@Component({
  selector: "app-snackbar",
  templateUrl: "./snackbar.component.html",
  styleUrls: ["./snackbar.component.css"]
})
export class SnackbarComponent implements OnInit {
  icon: string;
  snackbarClass: string;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snRef: MatSnackBarRef<SnackbarComponent>
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
