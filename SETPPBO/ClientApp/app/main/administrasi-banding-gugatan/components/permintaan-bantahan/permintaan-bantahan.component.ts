import { Component, OnInit, ViewChild, Inject, Input, AfterViewInit } from '@angular/core';
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
import { RefTtd } from '../../models/ref-ttd';
import { SharedDataService } from '../../services/shared-data.service';
// import { trigger, state, style, transition, animate } from "@angular/core/src/animation/dsl";
import { SelectItem } from 'primeng/components/common/api';
import { DataPemohon } from '../../models/data-pemohon';
import { AdministrasiBandingGugatanService } from '../../services/administrasi-banding-gugatan/administrasi-banding-gugatan.service';
import { TandaTerimaPermintaanComponent } from '../tanda-terima-permintaan/tanda-terima-permintaan.component';
import { DataTandaTerimaPermintaan } from '../../models/data-tanda-terima-permintaan';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';
import { PemohonService } from '../../../pemohon/services/pemohon.service';

@Component({
  selector: 'app-permintaan-bantahan',
  templateUrl: './permintaan-bantahan.component.html',
  styleUrls: ['./permintaan-bantahan.component.css'],
  providers: [PermintaanBantahanService, PuiSnackbarService, KotaService, AdministrasiBandingGugatanService, ReferensiTemplateService, PemohonService]
})
export class PermintaanBantahanComponent implements OnInit {

  showSearch: boolean;
  idTab: number = 0;
  crudName: string = "Info Tambahan";

  items: PermintaanBantahan = new PermintaanBantahan();
  kota: Kota[] = [];
  kotaKoresponden: Kota[] = [];
  provinsi: Provinsi[] = [];
  refConfigTtd: RefTtd[];
  PermintaanBantahanFG: FormGroup;
  dataPemohonFG: FormGroup;
  state: string;
  idParams: string;
  isEdit = false;
  isPermintaanSaved = false;
  isSimpanPermintaanDisabled = false;
  downloadBaseUrl: string;
  downloadPermintaanLink: string;
  tipePermohonanNumber: number;
  permintaanBantahanStat: boolean;
  penyampaianSalinanStat: boolean;
  selectedCity: Kota;
  selectedCityKoresponden: Kota;
  selectedProvinsi: Provinsi;
  selectedProvinsiKoresponden: Provinsi;
  dataPemohonModel: DataPemohon;
  dataPermohonanModel: DataTandaTerimaPermintaan = {} as DataTandaTerimaPermintaan;
  

