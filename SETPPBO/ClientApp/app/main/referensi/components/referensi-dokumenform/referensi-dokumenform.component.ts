import { Component, OnInit, Inject } from '@angular/core';
import { ReferensiDokumen } from "../../models/referensi-dokumen";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-referensi-dokumenform',
  templateUrl: './referensi-dokumenform.component.html',
  styleUrls: ['./referensi-dokumenform.component.css']
})
export class ReferensiDokumenformComponent implements OnInit {
  model: ReferensiDokumen;
  formGroup: FormGroup;
  isEdit = false;
  
  items: ReferensiDokumen[];
  
  fileTypes = [
    {value: 'pdf', viewValue: 'PDF'},
    {value: 'word', viewValue: 'Ms. Word'},
    {value: 'gambar', viewValue: 'Gambar'},
    //{value: 'excel', viewValue: 'Ms. Excel'}
  ]
  
  
  selectedJenisFile = new FormControl("");
  selectedMandatory = new FormControl("");
  selectedStatus = new FormControl("");


  constructor(
    public dialogRef: MatDialogRef<ReferensiDokumenformComponent>,
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
      this.selectedJenisFile = new FormControl(this.data.JenisFile);
      this.selectedMandatory = new FormControl(this.data.Mandatory);
      this.selectedStatus = new FormControl(this.data.Status);
      this.model = this.data; // asumsi yang dilempar oleh data adalah object RefDokumen
      this.formGroup.setValue({
        RefDokumenId: this.model.RefDokumenId,
        Uraian: this.model.Uraian
      });
    } else {
      // add
      this.model = new ReferensiDokumen();
    }
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      RefDokumenId: ["", Validators.required],
      Uraian: ["", Validators.required]
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
      // prepare model to be sent
      this.model.RefDokumenId = this.formGroup.controls['RefDokumenId'].value;
      this.model.Uraian = this.formGroup.controls['Uraian'].value;
      this.model.JenisFile = this.selectedJenisFile.value;
      this.model.Mandatory = this.selectedMandatory.value;
      this.model.Status = this.selectedStatus.value;
    this.dialogRef.close(this.model);
  }

  
}
