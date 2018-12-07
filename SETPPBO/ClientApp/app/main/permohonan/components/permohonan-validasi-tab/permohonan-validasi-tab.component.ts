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
    selector: 'app-permohonan-validasi-tab',
    templateUrl: './permohonan-validasi-tab.component.html',
    styleUrls: ['./permohonan-validasi-tab.component.css'],
    providers: [PermohonanService, RefjenispermohonanService, RefjenispajakService, RefcarakirimpermohonanService, PemohonService, KelengkapanService]

})
export class PermohonanValidasiTabComponent implements OnInit {


    model: Permohonan;
    modelJenisPermohonan: Refjenispermohonan[];
    modelJenisPajak: Refjenispajak[];
    modelCaraKirim: Refcarakirimpermohonan[];
    modelPemohon: Pemohon[];
    modelBulan: [{ id: number; nama: string }];
    selectedPemohon: Pemohon;
    selectedPajak: Refjenispajak;

    progress: number;
    formGroup: FormGroup;
    formGroupUpload: FormGroup;

    @ViewChild("filePdfSuratPermohonan") filePdfSuratPermohonan: any;
    @ViewChild("fileDocSuratPermohonan") fileDocSuratPermohonan: any;
    @ViewChild("filePdfObjekSengketa") filePdfObjekSengketa: any;
    @ViewChild("filePdfBuktiBayar") filePdfBuktiBayar: any;
    @ViewChild("filePdfSkk") filePdfSkk: any;
    @ViewChild("filePdfSkp") filePdfSkp: any;


    berkasPath1: string = "PdfSuratPermohonan";
    berkasPath2: string = "DocSuratPermohonan";
    berkasPath3: string = "SalinanObjekSengketa";
    berkasPath4: string = "SalinanBuktiBayar"//"SalinanSKP";
    berkasPath5: string = "SuratKuasaKhusus";//"SalinanBuktiBayar";
    berkasPath6: string = "SalinanBuktiBayar";//"SuratKuasaKhusus";

    uploadPathFilePdfSuratPermohonan: string;
    uploadPathFileDocSuratPermohonan: string;
    uploadPathFilePdfObjekSengketa: string;
    uploadPathFilePdfBuktiBayar: string;
    uploadPathFilePdfSkk: string;
    uploadPathFilePdfSkp: string;
    filepath: string;

    isEdit = false;
    isSend = false;
    isPos = false;

