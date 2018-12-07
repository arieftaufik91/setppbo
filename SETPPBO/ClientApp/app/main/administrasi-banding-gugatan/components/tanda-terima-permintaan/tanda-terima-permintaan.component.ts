import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TandaTerimaSubSt } from '../../models/tanda-terima-sub-st';
import { DataPermohonan } from '../../models/data-permohonan';
import { DataPemohon } from '../../models/data-pemohon';
import { DataTandaTerimaPermintaan } from '../../models/data-tanda-terima-permintaan';
import { PermintaanSubSt } from '../../models/permintaan-sub-st';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RefTtd } from '../../models/ref-ttd';
import { ReferensiJenisKetetapan } from '../../../referensi/models/referensi-jenis-ketetapan';
import { Refjenispajak } from '../../../referensi/models/refjenispajak';
import { Router } from '@angular/router';
import { TandaTerimaPermintaanService } from '../../services/tanda-terima-permintaan.service';
import { ReferensiJenisKetetapanService } from '../../../referensi/services/referensi-jenis-ketetapan.service';
import { RefjenispajakService } from '../../../referensi/services/refjenispajak.service';
import { SharedDataService } from '../../services/shared-data.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { SelectItem } from 'primeng/components/common/api';
import { Kota, Provinsi } from '../../models/permintaan-bantahan/permintaan-bantahan';
import { AdministrasiBandingGugatanService } from '../../services/administrasi-banding-gugatan/administrasi-banding-gugatan.service';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';
import { RefKodeTermohonService } from '../../../referensi/services/ref-kode-termohon.service';
import { RefKodeTermohon } from '../../../referensi/models/ref-kode-termohon';
import { PemohonService } from '../../../pemohon/services/pemohon.service';

@Component({
  selector: 'app-tanda-terima-permintaan',
  templateUrl: './tanda-terima-permintaan.component.html',
  styleUrls: ['./tanda-terima-permintaan.component.css'],
  providers: [TandaTerimaPermintaanService, RefjenispajakService, ReferensiJenisKetetapanService, ReferensiTemplateService, RefKodeTermohonService, PemohonService]
})
export class TandaTerimaPermintaanComponent implements OnInit {

  // model
  formModel: DataTandaTerimaPermintaan; // model untuk semua data
  dataPermohonanModel: DataPermohonan; // model untuk update data permohonan
  dataPemohonModel: DataPemohon; // model untuk update data pemohon
  tandaTerimaModel: TandaTerimaSubSt; // model untuk update data tanda terima
  permintaanModel: PermintaanSubSt; // model untuk update data permintaan
  //items: TandaTerimaSubst[];
  // Form Group
  formTandaTerimaGroup: FormGroup; // form group Tanda Terima
  formPermintaanGroup: FormGroup; // form group Permintaan SUB/Tanggapan
  formDataPermohonan: FormGroup; // form group Data Permohonan
  // Referensi
  refConfigTtd: RefTtd[];
  jenisPajakModel: Refjenispajak[]; // ref jenis pajak di Form Data Permohonan
  bulanModel= [ // ref untuk tampilan month
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  // dropdown autocomplete
  kota: Kota[] = [];
  kotaKoresponden: Kota[] = [];
  provinsi: Provinsi[] = [];
  jenisKetetapanModel: ReferensiJenisKetetapan[];
  termohonModel: RefKodeTermohon[];
  termohonLevelSatu: RefKodeTermohon[];
  termohonLevelDua: RefKodeTermohon[];
  selectedCity: Kota;
  selectedCityKoresponden: Kota;
  selectedProvinsi: Provinsi;
  selectedProvinsiKoresponden: Provinsi;
  selectedJenisKetetapan: ReferensiJenisKetetapan;
  selectedNamaTermohon: RefKodeTermohon;
  selectedNamaUpTermohon: RefKodeTermohon;

  // boolean kondisi
  isEdit = false;
  isTandaTerimaSaved = false;
  isPermintaanSaved = false;
  isTandaTerimaEdited = false;
  isPermintaanEdited = false;
  isSimpanTandaTerimaDisabled = false;
  isSimpanPermintaanDisabled = false;
  isAC = false;
  // var lain
  //formTitle: string;
  tipePermohonanNumber : number;
  tipePermohonan: string;
  downloadBaseUrl: string;
  downloadTandaTerimaLink: string;
  downloadPermintaanLink: string;
  optionSelected: string;

  @Output() messageEvent = new EventEmitter<number>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _service: TandaTerimaPermintaanService,
    private _refJenisKetetapanService: ReferensiJenisKetetapanService,
    private _refJenisPajakService: RefjenispajakService,
    private _refTemplateService: ReferensiTemplateService,
    private _refKodeTermohonService: RefKodeTermohonService,
    private _sharedService: SharedDataService,
    private snackbarService: PuiSnackbarService,
    private abgService: AdministrasiBandingGugatanService,
    private _serviceKota: PemohonService
  ) {
    
    this.provinsi = this._sharedService.getProvinsi();
    this.isAC = this._sharedService.isAC();
    //console.log(this.isAC+" & "+this._sharedService.isAC());

    this.tipePermohonanNumber = _sharedService.getTipe();
    if(this.tipePermohonanNumber==1){
      this.tipePermohonan ="Banding";
    }else{
      this.tipePermohonan ="Gugatan";
    }
   }

