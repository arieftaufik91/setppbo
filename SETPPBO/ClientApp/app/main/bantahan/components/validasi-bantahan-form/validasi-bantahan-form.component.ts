import { Component, OnInit, Inject } from '@angular/core';
import { Bantahan } from '../../models/bantahan';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-validasi-bantahan-form',
  templateUrl: './validasi-bantahan-form.component.html',
  styleUrls: ['./validasi-bantahan-form.component.css']
})
export class ValidasiBantahanFormComponent implements OnInit {
  formModel: Bantahan;
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ValidasiBantahanFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formModel = this.data;
    this.createForm();
  }
  createForm(){
    //this.formModel = {} as Bantahan;
    //this.formModel.PermohonanId = this.data.permohonanId;
    this.formGroup = this.formBuilder.group({
      NoSuratBantahan: ["", Validators.required],
      TglSuratBantahan: ["", Validators.required]
    });

    this.formGroup.setValue({
      NoSuratBantahan: this.formModel.NoSuratBantahan,
      TglSuratBantahan: this.formModel.TglSuratBantahan
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick(){
    //prepare model to be sent
    this.formModel.NoSuratBantahan = this.formGroup.controls['NoSuratBantahan'].value;
    this.formModel.TglSuratBantahan = this.formGroup.controls['TglSuratBantahan'].value;
    
    this.dialogRef.close(this.formModel);
  }
}

