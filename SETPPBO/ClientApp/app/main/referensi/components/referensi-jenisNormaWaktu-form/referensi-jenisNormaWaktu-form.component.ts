import { Component, OnInit, Inject,Input } from "@angular/core";
import { Refjenisnormawaktus } from "../../models/referensi-jenisNormaWaktu";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatOption } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-referensi-jenisNormaWaktu-form',
  templateUrl: './referensi-jenisNormaWaktu-form.component.html',
  styleUrls: ['./referensi-jenisNormaWaktu-form.component.css']
})
export class RefjenisnormawaktuFormComponent implements OnInit {
  model: Refjenisnormawaktus;
  formGroup: FormGroup;
  isEdit = false;
  items: Refjenisnormawaktus[]
  constructor( 
    
    public dialogRef: MatDialogRef<RefjenisnormawaktuFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.data != null) {

      // edit
      this.isEdit = true;
     
      this.model = this.data; // asumsi yang dilempar oleh data adalah object Quote
      this.formGroup.setValue({
        RefJenisNormaWaktuId: this.data.RefJenisNormaWaktuId,
       
        Uraian: this.model.Uraian
      });
    } else {
      // add
  
      this.model = new Refjenisnormawaktus();
    }
  }


  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      RefJenisNormaWaktuId: ["", Validators.required],
      Uraian: ["", Validators.required],
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
      // prepare model to be sent
      this.model.RefJenisNormaWaktuID = this.formGroup.controls['RefJenisNormaWaktuId'].value;
      this.model.Uraian = this.formGroup.controls['Uraian'].value;
    this.dialogRef.close(this.model);
  }

 


}