    isFilePdfSuratPermohonan = false;
    isFileDocSuratPermohonan = false;
    isFilePdfObjekSengketa = false;
    isFilePdfBuktiBayar = false;
    isFilePdfSkk = false;
    isFilePdfSkp = false;

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

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {

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
            // edit
            if (params["id"]) {
                this.permohonanservice.getKelengkapanById(params["id"]).subscribe(result => {
                    this.createForm();
                    this.model = result;

                    this.isSend = true;

                    this.isEdit = true;
                    this.isFilePdfSuratPermohonan = this.model.isFilePdfSuratPermohonan;
                    this.isFileDocSuratPermohonan = this.model.isFileDocSuratPermohonan;
                    this.isFilePdfObjekSengketa = this.model.isFilePdfObjekSengketa;
                    this.isFilePdfBuktiBayar = this.model.isFilePdfBuktiBayar;
                    this.isFilePdfSkk = this.model.isFilePdfSkk;
                    this.isFilePdfSkp = this.model.isFilePdfSkp;

                    if (this.model.RefCaraKirimPermohonanId == 5)
                        this.isPos = true;
                    else
                        this.isPos = false;

                    this.formGroup.setValue({
                        RefJenisPermohonanId: this.model.RefJenisPermohonanId,
                        NoSuratPermohonan: this.model.NoSuratPermohonan,
                        TglSuratPermohonan: this.model.TglSuratPermohonan,
                        TglTerimaPermohonan: this.model.TglTerimaPermohonan,
                        TglKirimPermohonan: this.model.TglKirimPermohonan,
                        RefCaraKirimPermohonanUr: this.model.RefCaraKirimPermohonanUr,
                        RefJenisPajakId: this.model.RefJenisPajakId,
                        NoKep: this.model.NoKep,
                        TglKep: this.model.TglKep,
                        TglTerimaKep: this.model.TglTerimaKep,
                        NoSkp: this.model.NoSkp,
                        TglSkp: this.model.TglSkp,
                        MasaPajakAwalBulan: this.model.MasaPajakAwalBulan,
                        MasaPajakAkhirBulan: this.model.MasaPajakAkhirBulan,
                        MasaPajakAwalTahun: this.model.MasaPajakAwalTahun,
                        PemohonName: this.model.PemohonName
                    });

                    this.formGroupUpload.setValue({
                        FilePdfSuratPermohonan: "",
                        FileDocSuratPermohonan: "",
                        FilePdfObjekSengketa: "",
                        FilePdfBuktiBayar: "",
                        FilePdfSkk: "",
                        FilePdfSkp: "",
                        AktaPerusahaan: this.model.AktaPerusahaan,
                    });

                    if (this.model.RefJenisPajakId != null)
                        this.selectedPajak = this.modelJenisPajak.filter(x => x.RefJenisPajakId == this.model.RefJenisPajakId)[0];

                });
            }
        });
    }

    onNoClick() {
        this.router.navigate(['/permohonan/validasi']);
    }

    createForm() {
        // create form
        this.formGroup = this.formBuilder.group({
            RefJenisPermohonanId: ["", Validators.required],
            NoSuratPermohonan: ["", Validators.required],
            TglSuratPermohonan: ["", Validators.required],
            TglTerimaPermohonan: ["", Validators.required],
            TglKirimPermohonan: ["", Validators.required],
            RefCaraKirimPermohonanUr: [""],
            RefJenisPajakId: ["", Validators.required],
            NoKep: ["", Validators.required],
            TglKep: ["", Validators.required],
            TglTerimaKep: ["", Validators.required],
            NoSkp: ["", Validators.required],
            TglSkp: ["", Validators.required],
            PemohonName: [""],
            MasaPajakAwalBulan: ["", Validators.required],
            MasaPajakAkhirBulan: ["", Validators.required],
            MasaPajakAwalTahun: ["", Validators.required],
        });

        this.formGroupUpload = this.formBuilder.group({
            FilePdfSuratPermohonan: [""],
            FileDocSuratPermohonan: [""],
            FilePdfObjekSengketa: [""],
            FilePdfBuktiBayar: [""],
            FilePdfSkk: [""],
            FilePdfSkp: [""],
            AktaPerusahaan: [""],
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

    onOkUploadClick() {
        this.model.AktaPerusahaan = this.formGroupUpload.controls['AktaPerusahaan'].value;
        this.uploadPathFilePdfSuratPermohonan = this.model.PermohonanId + "/" + this.berkasPath1;
        this.model.RefStatusId = 120;
        let fiPdfSuratPermohonan = this.filePdfSuratPermohonan.nativeElement;
        if (fiPdfSuratPermohonan.files && fiPdfSuratPermohonan.files[0]) {
            let fiPdfSuratPermohonanToUpload = fiPdfSuratPermohonan.files[0];
            this.model.FilePdfSuratPermohonan = fiPdfSuratPermohonan.files[0].name;
            if (fiPdfSuratPermohonanToUpload.type == 'application/pdf' && fiPdfSuratPermohonanToUpload.size < 20971521) {
                this.upload(fiPdfSuratPermohonanToUpload, this.uploadPathFilePdfSuratPermohonan);

            }
            else
                this.snackBarService.showSnackBar("success", "Dokumen Permohonan Pdf Gagal ditambahkan");
        }


        this.uploadPathFileDocSuratPermohonan = this.model.PermohonanId + "/" + this.berkasPath2;

        let fiDocSuratPermohonan = this.fileDocSuratPermohonan.nativeElement;
        if (fiDocSuratPermohonan.files && fiDocSuratPermohonan.files[0]) {
            let fiDocSuratPermohonanToUpload = fiDocSuratPermohonan.files[0];
            this.model.FileDocSuratPermohonan = fiDocSuratPermohonan.files[0].name;
            if (fiDocSuratPermohonanToUpload.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && fiDocSuratPermohonanToUpload.size < 20971521) {
                this.upload(fiDocSuratPermohonanToUpload, this.uploadPathFileDocSuratPermohonan);
            }
            else
                this.snackBarService.showSnackBar("success", "Dokumen Permohonan Doc Gagal ditambahkan");
        }

        this.uploadPathFilePdfObjekSengketa = this.model.PermohonanId + "/" + this.berkasPath3;

        let fiPdfObjekSengketa = this.filePdfObjekSengketa.nativeElement;
        if (fiPdfObjekSengketa.files && fiPdfObjekSengketa.files[0]) {
            let fiPdfObjekSengketaToUpload = fiPdfObjekSengketa.files[0];
            this.model.FilePdfObjekSengketa = fiPdfObjekSengketa.files[0].name;
            if (fiPdfObjekSengketaToUpload.type == 'application/pdf' && fiPdfObjekSengketaToUpload.size < 2097153) {
                this.upload(fiPdfObjekSengketaToUpload, this.uploadPathFilePdfObjekSengketa);
            }
            else
                this.snackBarService.showSnackBar("success", "Dokumen Objek Sengketa Gagal ditambahkan");
        }

        /*
        this.uploadPathFilePdfBuktiBayar= this.model.PermohonanId + "/" + this.berkasPath4;

        let fiPdfBuktiBayar = this.filePdfBuktiBayar.nativeElement;
        if (fiPdfBuktiBayar.files && fiPdfBuktiBayar.files[0]) {
            console.log(fiPdfBuktiBayar);
            let fiPdfBuktiBayarToUpload = fiPdfBuktiBayar.files[0];
            this.model.FilePdfBuktiBayar = fiPdfBuktiBayarToUpload.files[0].name;
            if (fiPdfBuktiBayarToUpload.type == 'application/pdf' && fiPdfBuktiBayarToUpload.size < 2097153) {
                this.upload(fiPdfBuktiBayarToUpload, this.uploadPathFilePdfBuktiBayar);
            }
            else
                this.snackBarService.showSnackBar("success", "Dokumen Bukti Bayar Gagal ditambahkan");
        }
        */
        /*
        this.uploadPathFilePdfSkk = this.model.PermohonanId + "/" + this.berkasPath5;

        let fiPdfSkk = this.filePdfSkk.nativeElement;
        if (fiPdfSkk.files && fiPdfSkk.files[0]) {
            let fiPdfSkkToUpload = fiPdfSkk.files[0];
            this.model.FilePdfSkk = fiPdfSkkToUpload.files[0].name;
            if (fiPdfSkkToUpload.type == 'application/pdf' && fiPdfSkkToUpload.size < 2097153) {
                this.upload(fiPdfSkkToUpload, this.uploadPathFilePdfSkk);
            }
            else 
                this.snackBarService.showSnackBar("success", "Dokumen Surat Kuasa Khusus Gagal ditambahkan");
        }
        */
        this.uploadPathFilePdfSkp = this.model.PermohonanId + "/" + this.berkasPath6;

        let fiPdfSkp = this.filePdfSkp.nativeElement;
        if (fiPdfSkp.files && fiPdfSkp.files[0]) {
            let fiPdfSkpToUpload = fiPdfSkp.files[0];
            this.model.FilePdfSkp = fiPdfSkp.files[0].name;
            if (fiPdfSkpToUpload.type == 'application/pdf' && fiPdfSkpToUpload.size < 2097153) {

                this.upload(fiPdfSkpToUpload, this.uploadPathFilePdfSkp);
            }
            else
                this.snackBarService.showSnackBar("success", "Dokumen SKP Gagal ditambahkan");
        }

        this.saveKelengkapan();

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
    onOkClick() {
        const TglSuratPermohonan = new Date(this.formGroup.controls['TglSuratPermohonan'].value);
        const TglTerimaPermohonan = new Date(this.formGroup.controls['TglTerimaPermohonan'].value);
        const TglKep = new Date(this.formGroup.controls['TglKep'].value);
        const TglSkp = new Date(this.formGroup.controls['TglSkp'].value);

        // prepare model to be sent
        this.model.RefJenisPermohonanId = this.formGroup.controls['RefJenisPermohonanId'].value;
        this.model.NoSuratPermohonan = this.formGroup.controls['NoSuratPermohonan'].value;
        this.model.TglSuratPermohonan = new Date(Date.UTC(TglSuratPermohonan.getFullYear(), TglSuratPermohonan.getMonth(), TglSuratPermohonan.getDate()));
        this.model.TglTerimaPermohonan = new Date(Date.UTC(TglTerimaPermohonan.getFullYear(), TglTerimaPermohonan.getMonth(), TglTerimaPermohonan.getDate()));
        this.model.RefCaraKirimPermohonanId = 4;
        this.model.RefJenisPajakId = this.formGroup.controls['RefJenisPajakId'].value.RefJenisPajakId;
        this.model.NoKep = this.formGroup.controls['NoKep'].value;
        this.model.TglKep = new Date(Date.UTC(TglKep.getFullYear(), TglKep.getMonth(), TglKep.getDate()));
        this.model.NoSkp = this.formGroup.controls['NoSkp'].value;
        this.model.TglSkp = new Date(Date.UTC(TglSkp.getFullYear(), TglSkp.getMonth(), TglSkp.getDate()));
        this.model.MasaPajakAwalBulan = this.formGroup.controls['MasaPajakAwalBulan'].value;
        this.model.MasaPajakAkhirBulan = this.formGroup.controls['MasaPajakAkhirBulan'].value;
        this.model.MasaPajakAwalTahun = this.formGroup.controls['MasaPajakAwalTahun'].value;
        this.model.PemohonId = this.model.PemohonId;
        this.model.RefStatusId = 120;
        this.savePermohonan();
    }

    onOkSendClick() {
        this.onOkClick();
        this.router.navigate(['/permohonan/informationValidasi', this.model.PermohonanId]);
    }

    private saveKelengkapan(): void {
        this.permohonanservice.updateKelengkapan(this.model).subscribe(result => {
            this.ngOnInit();
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil diubah");
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
            });
    }

    private savePermohonan(): void {

        this.permohonanservice.updatePermohonan(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil diubah");
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
            });
    }


}
