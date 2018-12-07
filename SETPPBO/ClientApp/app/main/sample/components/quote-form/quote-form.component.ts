import { Component, OnInit, Inject } from "@angular/core";
import { Quote } from "../../models/quote";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-quote-form",
  templateUrl: "./quote-form.component.html",
  styleUrls: ["./quote-form.component.css"]
})
export class QuoteFormComponent implements OnInit {
  model: Quote;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<QuoteFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit() {
    // prepare model
    if (this.data != null) {
      // edit
      this.isEdit = true;
      this.model = this.data; // asumsi yang dilempar oleh data adalah object Quote
      this.formGroup.setValue({
        quote: this.model.Quote
      });
    } else {
      // add
      this.model = new Quote();
    }
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      quote: ["", Validators.required]
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
      // prepare model to be sent
      this.model.Quote = this.formGroup.controls['quote'].value;
    this.dialogRef.close(this.model);
  }
}
