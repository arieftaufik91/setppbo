import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
// import { PermintaanBantahan } from "../../models/permintaan-bantahan";
// import { RefJenisPajakService } from "../../services/ref-jenis-pajak/ref-jenis-pajak.service";
// import { RefJenisPajak } from "../../models/ref-jenis-pajak/ref-jenis-pajak";
import { PermintaanBantahan, Kota, Provinsi } from "../../models/permintaan-bantahan/permintaan-bantahan";
// import { PermintaanBantahanService } from "../../services/permintaan-bantahan/permintaan-bantahan.service";
import { AdministrasiBandingGugatan } from "../../models/administrasi-banding-gugatan/administrasi-banding-gugatan";
// import { AdministrasiBandingGugatanService } from "../../services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PermintaanBantahanService } from "../../services/permintaan-bantahan/permintaan-bantahan.service";
import { KotaService } from "../../services/kota/kota.service";
import { PenyampaianSalinanBantahan } from '../../models/penyampaian-salinan-bantahan';
import { DataPenyampaian } from '../../models/data-penyampaian';
import { PenyampaianSalinanBantahanService } from '../../services/penyampaian-salinan-bantahan/penyampaian-salinan-bantahan.service';

import { RefTtd } from '../../models/ref-ttd';
import { SharedDataService } from '../../services/shared-data.service';
import { AdministrasiBandingGugatanService } from '../../services/administrasi-banding-gugatan/administrasi-banding-gugatan.service';
import { DataTandaTerimaPermintaan } from '../../models/data-tanda-terima-permintaan';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';
import { RefKodeTermohon } from '../../../referensi/models/ref-kode-termohon';
import { RefKodeTermohonService } from '../../../referensi/services/ref-kode-termohon.service';
// import { trigger, state, style, transition, animate } from "@angular/core/src/animation/dsl";

@Component({
  selector: 'app-penyampaian-salinan',
  templateUrl: './penyampaian-salinan.component.html',
  styleUrls: ['./penyampaian-salinan.component.css'],
  providers: [
    PenyampaianSalinanBantahanService, 
    PuiSnackbarService, 
    AdministrasiBandingGugatanService, 
    ReferensiTemplateService,
    RefKodeTermohonService
  ]
})
export class PenyampaianSalinanComponent implements OnInit {
  // model
  formModel: PenyampaianSalinanBantahan; // model untuk semua data yang dibutuhkan Penyampaian Salinan Bantahan
  updateStatusModel: DataTandaTerimaPermintaan = {} as DataTandaTerimaPermintaan;
  //dataTermohonModel: // model untuk update data Termohon
  penyampaianSalinanModel: DataPenyampaian; // model untuk update data Penyampaian Salinan Bantahan

  // Form Group
  formSalinanBantahan: FormGroup;
  formDataTermohon: FormGroup;

  // Referensi
  refConfigTtd: RefTtd[];

  // boolean kondisi
  isEdit = false;
  isSalinanBantahanSaved = false;
  isSimpanSalinanDisabled = false;

  // dropdown variable
  termohonModel: RefKodeTermohon[];
  termohonLevelSatu: RefKodeTermohon[];
  termohonLevelDua: RefKodeTermohon[];
  selectedNamaTermohon: RefKodeTermohon;
  selectedNamaUpTermohon: RefKodeTermohon;
  // kota: Kota[] = [];
  // provinsi: Provinsi[] = [];
  // selectedCity: Kota;
  // selectedProvinsi: Provinsi;

  // var lain
  tipePermohonanNumber : number;
  tipePermohonan: string;
  downloadBaseUrl: string;
  downloadSalinanBantahanLink: string;

  constructor(
    private formBuilder: FormBuilder,
    private _service: PenyampaianSalinanBantahanService,
    private _sharedService: SharedDataService,
    private snackbarService: PuiSnackbarService,
    private abgService: AdministrasiBandingGugatanService,
    private _refTemplateService: ReferensiTemplateService,
    private _refKodeTermohonService: RefKodeTermohonService
  ) { 

    this.tipePermohonanNumber = _sharedService.getTipe();
    if(this.tipePermohonanNumber==1){
      this.tipePermohonan ="Banding";
    }else{
      this.tipePermohonan ="Gugatan";
    }

    
    // this.provinsi = this._sharedService.getProvinsi();
  }
  
