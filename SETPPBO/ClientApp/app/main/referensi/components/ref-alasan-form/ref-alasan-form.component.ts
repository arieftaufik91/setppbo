import { Component, OnInit, Inject } from '@angular/core';
import { RefAlasan } from '../../models/ref-alasan';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'ref-alasan-form',
  templateUrl: './ref-alasan-form.component.html',
  styleUrls: ['./ref-alasan-form.component.css']
})
export class RefAlasanFormComponent implements OnInit {
  model: RefAlasan;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<RefAlasanFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.model = {} as RefAlasan;
    // prepare model
    if (this.data != null) {
      // edit
      this.isEdit = true;
      this.model = this.data; // asumsi yang dilempar oleh data adalah object RefAlasan
      this.formGroup.setValue({
        // refAlasanId: this.model.RefAlasanId,
        uraian: this.model.Uraian
      });
    }
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      uraian: ["", Validators.required]
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // prepare model to be sent
    this.model.Uraian = this.formGroup.controls['uraian'].value;
    this.dialogRef.close(this.model);
  }
}
