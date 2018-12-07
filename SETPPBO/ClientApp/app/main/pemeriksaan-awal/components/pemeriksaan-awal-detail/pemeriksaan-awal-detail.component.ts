import { Component, OnInit, ViewChild } from '@angular/core';
import { RefjenispermohonanService } from '../../../referensi/services/refjenispermohonan.service';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { RefjenispajakService } from '../../../referensi/services/refjenispajak.service';
import { PemeriksaanAwal } from '../../models/pemeriksaan-awal';
import { Refjenispermohonan } from '../../../referensi/models/refjenispermohonan';
import { Refjenispajak } from '../../../referensi/models/refjenispajak';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { Pemohon } from '../../../pemohon/models/pemohon';
import { PemohonService } from '../../../pemohon/services/pemohon.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { PemeriksaanAwalService } from '../../services/pemeriksaan-awal.service';
import { HttpParams } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { HttpRequest } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'pemeriksaan-awal-detail',
    templateUrl: './pemeriksaan-awal-detail.component.html',
    styleUrls: ['./pemeriksaan-awal-detail.component.css'],
    providers: [PemeriksaanAwalService, RefjenispermohonanService, RefjenispajakService, RefcarakirimpermohonanService, PemohonService]
})

export class PemeriksaanAwalDetailComponent implements OnInit {
    model: PemeriksaanAwal;
    modelJenisPermohonan: Refjenispermohonan[] = [];
    modelJenisPajak: Refjenispajak[] = [];
    modelCaraKirim: Refcarakirimpermohonan[] = [];
    modelPemohon: Pemohon[] = [];
    modelBulan: any;
    modelOrganisasi: any;
    selectedPemohon: Pemohon;
    selectedPajak: Refjenispajak;

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
    isSend = false;
    isPos = false;

    constructor(
        private formBuilder: FormBuilder,
        private pemeriksaanawalservice: PemeriksaanAwalService,
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
            isSyarat1: ["", Validators.required],
            isSyarat2: ["", Validators.required],
            isSyarat3: ["", Validators.required],
            isSyarat4: ["", Validators.required],
            RefPembagianBerkasId: ["", Validators.required],
        });

        this.formGroupUpload = this.formBuilder.group({
            FilePdfSuratPermohonan: ["", Validators.required],
            FileDocSuratPermohonan: ["", Validators.required],
            FilePdfObjekSengketa: ["", Validators.required],
            FilePdfBuktiBayar: ["", Validators.required],
            FilePdfSkk: ["", Validators.required],
            FilePdfSkp: ["", Validators.required],
            AktaPerusahaan: ["", Validators.required],
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

    }

    onNoClick() {
        this.router.navigate(['/pemeriksaan-awal']);
    }

    onClickSyarat() {

        if (this.model.RefJenisPemeriksaanId != null && this.model.RefPembagianBerkasId != null && this.model.Sdtk != null)
            this.isSend = true;

        if (this.formGroupJenis.controls['RefPembagianBerkasId'].value != null && this.formGroupJenis.controls['RefJenisPemeriksaanId'].value != null) {
            this.isEdit = true;
            this.isSend = true;
         }
        else {
            this.isEdit = false;
            this.isSend = false;
        }

        if (this.formGroupJenis.controls['isSyarat1'].value == 1 || this.formGroupJenis.controls['isSyarat2'].value == 1 ||
            this.formGroupJenis.controls['isSyarat3'].value == 1 || this.formGroupJenis.controls['isSyarat4'].value == 1) {
            this.formGroupJenis.controls['RefJenisPemeriksaanId'].setValue("1");
        }

        if (this.formGroupJenis.controls['isSyarat1'].value != 1 && this.formGroupJenis.controls['isSyarat2'].value != 1 &&
            this.formGroupJenis.controls['isSyarat3'].value != 1 && this.formGroupJenis.controls['isSyarat4'].value != 1) {
            this.formGroupJenis.controls['RefJenisPemeriksaanId'].setValue("2");
        }

    }

    onOkJenisClick() {
        this.model.RefJenisPemeriksaanId = this.formGroupJenis.controls['RefJenisPemeriksaanId'].value;
        this.model.RefPembagianBerkasId = this.formGroupJenis.controls['RefPembagianBerkasId'].value;
        this.model.Sdtk = this.formGroupJenis.controls['Sdtk'].value;

        this.pemeriksaanawalservice.updateJenisPemeriksaan(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil diubah");
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
            });
    }

    onOkSendClick() {
        this.onOkJenisClick();
        this.router.navigate(['/pemeriksaan-awal/information', this.model.PermohonanId]);
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
                this.pemeriksaanawalservice.getKelengkapanById(params["id"]).subscribe(result => {
                    this.createForm();
                    this.model = result;
                    if (this.model.RefJenisPemeriksaanId != null && this.model.RefPembagianBerkasId != null && this.model.Sdtk != null)
                        this.isSend = true;

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


                    if (this.model.PemohonId != null)
                        if (this.modelPemohon == null) {
                            this.pemohonservice.getAll().subscribe(result => {
                                this.modelPemohon = result;
                            });
                        }
                        this.selectedPemohon = this.modelPemohon.filter(x => x.PemohonId == this.model.PemohonId.toString())[0];
                    if (this.model.RefJenisPajakId!=null)
                        this.selectedPajak = this.modelJenisPajak.filter(x => x.RefJenisPajakId == this.model.RefJenisPajakId)[0];
                    
                    this.formGroupJenis.setValue({
                        NoSengketa: this.model.NoSengketa,
                        RefJenisPemeriksaanId: this.model.RefJenisPemeriksaanId.toString(),
                        RefPembagianBerkasId: this.model.RefPembagianBerkasId,
                        Sdtk: this.model.Sdtk.toString(),
                        isSyarat1: this.model.isSyarat1,
                        isSyarat2: this.model.isSyarat2,
                        isSyarat3: this.model.isSyarat3,
                        isSyarat4: this.model.isSyarat4,
                    });
                });
            }
        });
    }

    onChangePos() {
        if (this.formGroup.controls['RefCaraKirimPermohonanId'].value == 5) {
            this.isPos = true;
        }
        else {
            this.isPos = false;
        }
    };
}