  ngOnInit() {  
    this.createForm();
    this.downloadBaseUrl = this._sharedService.getURL();
    this.refConfigTtd = this._sharedService.getRefTtd();

    this._service.getById(this._sharedService.getData()).subscribe(result =>{
      this.formModel = result;
      if(result.NoSuratPermintaanSalinan != null){
        this.isEdit = true;
      }else{
        this.isEdit = false;
      }

      if(result.RefKotaTermohonId == null){
        result.RefKotaTermohonId = 1;
      }

      this._refKodeTermohonService.getAll().subscribe(result2=>{
        this.termohonModel = result2;
        //console.log("Get result Data Termohon: "+this.termohonModel);
        if(result2!=null){
          this.termohonLevelSatu = this.termohonModel.filter(x => x.Level == 1);
          //console.log("Masuk: "+this.termohonLevelSatu);
          this.termohonLevelDua = this.termohonModel.filter(x => x.Level == 2 && x.IndukOrganisasiId == this.termohonLevelSatu[0].OrganisasiId);
        }
        this.updateForm();
      });

      // this.abgService.getKotaById(result.RefKotaTermohonId).subscribe(hasilKota => {
      //   // console.log(hasilKota.IDRefProvinsi);
      //   this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
      //     // console.log(result2)
      //     this.kota = result2;
          
      //   });
      // });
    });
  }
  