  ngOnInit() {
    this.createForm();
    this.downloadBaseUrl = this._sharedService.getURL();
    this.refConfigTtd = this._sharedService.getRefTtd();

    this._service.getById(this._sharedService.getData()).subscribe(result =>{
      this.formModel = result;
      if(result.NoTandaTerimaSubSt != null){
        this.isTandaTerimaEdited = true;
      }else{
        this.isTandaTerimaEdited = false;
      }
      if(result.NoSuratPermintaanSubSt !=null){
        this.isPermintaanEdited = true;
      }else{
        this.isPermintaanEdited = false;
      }

      if(result.RefKotaId == null){
        if(result.KotaPemohon !=null){
          this._serviceKota.GetKotaByName(result.KotaPemohon).subscribe(resultKota =>{
            if(resultKota != null){
              this.abgService.getKotaByProvinsi(resultKota.IDRefProvinsi).subscribe(result2 => {
                // console.log(result2)
                this.kota = result2;
                this.updateForm();
              });
            }else{
              this.abgService.getKotaById(1).subscribe(hasilKota => {
                // console.log(hasilKota.IDRefProvinsi);
                this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
                  // console.log(result2)
                  this.kota = result2;
                  this.updateForm();
                });
              });
            }
          });
        }else{
          this.abgService.getKotaById(1).subscribe(hasilKota => {
            // console.log(hasilKota.IDRefProvinsi);
            this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
              // console.log(result2)
              this.kota = result2;
              this.updateForm();
            });
          });
        }
      }else{
        this.abgService.getKotaById(result.RefKotaId).subscribe(hasilKota => {
          // console.log(hasilKota.IDRefProvinsi);
          this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
            // console.log(result2)
            this.kota = result2;
            this.updateForm();
          });
        });
      }
      
      this._refKodeTermohonService.getAll().subscribe(result2=>{
        this.termohonModel = result2;
        //console.log("Get result Data Termohon: "+this.termohonModel);
        if(result2!=null){
          this.termohonLevelSatu = this.termohonModel.filter(x => x.Level == 1);
          //console.log("Masuk: "+this.termohonLevelSatu);
          this.termohonLevelDua = this.termohonModel.filter(x => x.Level == 2 && x.IndukOrganisasiId == this.termohonLevelSatu[0].OrganisasiId);
        }
      });

      
    });
  }

  sendMessage(){
    this.messageEvent.emit(0);
  }

  prepareFormDataPermohonan(){
    this.formDataPermohonan.patchValue({
      NamaPemohon: this.formModel.Nama, 
      NPWP: this.formModel.NPWP,
      AlamatPemohon: this.formModel.AlamatPemohon,
      KotaPemohon: this.formModel.KotaPemohon,
      KodePos: this.formModel.KodePos,
      AlamatKoresponden: this.formModel.AlamatKoresponden,
      KotaKoresponden: this.formModel.KotaKoresponden,
      KodePosKoresponden: this.formModel.KodePosKoresponden,
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

    // set selected data untuk dropdown kota
    if (this.formModel.RefKotaId != null) {
      this.selectedCity = this.kota.filter(x => x.IDRefKota == this.formModel.RefKotaId)[0];
      this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCity.IDRefProvinsi)[0];
    } else
      if (this.formModel.KotaPemohon != null) {
        this.selectedCity = this.kota.filter(x => x.NamaKota.includes(this.formModel.KotaPemohon))[0];
        this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCity.IDRefProvinsi)[0];
      }
      // console.log(data.RefKotaKorespondenId);
      if(this.formModel.RefKotaKorespondenId == null){
        this.formModel.RefKotaKorespondenId = this.selectedCity.IDRefKota;
      }
      this.abgService.getKotaById(this.formModel.RefKotaKorespondenId).subscribe(hasilKota => {
      // console.log(hasilKota);
      this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
        // console.log(result2)
        this.kotaKoresponden = result2;
        // set selected data untuk dropdown kotakoresponden
        if (this.formModel.RefKotaKorespondenId != null) {
          this.selectedCityKoresponden = this.kotaKoresponden.filter(x => x.IDRefKota == this.formModel.RefKotaKorespondenId)[0];
          this.selectedProvinsiKoresponden = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCityKoresponden.IDRefProvinsi)[0];
        } else
          if (this.formModel.KotaKoresponden != null) {
            this.selectedCityKoresponden = this.kotaKoresponden.filter(x => x.NamaKota == this.formModel.KotaKoresponden)[0];
            this.selectedProvinsiKoresponden = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCityKoresponden.IDRefProvinsi)[0];
          }
      });
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
      RefJenisKetetapanId: [''],
      Penandatangan: ["", Validators.required],
      TglTerimaAbgPermohonan: ["", Validators.required]
    })

    //create form SUB/Tanggapan
    this.formPermintaanGroup = this.formBuilder.group({
      NoSengketa: [{value:'', disabled: true}, Validators.required],
      NoSuratPermintaanSubSt: [{value:'',disabled: true}],
      TglSuratPermintaanSubSt: ["", Validators.required],
      NamaTermohon: [""],
      NamaUpTermohon: [""],
      AlamatTermohon: [{value:'', disabled: true}],
      KotaTermohon: [{value:'', disabled: true}],
      Penandatangan: ["", Validators.required]
    })
    // create form Data Permohonan
    this.formDataPermohonan = this.formBuilder.group({
      NamaPemohon: [{value:'', disabled: true}, Validators.required],
      NPWP: [{value:'', disabled: true}, Validators.required],
      AlamatPemohon: [{value:'', disabled: true}],
      Provinsi: [{value:'', disabled: true}],
      KotaPemohon: [{value:'', disabled: true}],
      KodePos: [{value:'', disabled: true}],
      AlamatKoresponden: [""],
      ProvinsiKoresponden: [""],
      KotaKoresponden: [""],
      KodePosKoresponden: [""],
      NoSuratPermohonan: [{value:'', disabled: true}],
      TglSuratPermohonan: [{value:'', disabled: true}],
      NoKep: [{value:'', disabled: true}],
      TglKep: [{value:'', disabled: true}],
      RefJenisPajakId: [""],
      MasaPajakAwalBulan: [""],
      MasaPajakAwalTahun: [""],
      MasaPajakAkhirBulan: [""],
      NoSkp: [""],
      TglSkp: [""]
    });
  }

  updateForm(){
    // if(this.formModel.RefStatusId == 300 
    //   || this.formModel.RefStatusId == 301 
    //   || this.formModel.RefStatusId == 310 
    //   || this.formModel.RefStatusId == 311
    //   || this.formModel.RefStatusId == 120
    //   || this.formModel.RefStatusId == 121
    // ){
    //   this.isSimpanTandaTerimaDisabled = false;
    //   this.isSimpanPermintaanDisabled = false;
    // }else{
    //   this.formTandaTerimaGroup.disable();
    //   this.formPermintaanGroup.disable();
    //   this.isSimpanTandaTerimaDisabled = true;
    //   this.isSimpanPermintaanDisabled = true;
    // }

    // fungsi cek kesamaan template lokal dengan server, kalau beda: otomatis download
    // kalau download template baru gagal, muncul snackbar, template lama (lokal) yang dipakai
    // parameter checkTemplate: RefTemplateId dari template yang dipakai (5: TandaTerimaSuratPermohonan)
    this._refTemplateService.checkTemplate(5).subscribe(result =>{
      if(!result){
        this.snackbarService.showSnackBar("error", "Gagal update template Tanda Terima, fungsi cetak menggunakan template lama");
      }else{
        //console.log("Sukses");
      }
    });

    this._refTemplateService.checkTemplate(11).subscribe(result =>{
      if(!result){
        this.snackbarService.showSnackBar("error", "Gagal update template Permintaan SUB, fungsi cetak menggunakan template lama");
      }else{
        //console.log("Sukses");
      }
    });

    this._refTemplateService.checkTemplate(7).subscribe(result =>{
      if(!result){
        this.snackbarService.showSnackBar("error", "Gagal update template Permintaan ST, fungsi cetak menggunakan template lama");
      }else{
        //console.log("Sukses");
      }
    });

    if(this.formModel.TglTandaTerimaSubSt==null){
      this.formTandaTerimaGroup.patchValue({
        TglTandaTerimaSubSt: new Date()
      });
    }else{
      this.formTandaTerimaGroup.patchValue({
        TglTandaTerimaSubSt: this.formModel.TglTandaTerimaSubSt,
      });
    }

    if(this.formModel.TglTerimaAbgPermohonan==null){
      this.formTandaTerimaGroup.patchValue({
        TglTerimaAbgPermohonan: new Date()
      });
    }else{
      this.formTandaTerimaGroup.patchValue({
        TglTerimaAbgPermohonan: this.formModel.TglTerimaAbgPermohonan,
      });
    }

    this.formTandaTerimaGroup.patchValue({
      NoSengketa: this.formModel.NoSengketa,
      NoTandaTerimaSubSt: this.formModel.NoTandaTerimaSubSt,
      
      //RefJenisKetetapanId: this.formModel.RefJenisKetetapanId
      
    });
    if (this.formModel.RefJenisKetetapanId != null) {
      this.selectedJenisKetetapan = this.jenisKetetapanModel.filter(x => x.RefJenisKetetapanId == this.formModel.RefJenisKetetapanId)[0];
    }
    // this.formTandaTerimaGroup.controls['RefJenisKetetapanId'].setValue(this.formModel.RefJenisKetetapanId);

    if(this.formModel.TglSuratPermintaanSubSt==null){
      this.formPermintaanGroup.patchValue({
        TglSuratPermintaanSubSt: new Date()
      });
    }else{
      this.formPermintaanGroup.patchValue({
        TglSuratPermintaanSubSt: this.formModel.TglSuratPermintaanSubSt
      });
    }

    this.formPermintaanGroup.patchValue({
      NoSengketa: this.formModel.NoSengketa,
      NoSuratPermintaanSubSt: this.formModel.NoSuratPermintaanSubSt,
      NamaTermohon: this.formModel.NamaTermohon,
      NamaUpTermohon: this.formModel.NamaUpTermohon,
      AlamatTermohon: this.formModel.AlamatTermohon,
      KotaTermohon: this.formModel.KotaTermohon,
    });
    if(this.formModel.RefTermohonId!= null){
      console.log("RefTermohonId: "+this.formModel.RefTermohonId);
      this.selectedNamaTermohon = this.termohonLevelSatu.filter(x => x.OrganisasiId == this.formModel.RefTermohonId)[0];
    }
    if(this.formModel.RefUpTermohonId!=null){
      console.log("RefUpTermohonId: "+this.formModel.RefUpTermohonId);
      this.termohonLevelDua = this.termohonModel.filter(x => x.Level == 2 && x.IndukOrganisasiId == this.selectedNamaTermohon.OrganisasiId);
      this.selectedNamaUpTermohon = this.termohonLevelDua.filter(x => x.OrganisasiId == this.formModel.RefUpTermohonId)[0];
    }

    if(this.isTandaTerimaEdited){
      this.isTandaTerimaSaved = true;
      this.downloadTandaTerimaLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakTandaTerimaSuratPermohonan/"+this.formModel.PermohonanId;
      //this.formTandaTerimaGroup.disable();
      if(this.formModel.RefTtdTandaTerimaId == 7){
        this.formTandaTerimaGroup.patchValue({
          RefJenisKetetapanId: this.formModel.RefJenisKetetapanId,
          Penandatangan: "PAN"
        });
      }else{
        this.formTandaTerimaGroup.patchValue({
          RefJenisKetetapanId: this.formModel.RefJenisKetetapanId,
          Penandatangan: "PAN.Wk"
        });
      }
      
    }else{
      this.formTandaTerimaGroup.patchValue({
        RefJenisKetetapanId: this.formModel.RefJenisKetetapanId,
        Penandatangan: "PAN.Wk"
      });
    }

    if(this.isPermintaanEdited){
      this.isPermintaanSaved = true;
      this.downloadPermintaanLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakPermintaanSubSt/"+this.formModel.PermohonanId;
      //this.formPermintaanGroup.disable();
      if(this.formModel.RefTtdPermintaanSubStId == 7){
        this.formPermintaanGroup.patchValue({
          Penandatangan: "PAN"
        });
      }else{
        this.formPermintaanGroup.patchValue({
          Penandatangan: "PAN.Wk"
        });
      }
      
    }else{
      this.formPermintaanGroup.patchValue({
        Penandatangan: "PAN.Wk"
      });
    }

    this.prepareFormDataPermohonan();
  }

  /* EVENTS */
  onCetakTandaTerimaClick() {
    // disable tombol cetak?
    //this.isTandaTerimaSaved = false;
    // console.log(this.isTandaTerimaEdited);
    // if(!this.isTandaTerimaEdited){
    //   this.formModel.RefStatusId = 301;
    //   this.abgService.updateStatus(this.formModel).subscribe(result => {
    //     console.log(this.formModel.RefStatusId);
    //   });
    // }
    
    
    this.snackbarService.showSnackBar("", "Dokumen akan diunduh, harap tunggu");
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

        const TglTandaTerimaSubSt = new Date(this.formTandaTerimaGroup.controls['TglTandaTerimaSubSt'].value);
        const TglTerimaAbgPermohonan = new Date(this.formTandaTerimaGroup.controls['TglTerimaAbgPermohonan'].value);
        // prepare model to be sent
        this.tandaTerimaModel = {} as TandaTerimaSubSt;
        this.tandaTerimaModel.PermohonanId = this.formModel.PermohonanId;
        this.tandaTerimaModel.NoTandaTerimaSubSt = noTandaTerima;
        this.tandaTerimaModel.TglTandaTerimaSubSt = new Date(Date.UTC(TglTandaTerimaSubSt.getFullYear(), TglTandaTerimaSubSt.getMonth(), TglTandaTerimaSubSt.getDate()));
        this.tandaTerimaModel.RefJenisKetetapanId = this.selectedJenisKetetapan.RefJenisKetetapanId;
        this.tandaTerimaModel.TglTerimaAbgPermohonan = new Date(Date.UTC(TglTerimaAbgPermohonan.getFullYear(), TglTerimaAbgPermohonan.getMonth(), TglTerimaAbgPermohonan.getDate()));;
        if(this.isTandaTerimaEdited){
          this.tandaTerimaModel.RefStatusId = this.formModel.RefStatusId;
        }else{
          this.tandaTerimaModel.RefStatusId = 301;
        }
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
          this.snackbarService.showSnackBar("success", "Tanda Terima Permohonan berhasil dibuat!");
          this.downloadTandaTerimaLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakTandaTerimaSuratPermohonan/"+this.formModel.PermohonanId;
          this.isTandaTerimaSaved = true;
        });
      }else{
        this.snackbarService.showSnackBar("error", "Gagal generate No Tanda Terima! ");
      }
    });
  }

  onCetakPermintaanClick(){
    // disable tombol cetak?
    //this.isPermintaanSaved = false;
    // this.dataPermohonanModel = {} as DataPermohonan;
    // this.dataPermohonanModel.PermohonanId = this.formModel.PermohonanId;
   
    // if(!this.isPermintaanEdited){
    //   this.formModel.RefStatusId = 311;
    //   this.abgService.updateStatus(this.formModel).subscribe();
    // }

    
    this.snackbarService.showSnackBar("", "Dokumen akan diunduh, harap tunggu");
  }

  onSimpanPermintaanClick(){
    // console.log(this.formPermintaanGroup.valid);
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
      const TglSuratPermintaanSubSt = new Date(this.formPermintaanGroup.controls['TglSuratPermintaanSubSt'].value);
      // prepare model to be sent
      this.permintaanModel = {} as PermintaanSubSt;
      this.permintaanModel.PermohonanId = this.formModel.PermohonanId;
      this.permintaanModel.NoSuratPermintaanSubSt = noPermintaan;
      this.permintaanModel.TglSuratPermintaanSubSt = new Date(Date.UTC(TglSuratPermintaanSubSt.getFullYear(), TglSuratPermintaanSubSt.getMonth(), TglSuratPermintaanSubSt.getDate()));
      this.permintaanModel.RefTermohonId = this.selectedNamaTermohon.OrganisasiId;
      this.permintaanModel.NamaTermohon = this.selectedNamaTermohon.UraianJabatan
      this.permintaanModel.RefUpTermohonId = this.selectedNamaUpTermohon.OrganisasiId;
      this.permintaanModel.NamaUpTermohon = this.selectedNamaUpTermohon.UraianOrganisasi;
      this.permintaanModel.AlamatTermohon = this.formPermintaanGroup.controls['AlamatTermohon'].value;
      this.permintaanModel.KotaTermohon = this.formPermintaanGroup.controls['KotaTermohon'].value;
      if(this.isPermintaanEdited){
        this.permintaanModel.RefStatusID = this.formModel.RefStatusId;
      }else{
        this.permintaanModel.RefStatusID = 311;
      }
      
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
        this.snackbarService.showSnackBar("success", "Data Permintaan SUB/ST berhasil disimpan!");
        this.downloadPermintaanLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakPermintaanSubSt/"+this.formModel.PermohonanId;
      });
    });

    this.isPermintaanSaved = true;
  }

  onSimpanDataClick(){
    const TglSuratPermohonan = new Date(this.formDataPermohonan.controls['TglSuratPermohonan'].value);
    const TglKep = new Date(this.formDataPermohonan.controls['TglKep'].value);
    const TglSkp = new Date(this.formDataPermohonan.controls['TglSkp'].value);

    this.dataPermohonanModel = {} as DataPermohonan;
    this.dataPermohonanModel.PermohonanId = this.formModel.PermohonanId;
    this.dataPermohonanModel.NoSuratPermohonan = this.formDataPermohonan.controls['NoSuratPermohonan'].value;
    this.dataPermohonanModel.TglSuratPermohonan = new Date(Date.UTC(TglSuratPermohonan.getFullYear(), TglSuratPermohonan.getMonth(), TglSuratPermohonan.getDate()));
    this.dataPermohonanModel.NoKep = this.formDataPermohonan.controls['NoKep'].value;
    this.dataPermohonanModel.TglKep = new Date(Date.UTC(TglKep.getFullYear(), TglKep.getMonth(), TglKep.getDate()));
    this.dataPermohonanModel.RefJenisPajakId = this.formDataPermohonan.controls['RefJenisPajakId'].value;
    this.dataPermohonanModel.MasaPajakAwalBulan = this.formDataPermohonan.controls['MasaPajakAwalBulan'].value;
    this.dataPermohonanModel.MasaPajakAwalTahun = this.formDataPermohonan.controls['MasaPajakAwalTahun'].value;
    this.dataPermohonanModel.MasaPajakAkhirBulan = this.formDataPermohonan.controls['MasaPajakAkhirBulan'].value;
    this.dataPermohonanModel.NoSkp = this.formDataPermohonan.controls['NoSkp'].value;
    this.dataPermohonanModel.TglSkp = new Date(Date.UTC(TglSkp.getFullYear(), TglSkp.getMonth(), TglSkp.getDate()));

    this.dataPemohonModel = {} as DataPemohon;
    this.dataPemohonModel.PemohonId = this.formModel.PemohonId;
    this.dataPemohonModel.Nama = this.formDataPermohonan.controls['NamaPemohon'].value;
    this.dataPemohonModel.NPWP = this.formDataPermohonan.controls['NPWP'].value;
    this.dataPemohonModel.Alamat = this.formDataPermohonan.controls['AlamatPemohon'].value;
    this.dataPemohonModel.RefKotaId = this.selectedCity.IDRefKota;
    this.dataPemohonModel.Kota = this.selectedCity.NamaKota;
    this.dataPemohonModel.KodePos = this.formDataPermohonan.controls['KodePos'].value;
    this.dataPemohonModel.AlamatKoresponden = this.formDataPermohonan.controls['AlamatKoresponden'].value;
    this.dataPemohonModel.RefKotaKorespondenId = this.selectedCityKoresponden.IDRefKota;
    this.dataPemohonModel.KotaKoresponden = this.selectedCityKoresponden.NamaKota;
    this.dataPemohonModel.KodePosKoresponden = this.formDataPermohonan.controls['KodePosKoresponden'].value;

    this._service.updateDataPermohonan(this.dataPermohonanModel).subscribe(result => {
      this._service.updateDataPemohon(this.dataPemohonModel).subscribe(result=>{
        //this.prepareFormDataPermohonan();
        this.sendMessage();
        this.snackbarService.showSnackBar("Sukses", "Update Data Permohonan berhasil!");
      });
      
    });
  }

  onProvinsiChanged() {
    this.abgService.getKotaByProvinsi(this.selectedProvinsi.IDRefProvinsi).subscribe(result2 => {
      // console.log(result2)
      this.kota = result2;
      
    });
  }


  onProvinsiKorespondenChanged() {
    // console.log("onProvinsiKorespondenChanged, selectedProvinsi: "+this.selectedProvinsiKoresponden.IDRefProvinsi);
    this.abgService.getKotaByProvinsi(this.selectedProvinsiKoresponden.IDRefProvinsi).subscribe(result2 => {
      // console.log(result2)
      this.kotaKoresponden = result2;
    });
  }

  onTermohonChanged(){
    //console.log(this.selectedNamaTermohon);
    this.termohonLevelDua = this.termohonModel.filter(x => x.Level == 2 && x.IndukOrganisasiId == this.selectedNamaTermohon.OrganisasiId);
    //console.log(this.termohonLevelDua[0].OrganisasiId +" & "+this.termohonLevelDua[0].IndukOrganisasiId);
    this.selectedNamaUpTermohon = this.termohonLevelDua[0];
    this.formPermintaanGroup.patchValue({
      AlamatTermohon: this.selectedNamaUpTermohon.Alamat,
      KotaTermohon: this.selectedNamaUpTermohon.Kota
    })
  }

  onUpTermohonChanged(){
    this.formPermintaanGroup.patchValue({
      AlamatTermohon: this.selectedNamaUpTermohon.Alamat,
      KotaTermohon: this.selectedNamaUpTermohon.Kota
    })
  }
}
