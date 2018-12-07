import { Component, OnInit, Inject,Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';
import { ReferensiJenisKetetapan } from '../../models/referensi-jenis-ketetapan';

@Component({
  selector: 'app-referensi-jenis-ketetapan-form',
  templateUrl: './referensi-jenis-ketetapan-form.component.html',
  styleUrls: ['./referensi-jenis-ketetapan-form.component.css']
})
export class ReferensiJenisKetetapanFormComponent implements OnInit {
  model: ReferensiJenisKetetapan;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<ReferensiJenisKetetapanFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {
    this.createForm(); 
  }

  ngOnInit() { 
    this.model ={} as ReferensiJenisKetetapan;
    // prepare model
    if (this.data != null) {
    // edit
    this.isEdit = true;
    this.model = this.data; // asumsi yang dilempar oleh data adalah object RefMajelis
    this.formGroup.setValue({
      RefJenisKetetapanId: this.model.RefJenisKetetapanId,
      Uraian: this.model.Uraian
    });
  }
}

createForm() {
  // create form
  this.formGroup = this.formBuilder.group({
    RefJenisKetetapanId: ["", Validators.required],
    Uraian: ["", Validators.required]
  });
}

/* EVENTS */
onNoClick() {
  this.dialogRef.close();
}

onOkClick() {
    // prepare model to be sent
    this.model.RefJenisKetetapanId = this.formGroup.controls['RefJenisKetetapanId'].value;
    this.model.Uraian = this.formGroup.controls['Uraian'].value;
    this.dialogRef.close(this.model);
  }
}