  @ViewChild(TandaTerimaPermintaanComponent) tandaTerimaPermintaanChild: TandaTerimaPermintaanComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mintaBantahService: PermintaanBantahanService,
    private abgService: AdministrasiBandingGugatanService,
    private _sharedService: SharedDataService,
    private _refTemplateService: ReferensiTemplateService,
    // private kotaService: KotaService,
    private snackbar: PuiSnackbarService,
    private formBuilder: FormBuilder,
    private _serviceKota: PemohonService
  ) {
    
    this.tipePermohonanNumber = _sharedService.getTipe();
    this.idParams = _sharedService.getData();
    // this.kotaService.getAll().subscribe(result => {
    //   this.kota = result;
    //   //console.log(result);
    //   //console.log(this.kota[2].IDRefKota +" & "+this.kota[2].NamaKota)

    // });
    this.provinsi = this._sharedService.getProvinsi();
    

  }

  ngOnInit() {
    this.createForm();
    this.downloadBaseUrl = this._sharedService.getURL();
    this.refConfigTtd = this._sharedService.getRefTtd();
    this.getABG(this.idParams);
  }

  receiveMessage($event: any){
    this.abgService.getProvinsi().subscribe(result => {
      this.provinsi = result;
      //console.log(result);
      this.getABG(this.idParams);
    });
  }

  createForm() {
    this.PermintaanBantahanFG = new FormGroup({
      PermohonanId: new FormControl(''),
      NoSengketa: new FormControl({ value: '', disabled: true }),
      NoSuratPermintaanBantahan: new FormControl({ value: '', disabled: true }),
      TglSuratPermintaanBantahan: new FormControl(''),
      Penandatangan: new FormControl('')
    });

    this.dataPemohonFG = this.formBuilder.group({
      PemohonId: [{value:'', disabled: true}],
      Nama: [{value:'', disabled: true}],
      Alamat: [{value:'', disabled: true}],
      AlamatKoresponden: [''],
      RefKotaId: [{value:'', disabled: true}],
      RefKotaIdKoresponden: [''],
      Provinsi: [{value:'', disabled: true}],
      Kota: [{value:'', disabled: true}],
      ProvinsiKoresponden: [''],
      KotaKoresponden: [''],
      KodePos: [{value:'', disabled: true}],
      KodePosKoresponden: [''],
      NoSubSt: [""],
      TglSubSt: [""],
      NoSuratPermohonan: [{value:'', disabled: true}],
      TglSuratPermohonan: [{value:'', disabled: true}]
    });
  }

  getABG(id: string) {

    this.mintaBantahService.getById(id).subscribe(result => {
      if (result.NoSuratPermintaanBantahan != null) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
      // console.log(result);
      if(result.RefKotaId == null){
        if(result.KotaPemohon !=null){
          this._serviceKota.GetKotaByName(result.KotaPemohon).subscribe(resultKota =>{
            if(resultKota != null){
              this.abgService.getKotaByProvinsi(resultKota.IDRefProvinsi).subscribe(result2 => {
                // console.log(result2)
                this.kota = result2;
                this.updateForm(result);
              });
            }else{
              this.abgService.getKotaById(1).subscribe(hasilKota => {
                // console.log(hasilKota.IDRefProvinsi);
                this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
                  // console.log(result2)
                  this.kota = result2;
                  this.updateForm(result);
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
              this.updateForm(result);
            });
          });
        }
      }else{
        this.abgService.getKotaById(result.RefKotaId).subscribe(hasilKota => {
          // console.log(hasilKota.IDRefProvinsi);
          this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
            // console.log(result2)
            this.kota = result2;
            this.updateForm(result);
          });
        });
      }


    });


  }

  updateForm(data: any = null) {
    // debugger;
    // if(data.RefStatusId == 300 
    //   || data.RefStatusId == 301 
    //   || data.RefStatusId == 310
    //   || data.RefStatusId == 311
    //   || data.RefStatusId == 320
    //   || data.RefStatusId == 321
    // ){
    //   this.isSimpanPermintaanDisabled = false;
    // }else{
    //   this.PermintaanBantahanFG.disable();
    //   this.isSimpanPermintaanDisabled = true;
    // }

    // fungsi cek kesamaan template lokal dengan server, kalau beda: otomatis download
    // kalau download template baru gagal, muncul snackbar, template lama (lokal) yang dipakai
    // parameter checkTemplate: RefTemplateId dari template yang dipakai (12: PermintaanBantahanAtasSub)
    this._refTemplateService.checkTemplate(12).subscribe(result =>{
      if(!result){
        this.snackbar.showSnackBar("error", "Gagal update template, fungsi cetak menggunakan template lama");
      }else{
        console.log("Sukses");
      }
    });
    this._refTemplateService.checkTemplate(13).subscribe(result =>{
      if(!result){
        this.snackbar.showSnackBar("error", "Gagal update template, fungsi cetak menggunakan template lama");
      }else{
        console.log("Sukses");
      }
    });

    this.dataPemohonModel = data;
    
    this.PermintaanBantahanFG = new FormGroup({
      PermohonanId: new FormControl(data.PermohonanId, Validators.required),
      NoSengketa: new FormControl({ value: data.NoSengketa, disabled: true }, Validators.required),
      NoSuratPermintaanBantahan: new FormControl({ value: data.NoSuratPermintaanBantahan, disabled: true }),
      TglSuratPermintaanBantahan: new FormControl(data.TglSuratPermintaanBantahan, Validators.required),
      Penandatangan: new FormControl('', Validators.required)
    });
    if(data.TglSuratPermintaanBantahan==null){
      this.PermintaanBantahanFG.patchValue({
        TglSuratPermintaanBantahan: new Date()
      });
    }
    this.dataPermohonanModel.PermohonanId = data.PermohonanId;
    this.dataPermohonanModel.RefStatusId = data.RefStatusId;
    if (data.NoSubSt == null) {
      this.permintaanBantahanStat = true;
    } else {
      this.permintaanBantahanStat = false;
    }
    if (data.NoSuratBantahan == null) {
      this.penyampaianSalinanStat = true;
    } else {
      this.penyampaianSalinanStat = false;
    }

    if (this.isEdit) {
      this.isPermintaanSaved = true;
      this.downloadPermintaanLink = this.downloadBaseUrl + "/api/AdministrasiBandingGugatan/CetakPermintaanBantahan/" + data.PermohonanId;
      
      if (data.RefTtdPermintaanBantahanId == 7) {
        this.PermintaanBantahanFG.patchValue({
          Penandatangan: "PAN"
        });
      } else {
        this.PermintaanBantahanFG.patchValue({
          Penandatangan: "PAN.Wk"
        });
      }
    } else {
      this.PermintaanBantahanFG.patchValue({
        Penandatangan: "PAN.Wk"
      });
    }

    // this.dataPemohonFG = new FormGroup({
    //   PemohonId                       : new FormControl(data.PemohonId, Validators.required),
    //   Nama                            : new FormControl(data.Nama, Validators.required),
    //   Alamat                          : new FormControl(data.Alamat, Validators.required),
    //   RefKotaId                       : new FormControl(5, Validators.required),
    //   Kota                            : new FormControl("Kota Tegal", Validators.required),
    //   KodePos                         : new FormControl(data.KodePos, Validators.required),
    // 	NoSubSt                         : new FormControl(data.NoSubSt, Validators.required),
    //   TglSubSt                        : new FormControl(data.TglSubSt, Validators.required),
    //   NoSuratPermohonan               : new FormControl(data.NoSuratPermohonan, Validators.required),
    //   TglSuratPermohonan              : new FormControl(data.TglSuratPermohonan, Validators.required)
    // });
    //console.log("Isi data.kota: "+data.Kota);
    this.dataPemohonFG.patchValue({
      PemohonId: data.PemohonId,
      Nama: data.Nama,
      Alamat: data.Alamat,
      AlamatKoresponden: data.AlamatKoresponden,
      RefKotaId: data.RefKotaId,
      RefKotaIdKoresponden: data.RefKotaKorespondenId,
      Kota: data.Kota,
      KotaKoresponden: data.KotaKoresponden,
      KodePos: data.KodePos,
      KodePosKoresponden: data.KodePosKoresponden,
      NoSubSt: data.NoSubSt,
      TglSubSt: data.TglSubSt,
      NoSuratPermohonan: data.NoSuratPermohonan,
      TglSuratPermohonan: data.TglSuratPermohonan
    });
    // set selected data untuk dropdown kota
    if (data.RefKotaId != null) {
      this.selectedCity = this.kota.filter(x => x.IDRefKota == data.RefKotaId)[0];
      this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCity.IDRefProvinsi)[0];
    } else
      if (data.Kota != null) {
        this.selectedCity = this.kota.filter(x => x.NamaKota == data.Kota)[0];
        this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCity.IDRefProvinsi)[0];
      }
      // console.log(data.RefKotaKorespondenId);
      if(data.RefKotaKorespondenId == null){
        data.RefKotaKorespondenId = data.RefKotaId;
      }
    this.abgService.getKotaById(data.RefKotaKorespondenId).subscribe(hasilKota => {
      // console.log(hasilKota);
      this.abgService.getKotaByProvinsi(hasilKota.IDRefProvinsi).subscribe(result2 => {
        // console.log(result2)
        this.kotaKoresponden = result2;
        // set selected data untuk dropdown kotakoresponden
        if (data.RefKotaKorespondenId != null) {
          this.selectedCityKoresponden = this.kotaKoresponden.filter(x => x.IDRefKota == data.RefKotaKorespondenId)[0];
          this.selectedProvinsiKoresponden = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCityKoresponden.IDRefProvinsi)[0];
        } else
          if (data.KotaKoresponden != null) {
            this.selectedCityKoresponden = this.kotaKoresponden.filter(x => x.NamaKota == data.KotaKoresponden)[0];
            this.selectedProvinsiKoresponden = this.provinsi.filter(x => x.IDRefProvinsi == this.selectedCityKoresponden.IDRefProvinsi)[0];
          }
      });
    });


  }

  // createPermintaanBantahanFG(){
  // 	this.PermintaanBantahanFG = new FormGroup({
  // 		NoSengketa                      : new FormControl(this.permintaanBantahan.NoSengketa, Validators.required),
  // 		NoSuratPermintaanBantahan       : new FormControl(this.permintaanBantahan.NoSuratPermintaanBantahan, Validators.required),
  //     TglSuratPermintaanBantahan      : new FormControl(this.permintaanBantahan.TglSuratPermintaanBantahan, Validators.required),
  //     RefTtdPermintaanBantahanID      : new FormControl(this.permintaanBantahan.RefTtdPermintaanBantahanID, Validators.required),

  //     Nama                            : new FormControl(this.permintaanBantahan.Nama, Validators.required),
  // 		Alamat                          : new FormControl(this.permintaanBantahan.Alamat, Validators.required),
  //     Kota                            : new FormControl(this.permintaanBantahan.Kota, Validators.required),
  //     KodePos                         : new FormControl(this.permintaanBantahan.KodePos, Validators.required),
  // 		NoSubSt                         : new FormControl(this.permintaanBantahan.NoSubSt, Validators.required),
  //     TglSubSt                        : new FormControl(this.permintaanBantahan.TglSubSt, Validators.required),
  //     NoSuratPermohonan               : new FormControl(this.permintaanBantahan.NoSuratPermohonan, Validators.required),
  //     TglSuratPermohonan              : new FormControl(this.permintaanBantahan.TglSuratPermohonan, Validators.required)
  //   });
  // }

  onSaveForm() {
    // this.permintaanBantahan = this.PermintaanBantahanFG.value;
  }

  onOkClick() {
    this.mintaBantahService.getLatestNoPermintaanBantahan(this.tipePermohonanNumber).subscribe(result => {
      //generate 
      if (result > -1) {
        result++;

        var noPermintaan = "";
        if (this.tipePermohonanNumber == 1) { //jika banding
          noPermintaan += "B-";
        } else {                              //else gugatan
          noPermintaan += "BG-";
        }
        noPermintaan += result;

        noPermintaan += "/" + this.PermintaanBantahanFG.controls['Penandatangan'].value;
        noPermintaan += "/" + new Date().getFullYear();

        const TglSuratPermintaanBantahan = new Date(this.PermintaanBantahanFG.controls['TglSuratPermintaanBantahan'].value);

        // prepare model to be sent
        // this.items = this.PermintaanBantahanFG.value;
        this.items.PermohonanId = this.PermintaanBantahanFG.controls['PermohonanId'].value;
        this.items.NoSengketa = this.PermintaanBantahanFG.controls['NoSengketa'].value;
        this.items.NoSuratPermintaanBantahan = noPermintaan;
        this.items.TglSuratPermintaanBantahan = new Date(Date.UTC(TglSuratPermintaanBantahan.getFullYear(), TglSuratPermintaanBantahan.getMonth(), TglSuratPermintaanBantahan.getDate()));
        if(this.isEdit){
          this.items.RefStatusID = this.dataPermohonanModel.RefStatusId;
        }else{
          this.items.RefStatusID = 320;
        }
        for (let obj of this.refConfigTtd) {
          if (this.PermintaanBantahanFG.controls['Penandatangan'].value == "PAN" && obj.Role == "TTD_SES") {
            this.items.RefTtdPermintaanBantahanId = obj.RefId;
          } else if (this.PermintaanBantahanFG.controls['Penandatangan'].value == "PAN.Wk" && obj.Role == "TTD_WASES") {
            this.items.RefTtdPermintaanBantahanId = obj.RefId;
          }
        }
        //this.items.RefTtdPermintaanBantahanId = this.PermintaanBantahanFG.controls['Penandatangan'].value;
        // this.items.PemohonId                  = this.PermintaanBantahanFG.controls['PemohonId'].value;

        // debugger;
        this.mintaBantahService.update(this.items, this.idParams).subscribe(result => {
          // debugger;
          this.PermintaanBantahanFG.patchValue({
            NoSuratPermintaanBantahan: noPermintaan
          });
          this.snackbar.showSnackBar("success", "Data Permintaan Bantahan Berhasil Disimpan !");
          this.downloadPermintaanLink = this.downloadBaseUrl + "/api/AdministrasiBandingGugatan/CetakPermintaanBantahan/" + this.items.PermohonanId;
          this.isPermintaanSaved = true;
          // this.router.navigate(['/permohonan']);
        },
          (error) => {
            // debugger;
            this.snackbar.showSnackBar("error", "Data Permintaan Bantahan Gagal Disimpan");
          });
      } else {
        this.snackbar.showSnackBar("error", "Gagal generate No Permintaan Bantahan! ");
      }
    });
  }

  onSimpanDataClick() {
    this.dataPemohonModel.Nama = this.dataPemohonFG.controls['Nama'].value;
    this.dataPemohonModel.Alamat = this.dataPemohonFG.controls['Alamat'].value;
    this.dataPemohonModel.AlamatKoresponden = this.dataPemohonFG.controls['AlamatKoresponden'].value;
    this.dataPemohonModel.RefKotaId = this.selectedCity.IDRefKota;
    this.dataPemohonModel.Kota = this.selectedCity.NamaKota;
    // console.log(this.selectedCityKoresponden.IDRefKota);
    this.dataPemohonModel.RefKotaKorespondenId = this.selectedCityKoresponden.IDRefKota;
    this.dataPemohonModel.KotaKoresponden = this.selectedCityKoresponden.NamaKota;
    this.dataPemohonModel.KodePos = this.dataPemohonFG.controls['KodePos'].value;
    this.dataPemohonModel.KodePosKoresponden = this.dataPemohonFG.controls['KodePosKoresponden'].value;
    this.items.PermohonanId = this.PermintaanBantahanFG.controls['PermohonanId'].value;
    this.items.NoSubSt = this.dataPemohonFG.controls["NoSubSt"].value;
    const TglSubSt = new Date(this.dataPemohonFG.controls["TglSubSt"].value);
    this.items.TglSubSt = new Date(Date.UTC(TglSubSt.getFullYear(), TglSubSt.getMonth(), TglSubSt.getDate()));

    this.mintaBantahService.updateDataPemohon(this.dataPemohonModel).subscribe(result => {
      //this.prepareFormDataPermohonan();
      this.mintaBantahService.updateSubSt(this.items).subscribe(result =>{
        this.tandaTerimaPermintaanChild.ngOnInit();
        this.snackbar.showSnackBar("Sukses", "Update Data Pemohon berhasil!");
      });
    });
  }

  onCetakPermintaanClick() {
    //this.isPermintaanSaved = false;
    if(!this.isEdit){
      this.dataPermohonanModel.RefStatusId = 321;
      this.abgService.updateStatus(this.dataPermohonanModel).subscribe();
    }
    
    this.snackbar.showSnackBar("", "Dokumen akan diunduh, harap tunggu");
  }

  // private saveForm(): void {
  //     this.mintaBantahService.update(this.items, this.items.PermohonanId.toString()).subscribe(result => {
  //       this.snackbar.showSnackBar("success", "Data Permintaan Bantahan Berhasil Disimpan !");
  //       // this.router.navigate(['/permohonan']);
  //     },
  //     (error) => {
  //       this.snackbar.showSnackBar("error", "Data Permintaan Bantahan Gagal Disimpan");
  //     });
  // }

  // onClickAdd() {
  //   let dialogRef = this.dialog.open(CityFormComponent);
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != null) {
  //       this.cityService.create(result).subscribe(result => {
  //         this.prepareCity();
  //         this.snackbar.showSnackBar();
  //       });
  //     }
  //   });
  // }

  onNoClick() {
    // this.dialogRef.close();
  }

  checkForm(formGroup: FormGroup): boolean {
    for (let obj of Object.keys(formGroup.controls)) {
      if (!formGroup!.controls[obj]!.valid) {
        return false
      }
    }
    return true;
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
}
