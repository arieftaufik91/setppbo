import { Component, OnInit, Inject } from '@angular/core';
import { Permohonan } from '../../models/permohonan';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Refjenispermohonan } from '../../../referensi/models/refjenispermohonan';
import { RefjenispermohonanService } from '../../../referensi/services/refjenispermohonan.service';
import { RefjenispajakService } from '../../../referensi/services/refjenispajak.service';
import { Refjenispajak } from '../../../referensi/models/refjenispajak';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { Pemohon } from '../../../pemohon/models/pemohon';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PermohonanService } from '../../services/permohonan.service';
import { PemohonService } from '../../../pemohon/services/pemohon.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { SelectItem } from 'primeng/components/common/api';

@Component({
    selector: 'app-permohonan-form',
    templateUrl: './permohonan-form.component.html',
    styleUrls: ['./permohonan-form.component.css'],
    providers: [RefjenispermohonanService, RefjenispajakService, RefcarakirimpermohonanService, PemohonService, PermohonanService]

})
export class PermohonanFormComponent implements OnInit {
    model: Permohonan;
    selectedPajak: Refjenispajak;
    modelJenisPermohonan: Refjenispermohonan[] = [];
    modelJenisPajak: Refjenispajak[] = [];
    modelCaraKirim: Refcarakirimpermohonan[] = [];
    modelPemohon: Pemohon[] = [];
    modelBulan: any;

    formGroup: FormGroup;
    isEdit = false;
    isPos = false;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private refjenispermohonanservice: RefjenispermohonanService,
        private refjenispajakservice: RefjenispajakService,
        private refcarakirimservice: RefcarakirimpermohonanService,
        private pemohonservice: PemohonService,
        private permohonanservice: PermohonanService,
        private snackBarService: PuiSnackbarService,

    ) {
        this.createForm();
    }
    ngOnInit() {
        // prepare model

        this.refjenispermohonanservice.getAll().subscribe(result => {
            this.modelJenisPermohonan = result;
        });

        this.refjenispajakservice.getAll().subscribe(result => {
            this.modelJenisPajak = result;
            this.selectedPajak = result[0];
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

        this.route.params.subscribe((params: Params) => {
            // edit
            if (params["id"]) {
                this.isEdit = true;
                this.formGroup.setValue({
                    RefJenisPermohonanId: this.model.RefJenisPermohonanId,
                    NoSuratPermohonan: this.model.NoSuratPermohonan,
                    TglSuratPermohonan: this.model.TglSuratPermohonan,
                    TglTerimaPermohonan: this.model.TglTerimaPermohonan,
                    TglKirimPermohonan: this.model.TglKirimPermohonan,
                    RefCaraKirimPermohonanId: this.model.RefCaraKirimPermohonanId,
                    TglPos: this.model.TglPos,
                    RefJenisPajakId: this.model.RefJenisPajakId,
                    NoKep: this.model.NoKep,
                    TglKep: this.model.TglKep,
                    NoSkp: this.model.NoSkp,
                    TglSkp: this.model.TglSkp,
                    MasaPajakAwalBulan: this.model.MasaPajakAwalBulan,
                    MasaPajakAkhirBulan: this.model.MasaPajakAkhirBulan,
                    MasaPajakAwalTahun: this.model.MasaPajakAwalTahun,
                    PemohonId: this.model.PemohonId,
                    Npwp: this.model.Npwp,
                });
            }
            else {
                // add
                this.model = {} as Permohonan;

            }

        });
    }

    createForm() {
        // create form
        this.formGroup = this.formBuilder.group({
            RefJenisPermohonanId: ["", Validators.required],
            NoSuratPermohonan: ["", Validators.required],
            TglSuratPermohonan: ["", Validators.required],
            TglTerimaPermohonan: ["", Validators.required],
            RefCaraKirimPermohonanId: ["", Validators.required],
            TglPos: [""],
            RefJenisPajakId: [""],
            NoKep: ["", Validators.required],
            TglKep: ["", Validators.required],
            NoSkp: ["", Validators.required],
            TglSkp: ["", Validators.required],
            PemohonId: [""],
            MasaPajakAwalBulan: ["", Validators.required],
            MasaPajakAkhirBulan: ["", Validators.required],
            MasaPajakAwalTahun: ["", Validators.required],
        });
    }

    onNoClick() {
        this.router.navigate(['/permohonan']);
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
        this.model.RefCaraKirimPermohonanId = this.formGroup.controls['RefCaraKirimPermohonanId'].value;
        this.model.RefJenisPajakId = this.formGroup.controls['RefJenisPajakId'].value.RefJenisPajakId;
        this.model.NoKep = this.formGroup.controls['NoKep'].value;
        this.model.TglKep = new Date(Date.UTC(TglKep.getFullYear(), TglKep.getMonth(), TglKep.getDate()));
        this.model.NoSkp = this.formGroup.controls['NoSkp'].value;
        this.model.TglSkp = new Date(Date.UTC(TglSkp.getFullYear(), TglSkp.getMonth(), TglSkp.getDate()));
        this.model.MasaPajakAwalBulan = this.formGroup.controls['MasaPajakAwalBulan'].value;
        this.model.MasaPajakAkhirBulan = this.formGroup.controls['MasaPajakAkhirBulan'].value;
        this.model.MasaPajakAwalTahun = this.formGroup.controls['MasaPajakAwalTahun'].value;
        this.model.PemohonId = this.formGroup.controls['PemohonId'].value.PemohonId;

        if (this.formGroup.controls['RefCaraKirimPermohonanId'].value == 3) {
            const TglPos = new Date(this.formGroup.controls['TglPos'].value);
            this.model.TglPos = new Date(Date.UTC(TglPos.getFullYear(), TglPos.getMonth(), TglPos.getDate()));
        }

        this.savePermohonan();
    }

    onChangePos() {
        if (this.formGroup.controls['RefCaraKirimPermohonanId'].value == 3) {
            this.isPos = true;
        }
        else {
            this.isPos = false;
        }
    };

    private savePermohonan(): void {
        if (this.isEdit) {

        } else {
            this.permohonanservice.add(this.model).subscribe(result => {
                this.permohonanservice.cekSkpKepById(result.PermohonanId).subscribe(result => {
                    if (result == true) 
                        this.snackBarService.showSnackBar("warning", "Data Permohonan dengan SKP & KEP yang Sama Berhasil ditambahkan");
                    else 
                        this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil ditambahkan");

                },
                    (error) => {
                        this.snackBarService.showSnackBar("error", "Permohonan gagal mengecek");
                    });
//                this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil ditambahkan");
                this.router.navigate(['/permohonan/edit', result.PermohonanId]);
            },
                (error) => {
                    this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
                });

        }
    }
}
