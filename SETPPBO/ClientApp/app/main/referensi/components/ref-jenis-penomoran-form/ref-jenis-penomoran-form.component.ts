import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RefJenisPenomoran } from '../../models/ref-jenis-penomoran';
import { RefJenisPenomoranService } from '../../services/ref-jenis-penomoran.service';

@Component({
  selector: 'app-ref-jenis-penomoran-form',
  templateUrl: './ref-jenis-penomoran-form.component.html',
  styleUrls: ['./ref-jenis-penomoran-form.component.css'],
  providers: [RefJenisPenomoranService]
})
export class RefJenisPenomoranFormComponent implements OnInit {
  model: RefJenisPenomoran;
  formGroup: FormGroup;
  isEdit = false;
  apiResult: any;

  constructor(
    private _service: RefJenisPenomoranService,
    public dialogRef: MatDialogRef<RefJenisPenomoranFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.createForm()
  }

  ngOnInit() {
    this.model = {} as RefJenisPenomoran;
        // prepare model
        if (this.data != null) {
            // edit
            this.isEdit = true;
            this.model = this.data; // asumsi yang dilempar oleh data adalah object RefJenisNomor
            this.formGroup.setValue({
                
                Uraian: this.model.Uraian,
                Prefix: this.model.Prefix,
                Suffix: this.model.Suffix
                
            });
        }
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
        //refHakimId: ["", Validators.required],
        Uraian: ["", Validators.required],
        Prefix: ["", Validators.required],
        Suffix: ["", Validators.required]
    });
}

/* EVENTS */
onNoClick() {
  this.dialogRef.close();
}

onOkClick() {
  // prepare model to be sent
  this.model.Uraian = this.formGroup.controls['Uraian'].value;
  this.model.Prefix = this.formGroup.controls['Prefix'].value;
  this.model.Suffix = this.formGroup.controls['Suffix'].value;
  this.dialogRef.close(this.model);
}

// onCari() {
//   this._service
//       .getNamaByNip(this.formGroup.controls['nik'].value)
//       .subscribe(result => {
//           this.apiResult = result;
//           console.log(this.apiResult);
//           this.formGroup.patchValue({
//               nama: this.apiResult.Nama,
//               nik: this.apiResult.NIP18,
//               pegawaiId: this.apiResult.IDPegawai
//           });
//           this.model.Nama = this.apiResult.Nama;
//           this.model.Nik = this.apiResult.NIP18;
//           this.model.PegawaiId = this.apiResult.IDPegawai;
//       });
// }

}
