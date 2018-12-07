import { Component, OnInit, Inject } from '@angular/core';
import { Refmajelis} from "../../models/refmajelis";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-refmajelis-form',
  templateUrl: './refmajelis-form.component.html',
  styleUrls: ['./refmajelis-form.component.css']
})
export class RefmajelisFormComponent implements OnInit {
  model: Refmajelis;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<RefmajelisFormComponent>,
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
    this.model = this.data; // asumsi yang dilempar oleh data adalah object RefMajelis
    this.formGroup.setValue({
      Kode: this.model.Kode,
      Majelis: this.model.Majelis,
      Harsinom: this.model.Harsinom,
      HakimKetuaID: this.model.HakimKetuaId,
      NamaHakimKetua: this.model.NamaHakimKetua,
      NIPHakimKetua: this.model.NiphakimKetua,
      HakimAnggota1ID: this.model.HakimAnggota1Id,
      NamaHakimAnggota1: this.model.NamaHakimAnggota1,
      NIPHakimAnggota1: this.model.NiphakimAnggota1,
      HakimAnggota2ID: this.model.HakimAnggota2Id,
      NamaHakimAnggota2: this.model.NamaHakimAnggota2,
      NIPHakimAnggota2: this.model.NiphakimAnggota2,
      SPID: this.model.Spid,
      NamaSP: this.model.NamaSp,
      NIPSP: this.model.Nipsp,
      PSP1ID: this.model.Psp1id,
      PSP2ID: this.model.Psp2id,
      RefJenisKasusID: this.model.RefJenisKasusId,
      TotalBerkas: this.model.TotalBerkas
    });
  } else {
    // add
    this.model = new Refmajelis();
  }
}

createForm() {
  // create form
  this.formGroup = this.formBuilder.group({
    Kode: ["", Validators.required],
    Majelis: ["", Validators.required],
    Harsinom: ["", Validators.required],
    HakimKetuaID: ["", Validators.required],
    NamaHakimKetua: ["", Validators.required],
    NIPHakimKetua: ["", Validators.required],
    HakimAnggota1ID: ["", Validators.required],
    NamaHakimAnggota1: ["", Validators.required],
    NIPHakimAnggota1: ["", Validators.required],
    HakimAnggota2ID: ["", Validators.required],
    NamaHakimAnggota2: ["", Validators.required],
    NIPHakimAnggota2: ["", Validators.required],
    SPID: ["", Validators.required],
    NamaSP: ["", Validators.required],
    NIPSP: ["", Validators.required],
    PSP1ID: ["", Validators.required],
    PSP2ID: ["", Validators.required],
    RefJenisKasusID: ["", Validators.required],
    TotalBerkas: ["", Validators.required]
  });
}

/* EVENTS */
onNoClick() {
  this.dialogRef.close();
}
onOkClick() 
{
    // prepare model to be sent
    this.model.Kode = this.formGroup.controls['Kode'].value;
    this.model.Majelis = this.formGroup.controls['Majelis'].value;
    this.model.Harsinom = this.formGroup.controls['Harsinom'].value;
    this.model.HakimKetuaId = this.formGroup.controls['HakimKetuaID'].value;
    this.model.NamaHakimKetua = this.formGroup.controls['NamaHakimKetua'].value;
    this.model.NiphakimKetua = this.formGroup.controls['NIPHakimKetua'].value;
    this.model.HakimAnggota1Id = this.formGroup.controls['HakimAnggota1ID'].value;
    this.model.NamaHakimAnggota1 = this.formGroup.controls['NamaHakimAnggota1'].value;
    this.model.NiphakimAnggota1 = this.formGroup.controls['NIPHakimAnggota1'].value;
    this.model.HakimAnggota2Id = this.formGroup.controls['HakimAnggota2ID'].value;
    this.model.NamaHakimAnggota2 = this.formGroup.controls['NamaHakimAnggota2'].value;
    this.model.NiphakimAnggota2 = this.formGroup.controls['NIPHakimAnggota2'].value;
    this.model.Spid = this.formGroup.controls['SPID'].value;
    this.model.NamaSp = this.formGroup.controls['NamaSP'].value;
    this.model.Nipsp = this.formGroup.controls['NIPSP'].value;
    this.model.Psp1id = this.formGroup.controls['PSP1ID'].value;
    this.model.Psp2id = this.formGroup.controls['PSP2ID'].value;
    this.model.RefJenisKasusId =  this.formGroup.controls['RefJenisKasusID'].value;
    this.model.TotalBerkas =  this.formGroup.controls['TotalBerkas'].value;
  this.dialogRef.close(this.model);
}
}


