import { Component, OnInit, Inject } from '@angular/core';
import { Pencabutan } from '../../models/pencabutan';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { AdministrasiBandingGugatanService } from '../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service';
import { PencabutanService } from '../../services/pencabutan.service';

@Component({
  selector: 'app-validasi-pencabutan-form',
  templateUrl: './validasi-pencabutan-form.component.html',
  styleUrls: ['./validasi-pencabutan-form.component.css'],
  providers: [RefcarakirimpermohonanService, AdministrasiBandingGugatanService, PencabutanService]
})
export class ValidasiPencabutanFormComponent implements OnInit {
  formModel: Pencabutan;
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;
  caraKirimModel: Refcarakirimpermohonan[];
  cetak           : string;
  file            : string;
  filepath        : any;
  isEdit          : true;

  constructor(
    private formBuilder: FormBuilder,
    private _refCaraKirimService: RefcarakirimpermohonanService,
    private _servicecetak: AdministrasiBandingGugatanService,
    private _service: PencabutanService,
    public dialogRef: MatDialogRef<ValidasiPencabutanFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.fetch();
   }

  ngOnInit() {
    this.formModel = this.data;
    this.createForm();
  }

  createForm(){
    this._refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
    });
    //this.formModel = {} as Pencabutan;
    //this.formModel.PermohonanId = this.data.permohonanId;
    this.formGroup = this.formBuilder.group({
      NoSuratPencabutan: ["", Validators.required],
      TglSuratPencabutan: ["", Validators.required],
      RefCaraKirimPencabutanId: ["", Validators.required]
    });
    this.formGroup.patchValue({
      NoSuratPencabutan: this.formModel.NoSuratPencabutan,
      TglSuratPencabutan: this.formModel.TglSuratPencabutan
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick(){
    //prepare model to be sent
    this.formModel.NoSuratPencabutan = this.formGroup.controls['NoSuratPencabutan'].value;
    this.formModel.TglSuratPencabutan = this.formGroup.controls['TglSuratPencabutan'].value;
    this.formModel.RefCaraKirimPencabutanId = this.formGroup.controls['RefCaraKirimPencabutanId'].value;
    this.formModel.TglTerimaPencabutan = new Date();
    
    this.dialogRef.close(this.formModel);
  }

  fetch() {
    this._service.getDetailPermohonan(this.data.PermohonanId)
      .subscribe(result => {
        this.file = result.FilePencabutan;
      });

      this._service.getDetailPencabutan(this.data.PermohonanId).subscribe(result => {
        this.filepath = result.path;
      });
  }

  download() {
    this._servicecetak.getBaseUrl().subscribe(result => {
      this.cetak = result;
      this.cetak = this.cetak + "/api/DownloadFileDT/"  + this.filepath + "/" + this.file;
    });

    setTimeout(() => {
      window.open(this.cetak);
    }, 250);
   
  
  }
}
