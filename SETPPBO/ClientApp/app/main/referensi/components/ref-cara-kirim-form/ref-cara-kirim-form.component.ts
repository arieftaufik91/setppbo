import { Component, OnInit, Inject } from '@angular/core';
import { Refcarakirimpermohonan } from '../../models/refcarakirimpermohonan';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatOption } from "@angular/material";
import { RefcarakirimpermohonanService } from '../../services/refcarakirimpermohonan.service';

@Component({
  selector: 'app-ref-cara-kirim-form',
  templateUrl: './ref-cara-kirim-form.component.html',
  styleUrls: ['./ref-cara-kirim-form.component.css'],
  providers: [RefcarakirimpermohonanService]
})
export class RefCaraKirimFormComponent implements OnInit {
  model: Refcarakirimpermohonan;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    private _service: RefcarakirimpermohonanService,
    public dialogRef: MatDialogRef<RefCaraKirimFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      RefCaraKirimId: ["", Validators.required],
      Uraian: ["", Validators.required],
    });

    this.model = {} as Refcarakirimpermohonan;

    // prepare model
    if (this.data != null) {
      
        // edit
        this.isEdit = true;
        this.model = this.data; // asumsi yang dilempar oleh data adalah object RefAlasan
        this.formGroup.setValue({
          RefCaraKirimId: this.model.RefCaraKirimId,
          Uraian: this.model.Uraian,
          
        
      });
    }
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // prepare model to be sent
    this.model.RefCaraKirimId = this.formGroup.controls['RefCaraKirimId'].value;
    this.model.Uraian = this.formGroup.controls['Uraian'].value;
    this.dialogRef.close(this.model);
  }
}
