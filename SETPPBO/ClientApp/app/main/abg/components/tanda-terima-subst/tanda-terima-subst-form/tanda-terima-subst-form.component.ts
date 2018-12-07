import { Component, OnInit, Inject } from '@angular/core';
import { TandaTerimaSubst } from '../../../models/tanda-terima-subst/tanda-terima-subst';
import { FormGroup, FormBuilder, Validator, FormControl, Validators } from '@angular/forms';
import { KodeTermohonService } from '../../../services/kode-termohon/kode-termohon.service';
import { KodeTermohon } from '../../../models/kode-termohon/kode-termohon';
import { ReferensiJenisKetetapan } from '../../../../referensi/models/referensi-jenis-ketetapan';
import { ReferensiJenisKetetapanService } from '../../../../referensi/services/referensi-jenis-ketetapan.service';
import { Permohonan } from '../../../../permohonan/models/permohonan';
import { SharedDataService } from '../../../services/shared-data.service';
import { RefjenispajakService } from '../../../../referensi/services/refjenispajak.service';
import { Refjenispajak } from '../../../../referensi/models/refjenispajak';
import { Router } from '@angular/router';
import { DataPermohonan } from '../../../models/data-permohonan';
import { TandaTerimaSubstService } from '../../../services/tanda-terima-subst/tanda-terima-subst.service';
import { PuiSnackbarService } from '../../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { DataPemohon } from '../../../models/data-pemohon';
import { TandaTerima } from '../../../models/tanda-terima';
import { Permintaan } from '../../../models/permintaan';
import { RefTtd } from '../../../../administrasi-banding-gugatan/models/ref-ttd';


@Component({
  selector: 'app-tanda-terima-subst-form',
  templateUrl: './tanda-terima-subst-form.component.html',
  styleUrls: ['./tanda-terima-subst-form.component.css'],
  providers: [TandaTerimaSubstService, ReferensiJenisKetetapanService, RefjenispajakService]
})
export class TandaTerimaSubstFormComponent implements OnInit {
  // model
  formModel: TandaTerimaSubst; // model untuk semua data
  dataPermohonanModel: DataPermohonan; // model untuk update data permohonan
  dataPemohonModel: DataPemohon; // model untuk update data pemohon
  tandaTerimaModel: TandaTerima; // model untuk update data tanda terima
  permintaanModel: Permintaan; // model untuk update data permintaan
  //items: TandaTerimaSubst[];
  // Form Group
  formTandaTerimaGroup: FormGroup; // form group Tanda Terima
  formPermintaanGroup: FormGroup; // form group Permintaan SUB/Tanggapan
  formDataPermohonan: FormGroup; // form group Data Permohonan
  // Referensi
  refConfigTtd: RefTtd[];
  jenisKetetapanModel: ReferensiJenisKetetapan[]; // ref jenis ketetapan di Form Tanda Terima
  jenisPajakModel: Refjenispajak[]; // ref jenis pajak di Form Data Permohonan
  bulanModel= [ // ref untuk tampilan month
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  // select2
  /*refProvinsi= [
    {
      id: 1,
      text: 'Jawa'
    },
    {
      id: 2,
      text: 'Sumatera'
    },
    {
      id: 3,
      text: 'Kalimantan'
    },
    {
      id: 4,
      text: 'Sulawesis'
    }
  ];*/

  // boolean kondisi
  isEdit = false;
  isTandaTerimaSaved = false;
  isPermintaanSaved = false;
  // var lain
  //formTitle: string;
  tipePermohonanNumber : number;
  tipePermohonan: string;
  downloadBaseUrl: string;
  downloadTandaTerimaLink: string;
  downloadPermintaanLink: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _service: TandaTerimaSubstService,
    private _refJenisKetetapanService: ReferensiJenisKetetapanService,
    private _refJenisPajakService: RefjenispajakService,
    private _sharedService: SharedDataService,
    private snackbarService: PuiSnackbarService
  ) {

    this.createForm();
    this.tipePermohonanNumber = _sharedService.getTipe();
    if(this.tipePermohonanNumber==1){
      this.tipePermohonan ="Banding";
    }else{
      this.tipePermohonan ="Gugatan";
    }
    
    //console.log("Trace from Form: "+this.formModel.PemohonId);
   }

