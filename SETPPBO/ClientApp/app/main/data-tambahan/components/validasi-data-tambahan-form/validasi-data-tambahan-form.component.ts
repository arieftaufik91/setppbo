import { Component, OnInit, Inject } from '@angular/core';
import { DataTambahanEntry2 } from '../../models/data-tambahan-entry2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
@Component({
  selector: 'app-validasi-data-tambahan-form',
  templateUrl: './validasi-data-tambahan-form.component.html',
  styleUrls: ['./validasi-data-tambahan-form.component.css'],
  providers: [RefcarakirimpermohonanService]
})
export class ValidasiDataTambahanFormComponent implements OnInit {
  formModel: DataTambahanEntry2;
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;

  formData        : FormData[] =[];
  uploadForm      : FormGroup;
  files           :any;
  isEdit          = false;
  guid            :string[] = new Array();
  item            :any[];
  modelCaraKirim  : Refcarakirimpermohonan[];
  suratpengantarid: string ;
  isSentByPostman : boolean = false;
  formReady       : boolean = true;  
  public progress : number;
  public message  : string;
  val2: string    ="tes";

  constructor(
    private formBuilder: FormBuilder,
        private refcarakirimservice : RefcarakirimpermohonanService,
    public dialogRef: MatDialogRef<ValidasiDataTambahanFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
   }

  ngOnInit() {
    this.refcarakirimservice.getAll().subscribe(result => {
      this.modelCaraKirim = result;
  });
    this.formModel = this.data;
    this.createForm();
  }

  createForm(){
    //this.formModel = {} as Pencabutan;
    //this.formModel.PermohonanId = this.data.permohonanId;
    this.formGroup = this.formBuilder.group({
      NoSuratPengantar: ["", Validators.required],
      TglTerima: ["", Validators.required],
      TglKirim:["", Validators.required],
      TglSuratPengantar: ["", Validators.required],
      RefCaraKirimID:[""],
     
    });

    this.formGroup.setValue({
      NoSuratPengantar: this.formModel.NoSuratPengantar,
      TglTerima: this.formModel.TglTerima,
      TglKirim: this.formModel.TglKirim,
      TglSuratPengantar: this.formModel.TglSuratPengantar,
      RefCaraKirimID: 1
     
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick(){
    //prepare model to be sent
    this.formModel.NoSuratPengantar = this.formGroup.controls['NoSuratPengantar'].value;
    this.formModel.TglTerima = this.formGroup.controls['TglTerima'].value;
    this.formModel.TglKirim = this.formGroup.controls['TglKirim'].value;
    this.formModel.TglSuratPengantar = this.formGroup.controls['TglSuratPengantar'].value;
    this.dialogRef.close(this.formModel);
  }

  getCaraKirimPos() {
    let i = this.modelCaraKirim.find(caraKirim => caraKirim.Uraian.toLowerCase() == "pos");
    if (i != null) {
      return i.RefCaraKirimId;
    }
    return 0;
  }

  checkSender() {
    if (this.formGroup.controls['RefCaraKirimID'].value === this.getCaraKirimPos()) {
      this.isSentByPostman = true;
      this.formReady = false;
    } else {
      this.isSentByPostman = false;
      this.formReady = true;
      this.formGroup.patchValue({
        TglKirim : ""
      })
    }
  }

  editForm() {
    if (this.formGroup.controls['TglKirim'].value !== "") this.formReady = true;
    else this.formReady = true;
  }

  


}
