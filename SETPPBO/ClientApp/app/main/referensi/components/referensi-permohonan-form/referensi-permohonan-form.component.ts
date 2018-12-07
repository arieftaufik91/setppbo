import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { RefPermohonan } from '../../models/referensi-permohonan';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { ReferensiPermohonanService } from '../../services/referensi-permohonan.service'
import { RefjenispermohonanService } from '../../../referensi/services/refjenispermohonan.service';
import { Refjenispermohonan } from '../../../referensi/models/refjenispermohonan';
import { Pemohon } from '../../../pemohon/models/pemohon';
import { PemohonService } from '../../../pemohon/services/pemohon.service';
import { ReferensiJenisPajak } from '../../models/referensi-jenis-pajak';
import { ReferensiJenisPajakService } from '../../services/referensi-jenis-pajak.service';
import { RefStatus } from '../../models/referensi-status';
import { ReferensiStatusService } from "../../services/referensi-status.service";


@Component({
  selector    : 'app-referensi-permohonan-form',
  templateUrl : './referensi-permohonan-form.component.html',
  styleUrls   : ['./referensi-permohonan-form.component.css'],
  providers   : [ReferensiPermohonanService, RefcarakirimpermohonanService, RefjenispermohonanService, PemohonService, ReferensiJenisPajakService, ReferensiStatusService]
})
export class ReferensiPermohonanFormComponent implements OnInit {
  Permohonan      : RefPermohonan;
  formModel       = {} as RefPermohonan;
  formGroup       : FormGroup;
  formTitle       : string;
  caraKirimModel  : Refcarakirimpermohonan[];
  refStatusModel  : RefStatus[];
  jenispermohonan : Refjenispermohonan[];
  modeljenispajak : ReferensiJenisPajak[] =[];
  modelpemohon    : Pemohon[] = [];
  permohonanId    : any;
  pemohonPath     : string;
  berkasPath      : string = "Referensi Permohonan";
  selectedPemohon : Pemohon;
  modelbulan      : any;
  modelOrganisasi : any;
  cetak           : string;
  chekcedJenisPemeriksaan : any ;
  PencabutanFileName  : string;
  selectedJenisPajak  : ReferensiJenisPajak;
  disabled = false;

  //syarat
  syarat1     : number ;
  syarat2     : number ;
  syarat3     : number ;
  syarat4     : number ;
  @ViewChild("file") fileInput: any;

  constructor(
    private http                      : HttpClient,
    private formBuilder               : FormBuilder,
    public dialogRef                  : MatDialogRef<ReferensiPermohonanFormComponent>,
    private _refCaraKirimService      : RefcarakirimpermohonanService,
    private _refStatusService         : ReferensiStatusService,
    private _refJenisPermohonan       : RefjenispermohonanService,
    private _jenisPajakService        : ReferensiJenisPajakService,
    private _pemohonService           : PemohonService,
    private _snackBarService          : PuiSnackbarService,
    private _service                  : ReferensiPermohonanService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.createForm();
  }

 

