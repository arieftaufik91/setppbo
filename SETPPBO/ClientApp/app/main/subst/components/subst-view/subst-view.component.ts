import { Component, OnInit, Inject } from '@angular/core';
import { Subst } from '../../models/subst';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';


@Component({
  selector: 'app-subst-view',
  templateUrl: './subst-view.component.html',
  styleUrls: ['./subst-view.component.css']
  
})
export class SubstViewComponent implements OnInit {
  model: Subst;
  PermohonanId: any;
  item : any;  
    formGroup: FormGroup;
      isEdit = false;

  constructor( public dialogRef: MatDialogRef<SubstViewComponent>,
    private formBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.createForm();
     }

     ngOnInit() {
      // prepare model


      if (this.data != null) {
          // edit
          this.isEdit = true;
          this.model = this.data; // asumsi yang dilempar oleh data adalah object Quote
          this.formGroup.setValue({
            NoSengketa: this.model.NoSengketa,
            NoSubSt: this.model.NoSubSt,
            TglSubSt: this.model.TglSubSt,
            TglTerimaSubSt: this.model.TglTerimaSubSt,
            RefCaraKirimSubStId: this.model.RefCaraKirimSubStId,
            TextRefCaraKirimSubStUr: this.model.TextRefCaraKirimSubStUr,
            NamaPengirimSubSt: this.model.NamaPengirimSubSt,
            AlamatPengirimSubSt: this.model.AlamatPengirimSubSt,
            KotaPengirimSubSt: this.model.KotaPengirimSubSt,
            KodePosPengirimSubSt: this.model.KodePosPengirimSubSt,
            TglTerimaAbgSubSt: this.model.TglTerimaAbgSubSt,
          });
      } else {
          // add
          this.model = {} as Subst;
      }
  }

  createForm() {
       // create form
    this.formGroup = this.formBuilder.group({
      NoSengketa: ["", Validators.required],
      NoSubSt: ["", Validators.required],
      TglSubSt: ["", Validators.required],
      TglTerimaSubSt: ["", Validators.required],
      RefCaraKirimSubStId: ["", Validators.required],
      TextRefCaraKirimSubStUr: ["", Validators.required],
      NamaPengirimSubSt: ["", Validators.required],
      AlamatPengirimSubSt: ["", Validators.required],
      KotaPengirimSubSt: ["", Validators.required],
      KodePosPengirimSubSt: ["", Validators.required],
      TglTerimaAbgSubSt: ["", Validators.required],


      });
  }

  /* EVENTS */
  onNoClick() {
      this.dialogRef.close();
  }

  onOkClick() {
      // prepare model to be sent
      this.model.NoSengketa = this.formGroup.controls['NoSengketa'].value;
      this.model.NoSubSt = this.formGroup.controls['NoSubSt'].value;
      this.model.TglSubSt = this.formGroup.controls['TglSubSt'].value;
      this.model.TglTerimaSubSt = this.formGroup.controls['TglTerimaSubSt'].value;
      this.model.RefCaraKirimSubStId = this.formGroup.controls['RefCaraKirimSubStId'].value;
      this.model.RefCaraKirimSubStId = this.formGroup.controls['RefCaraKirimSubStId'].value;
      this.model.TextRefCaraKirimSubStUr = this.formGroup.controls['TextRefCaraKirimSubStUr'].value;
      this.model.AlamatPengirimSubSt = this.formGroup.controls['AlamatPengirimSubSt'].value;
      this.model.KotaPengirimSubSt = this.formGroup.controls['KotaPengirimSubSt'].value;
      this.model.KodePosPengirimSubSt = this.formGroup.controls['KodePosPengirimSubSt'].value;
      this.model.TglTerimaAbgSubSt = this.formGroup.controls['TglTerimaAbgSubSt'].value;
      this.dialogRef.close(this.model);
  }


  
}

