import { Component, OnInit, Inject } from '@angular/core';
import { RefPenandatangan } from '../../models/ref-penandatangan';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RefPenandatanganComponent } from '../ref-penandatangan/ref-penandatangan.component';
import { RefPenandatanganService } from '../../services/ref-penandatangan.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ref-penandatangan-form',
  templateUrl: './ref-penandatangan-form.component.html',
  styleUrls: ['./ref-penandatangan-form.component.css'],
  providers: [RefPenandatanganService]
})
export class RefPenandatanganFormComponent implements OnInit {
  model: RefPenandatangan;
  formGroup: FormGroup;
  isEdit = false;
  tempString: string;

  constructor(
    private _service: RefPenandatanganService,
    public dialogRef: MatDialogRef<RefPenandatanganFormComponent>,
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
      nip: ["", Validators.required],
      nama: ["", Validators.required]
    });

    // prepare model
    if (this.data != null) {
      this._service.getById(this.data.RefConfigId).subscribe(result => {
        // edit
        this.isEdit = true;
        this.model = result;
        // this.formGroup.setValue({
        //   uraian: this.model.Uraian,
        //   configKey: this.model.ConfigKey,
        //   configValue: this.model.ConfigValue,
        // });
      });
    }
  }

  /* EVENTS */
  onCari(){
    this._service.getNamaByNip(this.formGroup.controls['nip'].value).subscribe(result =>{
      this.tempString = result;
      console.log(this.tempString);
      this.formGroup.patchValue({
        nama: this.tempString.split("::")[0]
      });
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // prepare model to be sent
    // this.model.Uraian = this.formGroup.controls['uraian'].value;
    // this.model.ConfigKey = this.formGroup.controls['configKey'].value;
    this.model.ConfigValue = this.tempString.split("::")[1];
    this.dialogRef.close(this.model);
  }

}
