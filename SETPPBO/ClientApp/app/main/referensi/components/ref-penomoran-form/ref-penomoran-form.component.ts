import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RefPenomoran } from '../../models/ref-penomoran';
// import { RefPenomoranService } from '../../services/ref-penomoran.service';
import { RefJenisPenomoranService } from '../../services/ref-jenis-penomoran.service';
import { RefJenisPenomoran } from '../../models/ref-jenis-penomoran';

@Component({
  selector: 'app-ref-penomoran-form',
  templateUrl: './ref-penomoran-form.component.html',
  styleUrls: ['./ref-penomoran-form.component.css'],
  providers: [RefJenisPenomoranService]
})
export class RefPenomoranFormComponent implements OnInit {
  model: RefPenomoran;
  formGroup: FormGroup;
  isEdit = false;
  apiResult: any;
  items: RefJenisPenomoran[]
  selectedjenispenomoran = new FormControl("");

  constructor(
    private refjenispenomoranservice : RefJenisPenomoranService,
    // private _service: RefPenomoranService,
    public dialogRef: MatDialogRef<RefPenomoranFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {
    this.createForm()
   }

  ngOnInit() {
    this.model = {} as RefPenomoran;
        // prepare model
        if (this.data != null) {
          this.getRefJenisPenomoranService();
            // edit
            this.isEdit = true;
            this.selectedjenispenomoran = new FormControl(this.data.RefJenisPenomoranId)
            this.model = this.data; // asumsi yang dilempar oleh data adalah object RefJenisNomor
            this.formGroup.setValue({
                
              // RefJenisPenomoranId: this.model.RefJenisPenomoranId,
              Tahun: this.model.Tahun,
              OrganisasiId: this.model.OrganisasiId,
              KodeOrganisasi: this.model.KodeOrganisasi,
              NamaOrganisasi: this.model.NamaOrganisasi,
              NomorTerakhir: this.model.NomorTerakhir,
                
            });
        }else {
          //add
          this.getRefJenisPenomoranService();
          this.model = new RefPenomoran();
        }
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
        //refHakimId: ["", Validators.required],
        // RefJenisPenomoranId: ["", Validators.required],
        Tahun: ["", Validators.required],
        OrganisasiId: [""],
        KodeOrganisasi: [""],
        NamaOrganisasi: [""],
        NomorTerakhir: ["", Validators.required]
    });
}

/* EVENTS */
onNoClick() {
  this.dialogRef.close();
}

onOkClick() {
  // prepare model to be sent
  this.model.RefJenisPenomoranId = this.selectedjenispenomoran.value;
  this.model.Tahun = this.formGroup.controls['Tahun'].value;
  this.model.OrganisasiId = this.formGroup.controls['OrganisasiId'].value;
  this.model.KodeOrganisasi = this.formGroup.controls['KodeOrganisasi'].value;
  this.model.NamaOrganisasi = this.formGroup.controls['NamaOrganisasi'].value;
  this.model.NomorTerakhir = this.formGroup.controls['NomorTerakhir'].value;

  this.dialogRef.close(this.model);
}

getRefJenisPenomoranService(){
  this.refjenispenomoranservice.getAll().subscribe(result => this.items = result)
}

}
