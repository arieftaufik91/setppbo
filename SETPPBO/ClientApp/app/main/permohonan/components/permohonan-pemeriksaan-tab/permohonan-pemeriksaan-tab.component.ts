import { Component, OnInit, ViewChild } from '@angular/core';
import { RefjenispermohonanService } from '../../../referensi/services/refjenispermohonan.service';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { RefjenispajakService } from '../../../referensi/services/refjenispajak.service';
import { Permohonan } from '../../models/permohonan';
import { Refjenispermohonan } from '../../../referensi/models/refjenispermohonan';
import { Refjenispajak } from '../../../referensi/models/refjenispajak';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { Pemohon } from '../../../pemohon/models/pemohon';
import { PemohonService } from '../../../pemohon/services/pemohon.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { PermohonanService } from '../../services/permohonan.service';
import { KelengkapanService } from '../../services/kelengkapan.service';
import { HttpParams } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { HttpRequest } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-permohonan-pemeriksaan-tab',
    templateUrl: './permohonan-pemeriksaan-tab.component.html',
    styleUrls: ['./permohonan-pemeriksaan-tab.component.css'],
    providers: [PermohonanService, RefjenispermohonanService, RefjenispajakService, RefcarakirimpermohonanService, PemohonService, KelengkapanService]

})
export class PermohonanPemeriksaanTabComponent implements OnInit {

    model: Permohonan;
    modelJenisPermohonan: Refjenispermohonan[];
    modelJenisPajak: Refjenispajak[];
    modelCaraKirim: Refcarakirimpermohonan[];
    modelPemohon: Pemohon[];
    modelBulan: any;
    modelOrganisasi: any;

    progress: number;
    formGroupJenis: FormGroup;
    formGroupPembagian: FormGroup;
    formGroupUpload: FormGroup;
    formGroup: FormGroup;

    @ViewChild("file1") fileInput1: any;
    @ViewChild("file2") fileInput2: any;
    @ViewChild("file3") fileInput3: any;
    @ViewChild("file4") fileInput4: any;
    @ViewChild("file5") fileInput5: any;
    @ViewChild("file6") fileInput6: any;

    berkasPath1: string = "DocSuratBG";
    berkasPath2: string = "PdfSuratBG";
    berkasPath3: string = "SalinanObjekSengketa";
    berkasPath4: string = "SalinanSKP";
    berkasPath5: string = "SalinanBuktiBayar";
    berkasPath6: string = "SuratKuasaKhusus";

    uploadPath1: string;
    uploadPath2: string;
    uploadPath3: string;
    uploadPath4: string;
    uploadPath5: string;
    uploadPath6: string;

    isEdit = false;
    constructor(
        private formBuilder: FormBuilder,
        private permohonanservice: PermohonanService,
        private kelengkapanservice: KelengkapanService,
        private refjenispermohonanservice: RefjenispermohonanService,
        private refjenispajakservice: RefjenispajakService,
        private refcarakirimservice: RefcarakirimpermohonanService,
        private pemohonservice: PemohonService,
        private router: Router,
        private snackBarService: PuiSnackbarService,
        private route: ActivatedRoute,
        private http: HttpClient,

    ) {
        this.createForm();
    }