  ngOnInit() {
    this.downloadBaseUrl = this._sharedService.getURL();
    this.refConfigTtd = this._sharedService.getRefTtd();

    this._service.getById(this._sharedService.getData()).subscribe(result =>{
      this.formModel = result;
      this.updateForm();
    });
  }

  prepareFormDataPermohonan(){
    this.formDataPermohonan.patchValue({
      NamaPemohon: this.formModel.NamaPemohon, 
      NPWP: this.formModel.NPWP,
      AlamatPemohon: this.formModel.AlamatPemohon,
      KotaPemohon: this.formModel.KotaPemohon,
      NoSuratPermohonan: this.formModel.NoSuratPermohonan,
      TglSuratPermohonan: this.formModel.TglSuratPermohonan,
      NoKep: this.formModel.NoKep,
      TglKep: this.formModel.TglKep,
      RefJenisPajakId: this.formModel.JenisPajakId,
      MasaPajakAwalBulan: this.formModel.MasaPajakAwalBulan,
      MasaPajakAwalTahun: this.formModel.MasaPajakAwalTahun,
      MasaPajakAkhirBulan: this.formModel.MasaPajakAkhirBulan,
      NoSkp: this.formModel.NoSkp,
      TglSkp: this.formModel.TglSkp
    });
  }

  createForm(){
    this._refJenisKetetapanService.getAll().subscribe(result => {
      this.jenisKetetapanModel = result;
    });
    this._refJenisPajakService.getAll().subscribe(result => {
      this.jenisPajakModel = result;
    });
    //create form tanda terima
    this.formTandaTerimaGroup = this.formBuilder.group({
      NoSengketa: [{value:'', disabled: true}, Validators.required],
      NoTandaTerimaSubSt: [{value:'', disabled: true}],
      TglTandaTerimaSubSt: ["", Validators.required],
      RefJenisKetetapanId: [{value: '', disabled: true}, Validators.required],
      Penandatangan: ["", Validators.required],
      TglTerimaAbgSubSt: ["", Validators.required]
    })

    //create form SUB/Tanggapan
    this.formPermintaanGroup = this.formBuilder.group({
      NoSengketa: [{value:'', disabled: true}, Validators.required],
      NoSuratPermintaanSubSt: [{value:'',disabled: true}],
      TglSuratPermintaanSubSt: ["", Validators.required],
      NamaTermohon: ["", Validators.required],
      NamaUpTermohon: ["", Validators.required],
      AlamatTermohon: ["", Validators.required],
      KotaTermohon: ["", Validators.required],
      Penandatangan: ["", Validators.required]
    })
    // create form Data Permohonan
    this.formDataPermohonan = this.formBuilder.group({
      NamaPemohon: ["", Validators.required],
      NPWP: ["", Validators.required],
      AlamatPemohon: ["", Validators.required],
      KotaPemohon: ["", Validators.required],
      NoSuratPermohonan: ["", Validators.required],
      TglSuratPermohonan: ["", Validators.required],
      NoKep: ["", Validators.required],
      TglKep: ["", Validators.required],
      RefJenisPajakId: ["", Validators.required],
      MasaPajakAwalBulan: ["", Validators.required],
      MasaPajakAwalTahun: ["", Validators.required],
      MasaPajakAkhirBulan: ["", Validators.required],
      NoSkp: ["", Validators.required],
      TglSkp: ["", Validators.required]
    });
  }

