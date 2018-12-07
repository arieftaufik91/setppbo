import { Component, OnInit, Inject } from '@angular/core';
import { Pemohon } from "../../models/pemohon";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'pemohon-form',
  templateUrl: './pemohon-form.component.html',
  styleUrls: ['./pemohon-form.component.css']
})
export class PemohonFormComponent implements OnInit {
  model: Pemohon;
  formGroup: FormGroup;
  isEdit = false;

  //~ pattern
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$";
  phonePattern = "^[\d \-\(\)\+]*$";
  numberPattern = "^[\d]*$";

  constructor(
    public dialogRef: MatDialogRef<PemohonFormComponent>,
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
        nama: this.model.Nama,
        npwp: this.model.Npwp
      });
    } else {
      // add
      // this.model = new Pemohon();
      this.model = {} as Pemohon;
    }
  }

  createForm() {
    // create form
    //~ set default value on new form object
    this.formGroup = this.formBuilder.group({
      nama: ["", Validators.required],
      npwp: ["", Validators.required]
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // prepare model to be sent
    this.model.Nama = this.formGroup.controls['nama'].value;
    this.model.Npwp = this.formGroup.controls['npwp'].value;

    this.dialogRef.close(this.model);
  }

}