    createForm() {
        // create form

        this.formGroupJenis = this.formBuilder.group({
            NoSengketa: ["", Validators.required],
            RefJenisPemeriksaanId: ["", Validators.required],
            Sdtk: ["", Validators.required],
            RefPembagianBerkasId: ["", Validators.required],
            Kelengkapan1Id: [""],
            Kelengkapan2Id: [""],
            Kelengkapan3Id: [""],
            Kelengkapan4Id: [""],
            Kelengkapan5Id: [""],
        });

        this.formGroup = this.formBuilder.group({
            RefJenisPermohonanId: ["", Validators.required],
            NoSuratPermohonan: ["", Validators.required],
            TglSuratPermohonan: ["", Validators.required],
            TglTerimaPermohonan: ["", Validators.required],
            TglKirimPermohonan: ["", Validators.required],
            RefCaraKirimPermohonanId: ["", Validators.required],
            RefJenisPajakId: ["", Validators.required],
            NoKep: ["", Validators.required],
            TglKep: ["", Validators.required],
            TglTerimaKep: ["", Validators.required],
            NoSkp: ["", Validators.required],
            TglSkp: ["", Validators.required],
            PemohonId: ["", Validators.required],
            MasaPajakAwalBulan: ["", Validators.required],
            MasaPajakAkhirBulan: ["", Validators.required],
            MasaPajakAwalTahun: ["", Validators.required],
        });

        this.formGroupUpload = this.formBuilder.group({
            File1Id: [""],
            File2Id: [""],
            File3Id: [""],
            File4Id: [""],
            File5Id: [""],
            File6Id: [""],
        });
    }
    ngOnInit() {
        this.refjenispermohonanservice.getAll().subscribe(result => {
            this.modelJenisPermohonan = result;
        });

        this.refjenispajakservice.getAll().subscribe(result => {
            this.modelJenisPajak = result;
        });

        this.refcarakirimservice.getAll().subscribe(result => {
            this.modelCaraKirim = result;
        });

        this.pemohonservice.getAll().subscribe(result => {
            this.modelPemohon = result;
        });

        this.modelBulan = [
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

        this.modelOrganisasi = [
            { IdOrganisasi: 16776, NamaOrganisasi: "Subbagian Administrasi Banding dan Gugatan I" },
            { IdOrganisasi: 16777, NamaOrganisasi: "Subbagian Administrasi Banding dan Gugatan II" },
            { IdOrganisasi: 16778, NamaOrganisasi: "Subbagian Administrasi Banding dan Gugatan III" },
        ];

        this.route.params.subscribe((params: Params) => {
            // edit
            if (params["id"]) {
                this.isEdit = true;
                this.permohonanservice.getKelengkapanById(params["id"]).subscribe(result => {
                    this.createForm();
                    this.model = result;
                    this.formGroup.setValue({
                        RefJenisPermohonanId: this.model.RefJenisPermohonanId,
                        NoSuratPermohonan: this.model.NoSuratPermohonan,
                        TglSuratPermohonan: this.model.TglSuratPermohonan,
                        TglTerimaPermohonan: this.model.TglTerimaPermohonan,
                        TglKirimPermohonan: this.model.TglKirimPermohonan,
                        RefCaraKirimPermohonanId: this.model.RefCaraKirimPermohonanId,
                        RefJenisPajakId: this.model.RefJenisPajakId,
                        NoKep: this.model.NoKep,
                        TglKep: this.model.TglKep,
                        TglTerimaKep: this.model.TglTerimaKep,
                        NoSkp: this.model.NoSkp,
                        TglSkp: this.model.TglSkp,
                        MasaPajakAwalBulan: this.model.MasaPajakAwalBulan,
                        MasaPajakAkhirBulan: this.model.MasaPajakAkhirBulan,
                        MasaPajakAwalTahun: this.model.MasaPajakAwalTahun,
                        PemohonId: this.model.PemohonId,
                    });
                    this.formGroupJenis.setValue({
                        NoSengketa: this.model.NoSengketa,
                        RefJenisPemeriksaanId: this.model.RefJenisPemeriksaanId,
                        RefPembagianBerkasId: this.model.RefPembagianBerkasId,
                        Sdtk: "0",
                        Kelengkapan1Id: 0,
                        Kelengkapan2Id: 0,
                        Kelengkapan3Id: 0,
                        Kelengkapan4Id: 0,
                        Kelengkapan5Id: 0,
                    });
                });
            }
        });
    }

    onOkJenisClick() {
        // prepare model to be sent
        this.model.RefJenisPemeriksaanId = this.formGroupJenis.controls['RefJenisPemeriksaanId'].value;
        this.model.RefPembagianBerkasId = this.formGroupJenis.controls['RefPembagianBerkasId'].value;
        this.model.Sdtk = this.formGroupJenis.controls['Sdtk'].value;

        this.permohonanservice.updateJenisPemeriksaan(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil diubah");
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
        });

    }