  updateForm(){
    this.formTandaTerimaGroup.patchValue({
      NoSengketa: this.formModel.NoSengketa,
      RefJenisKetetapanId: this.formModel.RefJenisKetetapanId,
      Penandatangan: "PAN.Wk"
    });

    this.formPermintaanGroup.patchValue({
      NoSengketa: this.formModel.NoSengketa,
      NamaTermohon: this.formModel.NamaTermohon,
      NamaUpTermohon: this.formModel.NamaUpTermohon,
      AlamatTermohon: this.formModel.AlamatTermohon,
      KotaTermohon: this.formModel.KotaTermohon,
      Penandatangan: "PAN.Wk"
    });

    this.prepareFormDataPermohonan();
  }
  /* EVENTS */
  onCetakTandaTerimaClick() {
    //setelah diklik, tombol cetak disable
    this.isTandaTerimaSaved = false;
  }

  onSimpanTandaTerimaClick() {
    // generate NomorTandaTerima
    this._service.getLatestNoTandaTerima(this.tipePermohonanNumber).subscribe(result =>{
      //console.log("Check result before increment: "+result);
      if(result > -1){
        result++;
      
        var noTandaTerima = "";
        if(this.tipePermohonan == "Banding"){
          noTandaTerima += "T-";
        }else{
          noTandaTerima += "TT-";
        }
        noTandaTerima += result ;
    
        noTandaTerima += "/"+this.formTandaTerimaGroup.controls['Penandatangan'].value;
        noTandaTerima += "/"+new Date().getFullYear();

        // prepare model to be sent
        this.tandaTerimaModel = {} as TandaTerima;
        this.tandaTerimaModel.PermohonanId = this.formModel.PermohonanId;
        this.tandaTerimaModel.NoTandaTerimaSubSt = noTandaTerima;
        this.tandaTerimaModel.TglTandaTerimaSubSt = this.formTandaTerimaGroup.controls['TglTandaTerimaSubSt'].value;
        for(let obj of this.refConfigTtd){
          if(this.formTandaTerimaGroup.controls['Penandatangan'].value == "PAN" && obj.Role == "TTD_SES"){
            this.tandaTerimaModel.RefTtdTandaTerimaID = obj.RefId;
          }else if(this.formTandaTerimaGroup.controls['Penandatangan'].value == "PAN.Wk" && obj.Role == "TTD_WASES"){
            this.tandaTerimaModel.RefTtdTandaTerimaID = obj.RefId;
          }
        }
        
        this._service.updateTandaTerima(this.tandaTerimaModel).subscribe(result=>{
          this.formTandaTerimaGroup.patchValue({
            NoTandaTerimaSubSt: noTandaTerima
          });
          this.snackbarService.showSnackBar("success", "Update Tanda Terima berhasil!");
          this.downloadTandaTerimaLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakTandaTerimaSuratPermohonan/"+this.formModel.PermohonanId;
          this.isTandaTerimaSaved = true;
        });
      }else{
        this.snackbarService.showSnackBar("error", "Gagal generate No Tanda Terima! ");
      }
    });
    
    
  }

  onCetakPermintaanClick(){

    this.isPermintaanSaved = false;
  }