  createForm(){
    this.formSalinanBantahan = this.formBuilder.group({
      NoSengketa: [{value:'', disabled: true}, Validators.required],
      NoSuratPermintaanSalinan: [{value:'', disabled: true}],
      TglSuratPermintaanSalinan: ["", Validators.required],
      Penandatangan: ["", Validators.required]
    });

    this.formDataTermohon = this.formBuilder.group({
      NamaTermohon: [''],
      NamaUpTermohon: [''],
      AlamatTermohon: [{value:'', disabled: true}],
      KotaTermohon: [{value:'', disabled: true}],
      //Provinsi: ["", Validators.required],
      //KotaTermohon: ["", Validators.required],
      NoSuratBantahan: ["", Validators.required],
      TglSuratBantahan: ["", Validators.required],
      NoSuratPermohonan: [{value:'', disabled: true}, Validators.required],
      TglSuratPermohonan: [{value:'', disabled: true}, Validators.required]
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
    //   this.isSimpanSalinanDisabled = false;
    // }else{
    //   this.formSalinanBantahan.disable();
    //   this.isSimpanSalinanDisabled = true;
    // }

    // fungsi cek kesamaan template lokal dengan server, kalau beda: otomatis download
    // kalau download template baru gagal, muncul snackbar, template lama (lokal) yang dipakai
    // parameter checkTemplate: RefTemplateId dari template yang dipakai (14: PengirimanSalinanBantahanAtasSUB)
    this._refTemplateService.checkTemplate(14).subscribe(result =>{
      if(!result){
        this.snackbarService.showSnackBar("error", "Gagal update template, fungsi cetak menggunakan template lama");
      }else{
        console.log("Sukses");
      }
    });

    this._refTemplateService.checkTemplate(15).subscribe(result =>{
      if(!result){
        this.snackbarService.showSnackBar("error", "Gagal update template, fungsi cetak menggunakan template lama");
      }else{
        console.log("Sukses");
      }
    });

    // prepare fixed data
    this.formSalinanBantahan.patchValue({
      NoSengketa: this.formModel.NoSengketa,
      NoSuratPermintaanSalinan: this.formModel.NoSuratPermintaanSalinan
    });

    if(this.formModel.TglSuratPermintaanSalinan==null){
      this.formSalinanBantahan.patchValue({
        TglSuratPermintaanSalinan: new Date()
      });
    }else{
      this.formSalinanBantahan.patchValue({
        TglSuratPermintaanSalinan: this.formModel.TglSuratPermintaanSalinan
      });
    }

    if(this.formModel.RefTermohonId!= null){
      //console.log("RefTermohonId: "+this.formModel.RefTermohonId);
      this.selectedNamaTermohon = this.termohonLevelSatu.filter(x => x.OrganisasiId == this.formModel.RefTermohonId)[0];
    }
    if(this.formModel.RefUpTermohonId!=null){
      //console.log("RefUpTermohonId: "+this.formModel.RefUpTermohonId);
      this.termohonLevelDua = this.termohonModel.filter(x => x.Level == 2 && x.IndukOrganisasiId == this.selectedNamaTermohon.OrganisasiId);
      this.selectedNamaUpTermohon = this.termohonLevelDua.filter(x => x.OrganisasiId == this.formModel.RefUpTermohonId)[0];
    }

    if(this.isEdit){
      this.isSalinanBantahanSaved = true;
      this.downloadSalinanBantahanLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakPengirimanSalinan/"+this.formModel.PermohonanId;
      //this.formSalinanBantahan.disable();
      if(this.formModel.RefTtdPermintaanSalinanId == 7){
        this.formSalinanBantahan.patchValue({
          Penandatangan: "PAN"
        });
      }else{
        this.formSalinanBantahan.patchValue({
          Penandatangan: "PAN.Wk"
        });
      }
    }else{
      this.formSalinanBantahan.patchValue({
        Penandatangan: "PAN.Wk"
      });
    }

    this.formDataTermohon.patchValue({
      //NamaTermohon: this.formModel.NamaTermohon,
      AlamatTermohon: this.formModel.AlamatTermohon,
      KotaTermohon: this.formModel.KotaTermohon,
      NoSuratBantahan: this.formModel.NoSuratBantahan,
      TglSuratBantahan: this.formModel.TglSuratBantahan,
      NoSuratPermohonan: this.formModel.NoSuratPermohonan,
      TglSuratPermohonan: this.formModel.TglSuratPermohonan
    });

    // set selected data unftuk dropdown kota
    // if (this.formModel.RefKotaTermohonId != null) {
    //   this.selectedCity = this.kota.filter(x => x.IDRefKota == this.formModel.RefKotaTermohonId)[0];
    //   this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCity.IDRefProvinsi)[0];
    // } else if (this.formModel.KotaTermohon != null) {
    //     this.selectedCity = this.kota.filter(x => x.NamaKota == this.formModel.KotaTermohon)[0];
    //     this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCity.IDRefProvinsi)[0];
    //   }
  }

  onCetakClick(){
    
    //this.isSalinanBantahanSaved = false;
    if(!this.isEdit){
      this.updateStatusModel.PermohonanId = this.formModel.PermohonanId;
      this.updateStatusModel.RefStatusId = 331;
      this.abgService.updateStatus(this.updateStatusModel).subscribe();
    }
    
    this.snackbarService.showSnackBar("", "Dokumen akan diunduh, harap tunggu");
  }

  onSimpanClick(){
    this._service.getLatestPenyampaianSalinan(this.tipePermohonanNumber).subscribe(result => {
      if(result > -1){
        result++;
      var noPermintaan = "";
      if(this.tipePermohonan == "Banding"){
        noPermintaan += "PB-";
      }else{
        noPermintaan += "PG-";
      }
      noPermintaan += result ;
    
      noPermintaan += "/"+this.formSalinanBantahan.controls['Penandatangan'].value;
      noPermintaan += "/"+new Date().getFullYear();

      // prepare model to be sent
      this.penyampaianSalinanModel = {} as DataPenyampaian;
      this.penyampaianSalinanModel.PermohonanId = this.formModel.PermohonanId;
      this.penyampaianSalinanModel.NoSuratPermintaanSalinan = noPermintaan;
      const TglSuratPermintaanSalinan = new Date(this.formSalinanBantahan.controls['TglSuratPermintaanSalinan'].value);
      this.penyampaianSalinanModel.TglSuratPermintaanSalinan = new Date(Date.UTC(TglSuratPermintaanSalinan.getFullYear(), TglSuratPermintaanSalinan.getMonth(), TglSuratPermintaanSalinan.getDate()));

      if(this.isEdit){
        this.penyampaianSalinanModel.RefStatusId = this.formModel.RefStatusId;
      }else{
        this.penyampaianSalinanModel.RefStatusId = 330;
      }
      for(let obj of this.refConfigTtd){
        if(this.formSalinanBantahan.controls['Penandatangan'].value == "PAN" && obj.Role == "TTD_SES"){
          this.penyampaianSalinanModel.RefTtdPermintaanSalinanID = obj.RefId;
        }else if(this.formSalinanBantahan.controls['Penandatangan'].value == "PAN.Wk" && obj.Role == "TTD_WASES"){
          this.penyampaianSalinanModel.RefTtdPermintaanSalinanID = obj.RefId;
        }
      }
      this._service.update(this.penyampaianSalinanModel).subscribe(result => {
        this.formSalinanBantahan.patchValue({
          NoSuratPermintaanSalinan: noPermintaan
        });
        this.snackbarService.showSnackBar("success", "Data Penyampaian Salinan Bantahan berhasil disimpan")
        this.downloadSalinanBantahanLink = this.downloadBaseUrl+"/api/AdministrasiBandingGugatan/CetakPengirimanSalinan/"+this.formModel.PermohonanId;
      });
    
      this.isSalinanBantahanSaved = true;
      }else{
        this.snackbarService.showSnackBar("error", "Gagal generate No Permintaan Bantahan! ");
      }
    });
  }

  onSimpanDataClick(){
    this.formModel.RefTermohonId = this.selectedNamaTermohon.OrganisasiId;
    this.formModel.NamaTermohon = this.selectedNamaTermohon.UraianJabatan
    this.formModel.RefUpTermohonId = this.selectedNamaUpTermohon.OrganisasiId;
    this.formModel.NamaUpTermohon = this.selectedNamaUpTermohon.UraianOrganisasi;
    this.formModel.AlamatTermohon = this.formDataTermohon.controls['AlamatTermohon'].value;
    this.formModel.KotaTermohon = this.formDataTermohon.controls['KotaTermohon'].value;
    // this.formModel.KotaTermohon = this.selectedCity.NamaKota;
    // this.formModel.RefKotaTermohonId = this.selectedCity.IDRefKota;
    this.formModel.NoSuratBantahan = this.formDataTermohon.controls['NoSuratBantahan'].value;
    const TglSuratBantahan = new Date(this.formDataTermohon.controls['TglSuratBantahan'].value);
    this.formModel.TglSuratBantahan = new Date(Date.UTC(TglSuratBantahan.getFullYear(), TglSuratBantahan.getMonth(), TglSuratBantahan.getDate()));
    this.formModel.NoSuratPermohonan = this.formDataTermohon.controls['NoSuratPermohonan'].value;
    const TglSuratPermohonan = new Date(this.formDataTermohon.controls['TglSuratPermohonan'].value);
    this.formModel.TglSuratPermohonan = new Date(Date.UTC(TglSuratPermohonan.getFullYear(), TglSuratPermohonan.getMonth(), TglSuratPermohonan.getDate()));

    this._service.updateDataTermohon(this.formModel).subscribe(result => {
       this.snackbarService.showSnackBar("Sukses", "Update Data Termohon berhasil!");
    });
  }

  onTermohonChanged(){
    //console.log(this.selectedNamaTermohon);
    this.termohonLevelDua = this.termohonModel.filter(x => x.Level == 2 && x.IndukOrganisasiId == this.selectedNamaTermohon.OrganisasiId);
    //console.log(this.termohonLevelDua[0].OrganisasiId +" & "+this.termohonLevelDua[0].IndukOrganisasiId);
    this.selectedNamaUpTermohon = this.termohonLevelDua[0];
    this.formDataTermohon.patchValue({
      AlamatTermohon: this.selectedNamaUpTermohon.Alamat,
      KotaTermohon: this.selectedNamaUpTermohon.Kota
    })
  }
  onUpTermohonChanged(){
    this.formDataTermohon.patchValue({
      AlamatTermohon: this.selectedNamaUpTermohon.Alamat,
      KotaTermohon: this.selectedNamaUpTermohon.Kota
    })
  }

  // onProvinsiChanged() {
  //   this.abgService.getKotaByProvinsi(this.selectedProvinsi.IDRefProvinsi).subscribe(result2 => {
  //     // console.log(result2)
  //     this.kota = result2;
      
  //   });
  // }
}