    onOkClick() {
        // prepare model to be sent
        this.model.RefJenisPermohonanId = this.formGroup.controls['RefJenisPermohonanId'].value;
        this.model.NoSuratPermohonan = this.formGroup.controls['NoSuratPermohonan'].value;
        this.model.TglSuratPermohonan = this.formGroup.controls['TglSuratPermohonan'].value;
        this.model.TglTerimaPermohonan = this.formGroup.controls['TglTerimaPermohonan'].value;
        this.model.RefCaraKirimPermohonanId = this.formGroup.controls['RefCaraKirimPermohonanId'].value;
        this.model.RefJenisPajakId = this.formGroup.controls['RefJenisPajakId'].value;
        this.model.NoKep = this.formGroup.controls['NoKep'].value;
        this.model.TglKep = this.formGroup.controls['TglKep'].value;
        this.model.TglTerimaKep = this.formGroup.controls['TglTerimaKep'].value;
        this.model.NoSkp = this.formGroup.controls['NoSkp'].value;
        this.model.TglSkp = this.formGroup.controls['TglSkp'].value;
        this.model.MasaPajakAwalBulan = this.formGroup.controls['MasaPajakAwalBulan'].value;
        this.model.MasaPajakAkhirBulan = this.formGroup.controls['MasaPajakAkhirBulan'].value;
        this.model.MasaPajakAwalTahun = this.formGroup.controls['MasaPajakAwalTahun'].value;
        this.model.PemohonId = this.formGroup.controls['PemohonId'].value;
        this.model.RefStatusId = 130;
        this.permohonanservice.updatePermohonan(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil diubah");
        },
        (error) => {
            this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
        });


    }

    onOkUploadClick() {
        this.uploadPath1 = this.model.PermohonanId + "/" + this.berkasPath1;

        let fi1 = this.fileInput1.nativeElement;
        if (fi1.files && fi1.files[0]) {
            let fileToUpload = fi1.files[0];
//            this.model.File1Id = fi1.files[0].name;
            this.upload(fileToUpload, this.uploadPath1);
        }

        this.uploadPath2 = this.model.PermohonanId + "/" + this.berkasPath2;

        let fi2 = this.fileInput2.nativeElement;
        if (fi2.files && fi2.files[0]) {
            let fileToUpload = fi2.files[0];
  //          this.model.File2Id = fi2.files[0].name;
            this.upload(fileToUpload, this.uploadPath2);
        }

        this.uploadPath3 = this.model.PermohonanId + "/" + this.berkasPath3;

        let fi3 = this.fileInput3.nativeElement;
        if (fi3.files && fi3.files[0]) {
            let fileToUpload = fi3.files[0];
    //        this.model.File3Id = fi3.files[0].name;
            this.upload(fileToUpload, this.uploadPath3);
        }

        this.uploadPath4 = this.model.PermohonanId + "/" + this.berkasPath4;

        let fi4 = this.fileInput4.nativeElement;
        if (fi4.files && fi4.files[0]) {
            let fileToUpload = fi4.files[0];
      //      this.model.File4Id = fi4.files[0].name;
            this.upload(fileToUpload, this.uploadPath4);
        }

        this.uploadPath5 = this.model.PermohonanId + "/" + this.berkasPath5;

        let fi5 = this.fileInput5.nativeElement;
        if (fi5.files && fi5.files[0]) {
            let fileToUpload = fi5.files[0];
        //    this.model.File5Id = fi5.files[0].name;
            this.upload(fileToUpload, this.uploadPath5);
        }

        this.uploadPath6 = this.model.PermohonanId + "/" + this.berkasPath6;

        let fi6 = this.fileInput6.nativeElement;
        if (fi6.files && fi6.files[0]) {
            let fileToUpload = fi6.files[0];
          //  this.model.File6Id = fi6.files[0].name;
            this.upload(fileToUpload, this.uploadPath6);
        }

        this.snackBarService.showSnackBar("success", "Dokumen Permohonan Berhasil ditambahkan");

    }

    upload(file: any, path: string) {

        const formData = new FormData();
        formData.append(file.name, file);
        let params = new HttpParams();
        params = params.append('param', path);

        const uploadReq = new HttpRequest('POST', `api/KelengkapanPermohonan`, formData, {
            reportProgress: true, params: params,
        });

        this.http.request(uploadReq).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
                this.progress = Math.round(100 * event.loaded);
            else if (event.type === HttpEventType.Response) {
                console.log(HttpEventType.Response);
            }

        });
    }

    onOkPembagianClick() {
        // prepare model to be sent
        this.model.RefPembagianBerkasId = this.formGroupPembagian.controls['RefPembagianBerkasId'].value;

        this.permohonanservice.updatePembagianBerkas(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil diubah");
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
            });

    }
}