  onSimpanPermintaanClick(){
    this._service.getLatestNoPermintaan(this.tipePermohonanNumber).subscribe(result =>{
      result++;
      var noPermintaan = "";
      if(this.tipePermohonan == "Banding"){
        noPermintaan += "U-";
      }else{
        noPermintaan += "TG-";
      }
      noPermintaan += result ;
    
      noPermintaan += "/"+this.formPermintaanGroup.controls['Penandatangan'].value;
      noPermintaan += "/"+new Date().getFullYear();

      // prepare model to be sent
      this.permintaanModel = {} as Permintaan;
      this.permintaanModel.PermohonanId = this.formModel.PermohonanId;
      this.permintaanModel.NoSuratPermintaanSubSt = noPermintaan;
      this.permintaanModel.TglSuratPermintaanSubSt = this.formPermintaanGroup.controls['TglSuratPermintaanSubSt'].value;
      this.permintaanModel.NamaTermohon = this.formPermintaanGroup.controls['NamaTermohon'].value;
      this.permintaanModel.NamaUpTermohon = this.formPermintaanGroup.controls['NamaUpTermohon'].value;
      this.permintaanModel.AlamatTermohon = this.formPermintaanGroup.controls['AlamatTermohon'].value;
      this.permintaanModel.KotaTermohon = this.formPermintaanGroup.controls['KotaTermohon'].value;
      for(let obj of this.refConfigTtd){
        if(this.formPermintaanGroup.controls['Penandatangan'].value == "PAN" && obj.Role == "TTD_SES"){
          this.permintaanModel.RefTtdPermintaanSubStID = obj.RefId;
        }else if(this.formPermintaanGroup.controls['Penandatangan'].value == "PAN.Wk" && obj.Role == "TTD_WASES"){
          this.permintaanModel.RefTtdPermintaanSubStID = obj.RefId;
        }
      }

      this._service.updatePermintaan(this.permintaanModel).subscribe(result=>{
        this.formPermintaanGroup.patchValue({
          NoSuratPermintaanSubSt: noPermintaan
        });
        this.snackbarService.showSnackBar("success", "Update Permintaan SUB/ST berhasil!");
        this.downloadPermintaanLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakPermintaanSubSt/"+this.formModel.PermohonanId;
      });
    });

    this.isPermintaanSaved = true;
  }

  onSimpanDataClick(){
    
    this.dataPermohonanModel = {} as DataPermohonan;
    this.dataPermohonanModel.PermohonanId = this.formModel.PermohonanId;
    this.dataPermohonanModel.NoSuratPermohonan = this.formDataPermohonan.controls['NoSuratPermohonan'].value;
    this.dataPermohonanModel.TglSuratPermohonan = this.formDataPermohonan.controls['TglSuratPermohonan'].value;
    this.dataPermohonanModel.NoKep = this.formDataPermohonan.controls['NoKep'].value;
    this.dataPermohonanModel.TglKep = this.formDataPermohonan.controls['TglKep'].value;
    this.dataPermohonanModel.RefJenisPajakId = this.formDataPermohonan.controls['RefJenisPajakId'].value;
    this.dataPermohonanModel.MasaPajakAwalBulan = this.formDataPermohonan.controls['MasaPajakAwalBulan'].value;
    this.dataPermohonanModel.MasaPajakAwalTahun = this.formDataPermohonan.controls['MasaPajakAwalTahun'].value;
    this.dataPermohonanModel.MasaPajakAkhirBulan = this.formDataPermohonan.controls['MasaPajakAkhirBulan'].value;
    this.dataPermohonanModel.NoSkp = this.formDataPermohonan.controls['NoSkp'].value;
    this.dataPermohonanModel.TglSkp = this.formDataPermohonan.controls['TglSkp'].value;

    this.dataPemohonModel = {} as DataPemohon;
    this.dataPemohonModel.PemohonId = this.formModel.PemohonId;
    this.dataPemohonModel.Nama = this.formDataPermohonan.controls['NamaPemohon'].value;
    this.dataPemohonModel.NPWP = this.formDataPermohonan.controls['NPWP'].value;
    this.dataPemohonModel.Alamat = this.formDataPermohonan.controls['AlamatPemohon'].value;
    this.dataPemohonModel.Kota = this.formDataPermohonan.controls['KotaPemohon'].value;

    this._service.updateDataPermohonan(this.dataPermohonanModel).subscribe(result => {
      this._service.updateDataPemohon(this.dataPemohonModel).subscribe(result=>{
        //this.prepareFormDataPermohonan();
        this.snackbarService.showSnackBar("Sukses", "Update Data Permohonan berhasil!");
      });
      
    });

    
  }
}
