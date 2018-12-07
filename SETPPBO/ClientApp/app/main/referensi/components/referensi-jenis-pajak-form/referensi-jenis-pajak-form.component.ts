import { Component, OnInit, Inject } from '@angular/core';
import { ReferensiJenisPajak } from '../../models/referensi-jenis-pajak'
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ReferensiJenisPajakService } from "../../services/referensi-jenis-pajak.service"

@Component({
  selector: 'app-referensi-jenis-pajak-form',
  templateUrl: './referensi-jenis-pajak-form.component.html',
  styleUrls: ['./referensi-jenis-pajak-form.component.css'],
  providers: [ReferensiJenisPajakService]
})

export class ReferensiJenisPajakFormComponent implements OnInit {
  model               : ReferensiJenisPajak;
  items               : ReferensiJenisPajak[];
  formGroup           : FormGroup;
  isEdit              = false;
  selectedjeniskasus  = new FormControl("");

  constructor(
    public dialogRef          : MatDialogRef<ReferensiJenisPajakFormComponent>,
    private formBuilder       : FormBuilder,
    private _service          : ReferensiJenisPajakService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit() {
    
    if (this.data != null) {

      this.getRefjeniskasus();
      this.isEdit             = true;
      this.selectedjeniskasus = new FormControl(this.data.RefJenisKasusId);
      this.model              = this.data; 
      this.formGroup.setValue({
        RefJenisPajakId : this.model.RefJenisPajakId,
        Uraian          : this.model.Uraian,
        UraianSingkat   : this.model.UraianSingkat,
        Kode            : this.model.Kode,
      });
    }
    else{
      this.getRefjeniskasus();
      this.model = {} as ReferensiJenisPajak;
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      RefJenisPajakId : [""],
      Uraian          : ["", Validators.required],
      UraianSingkat   : ["", Validators.required],
      Kode            : ["", Validators.required]
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    this.model.RefJenisPajakId  = this.formGroup.controls['RefJenisPajakId'].value;
    this.model.Uraian           = this.formGroup.controls['Uraian'].value;
    this.model.UraianSingkat    = this.formGroup.controls['UraianSingkat'].value;
    this.model.Kode             = this.formGroup.controls['Kode'].value;
    this.model.RefJenisKasusID  = this.selectedjeniskasus.value;
    this.dialogRef.close(this.model);
  }
  getRefjeniskasus(){
    this._service.getJenisKasus().subscribe(result => this.items = result)
  }
}