  ngOnInit() {

    this.modelOrganisasi = [
      { IdOrganisasi: 16776, NamaOrganisasi: "ABG I" },
      { IdOrganisasi: 16777, NamaOrganisasi: "ABG II" },
      { IdOrganisasi: 16778, NamaOrganisasi: "ABG III" },
    ];

    this.modelbulan = [
      { id: 1, nama: "Januari" },
      { id: 2, nama: "Februari" },
      { id: 3, nama: "Maret" },
      { id: 4, nama: "April" },
      { id: 5, nama: "Mei" },
      { id: 6, nama: "Juni" },
      { id: 7, nama: "Juli" },
      { id: 8, nama: "Agustus" },
      { id: 9, nama: "September" },
      { id: 10, nama: "Oktober" },
      { id: 11, nama: "November" },
      { id: 12, nama: "Desember" },
  ];
  
    this._refJenisPermohonan.getAll().subscribe(result => {
      this.jenispermohonan = result;
    })
    this._refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
    });

    this._refStatusService.getAll().subscribe(result => {
      this.refStatusModel = result;
    })
    
  }
  

  createForm(){
    
    this.formGroup = this.formBuilder.group({
      NoSengketa              : [{value:''}],
      NoKep                   : [{value:''}],
      TglKep                  : [{value:''}],
      NoSkp                   : [{value:''}],
      TglSkp                  : [{value:''}],
      NoSuratPermohonan       : [{value:''}],
      TglSuratPermohonan      : [{value:''}],
      RefJenisPermohonanId    : [{value:''}],
      Refcarakirimpermohonan  : [{value:''}],
      RefStatus               : [{value:''}],
      TglTerimaPermohonan     : [{value:''}],
      MasaPajakAwalBulan      : [{value:''}],
      MasaPajakAkhirBulan     : [{value:''}],
      MasaPajakAwalTahun      : [{value:''}],
      PemohonId               : [{value:''}],
      JenisPajakId            : [{value:''}],
      RefPembagianBerkasId    : [{value:''}],
      RefJenisPemeriksaanId   : [{value:''}],
      syarat1                 : [{value:''}],
      syarat2                 : [{value:''}],
      syarat3                 : [{value:''}],
      syarat4                 : [{value:''}]
      

     
    });
    this.formGroup.patchValue({
      NoSengketa              : this.data.NoSengketa,
      PemohonId               : this.data.PemohonId,
      JenisPajakId            : this.data.JenisPajakId,
      NoKep                   : this.data.NoKep,
      TglKep                  : this.data.TglKep,
      NoSkp                   : this.data.NoSkp,
      TglSkp                  : this.data.TglSkp,
      NoSuratPermohonan       : this.data.NoSuratPermohonan,
      TglSuratPermohonan      : this.data.TglSuratPermohonan,
      RefJenisPermohonanId    : this.data.RefJenisPermohonanId,
      Refcarakirimpermohonan  : this.data.RefCaraKirimPermohonanId,
      RefStatus               : this.data.RefStatusId,
      TglTerimaPermohonan     : this.data.TglTerimaPermohonan,
      MasaPajakAwalBulan      : this.data.MasaPajakAwalBulan,
      MasaPajakAkhirBulan     : this.data.MasaPajakAkhirBulan,
      MasaPajakAwalTahun      : this.data.MasaPajakAwalTahun,
      RefPembagianBerkasId    : this.data.RefPembagianBerkasId,
      syarat1                 : this.data.Checklist1,
      syarat2                 : this.data.Checklist2,
      syarat3                 : this.data.Checklist3,
      syarat4                 : this.data.Checklist4


    });

    this._pemohonService.getAll().subscribe(result => {
      this.modelpemohon = result;
      this.selectedPemohon = result.filter(x=> x.PemohonId == this.data.PemohonId)[0];

      this.syarat1  = this.data.Checklist1;
      this.syarat2  = this.data.Checklist2;
      this.syarat3  = this.data.Checklist3;
      this.syarat4  = this.data.Checklist4;

      this.chekcedJenisPemeriksaan = this.data.RefJenisPemeriksaanId;
      

    })

    this._jenisPajakService.getAll().subscribe(result => {
      this.modeljenispajak = result;
      this.selectedJenisPajak =result.filter(x=> x.RefJenisPajakId == this.data.RefJenisPajakId)[0];

    })



   

  }

  
  

  onNoClick() {
    this.dialogRef.close();
  //  console.log(this.formGroup.controls['RefJenisPemeriksaanId'].value);
  }

  onOkClick(){
    
    const TglKep              = new Date(this.formGroup.controls['TglKep'].value);
    const TglSkp              = new Date(this.formGroup.controls['TglSkp'].value);
    const TglSuratPermohonan  = new Date(this.formGroup.controls['TglSuratPermohonan'].value);
    const TglTerimaPermohonan  = new Date(this.formGroup.controls['TglTerimaPermohonan'].value);

     
    this.formModel.NoSengketa               = this.formGroup.controls['NoSengketa'].value;
    this.formModel.PermohonanId             = this.data.PermohonanId;
    this.formModel.PemohonId                = this.formGroup.controls['PemohonId'].value.PemohonId;
    this.formModel.RefJenisPajakId          = this.formGroup.controls['JenisPajakId'].value.RefJenisPajakId
    this.formModel.NoKep                    = this.formGroup.controls['NoKep'].value;
    this.formModel.TglKep                   = new Date(Date.UTC(TglKep.getFullYear(), TglKep.getMonth(), TglKep.getDate()));
    this.formModel.NoSkp                    = this.formGroup.controls['NoSkp'].value;
    this.formModel.TglSkp                   = new Date(Date.UTC(TglSkp.getFullYear(), TglSkp.getMonth(), TglSkp.getDate()));
    this.formModel.NoSuratPermohonan        = this.formGroup.controls['NoSuratPermohonan'].value;
    this.formModel.TglSuratPermohonan       = new Date(Date.UTC(TglSuratPermohonan.getFullYear(), TglSuratPermohonan.getMonth(), TglSuratPermohonan.getDate()));
    this.formModel.RefJenisPermohonanId     = this.formGroup.controls['RefJenisPermohonanId'].value;
    this.formModel.RefCaraKirimPermohonanId = this.formGroup.controls['Refcarakirimpermohonan'].value;
    this.formModel.RefStatusId              = this.formGroup.controls['RefStatus'].value;
    this.formModel.TglTerimaPermohonan      = new Date(Date.UTC(TglTerimaPermohonan.getFullYear(), TglTerimaPermohonan.getMonth(), TglTerimaPermohonan.getDate()));
    this.formModel.MasaPajakAwalBulan       = this.formGroup.controls['MasaPajakAwalBulan'].value;
    this.formModel.MasaPajakAkhirBulan      = this.formGroup.controls['MasaPajakAkhirBulan'].value;
    this.formModel.MasaPajakAwalTahun       = this.formGroup.controls['MasaPajakAwalTahun'].value;
    this.formModel.RefPembagianBerkasId     = this.formGroup.controls['RefPembagianBerkasId'].value;
    this.formModel.RefJenisPemeriksaanId    = this.formGroup.controls['RefJenisPemeriksaanId'].value;

    if(this.formGroup.value.syarat1 == true) {this.formModel.Checklist1 = 1} else {this.formModel.Checklist1 = 0}
    if(this.formGroup.value.syarat2 == true) {this.formModel.Checklist2 = 1} else {this.formModel.Checklist2 = 0}
    if(this.formGroup.value.syarat3 == true) {this.formModel.Checklist3 = 1} else {this.formModel.Checklist3 = 0}
    if(this.formGroup.value.syarat4 == true) {this.formModel.Checklist4 = 1} else {this.formModel.Checklist4 = 0}
    this.dialogRef.close(this.formModel);
    
  }

  checkValue(event:any){

    if( this.formGroup.value.syarat1 != true && this.formGroup.value.syarat2 != true &&
        this.formGroup.value.syarat3 != true && this.formGroup.value.syarat4 != true
      )
      {
        this.chekcedJenisPemeriksaan = 2;
      }
      else
      {
        this.chekcedJenisPemeriksaan = 1;
      }

   
  }


}
