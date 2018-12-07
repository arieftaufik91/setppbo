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
import { PemohonService } from '../../../pemohon/services/pemohon.service';

@Component({
  selector: 'app-permohonan-view',
  templateUrl: './permohonan-view.component.html',
  styleUrls: ['./permohonan-view.component.css']
})
export class PermohonanViewComponent implements OnInit {
    model: Permohonan;

    formGroup: FormGroup;
    isEdit = false;

    constructor(
        public dialogRef: MatDialogRef<PermohonanViewComponent>,
        private formBuilder: FormBuilder,

        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createForm();
    }

    ngOnInit() {
        // prepare model


        if (this.data != null) {
            // edit
            this.isEdit = true;
            this.model = this.data; // asumsi yang dilempar oleh data adalah object Quote
            this.formGroup.setValue({
                RefJenisPermohonanUr: this.model.RefJenisPermohonanUr,
                PemohonName: this.model.PemohonName,
                NoSuratPermohonan: this.model.NoSuratPermohonan,
                TglSuratPermohonan: this.model.TglSuratPermohonan,
                TglTerimaPermohonan: this.model.TglTerimaPermohonan,
                TglKirimPermohonan: this.model.TglKirimPermohonan,
                RefJenisPajakUr: this.model.RefJenisPajakUr,
                NoKep: this.model.NoKep,
                TglKep: this.model.TglKep,
                TglTerimaKep: this.model.TglTerimaKep,
                NoSkp: this.model.NoSkp,
                TglSkp: this.model.TglSkp,
                Npwp: this.model.Npwp,
            });
        } else {
            // add
            this.model = {} as Permohonan;
        }
    }

    createForm() {
        // create form
        this.formGroup = this.formBuilder.group({
            RefJenisPermohonanUr: ["", Validators.required],
            PemohonName: ["", Validators.required],
            NoSuratPermohonan: ["", Validators.required],
            TglSuratPermohonan: ["", Validators.required],
            TglTerimaPermohonan: ["", Validators.required],
            RefJenisPajakUr: ["", Validators.required],
            TglKirimPermohonan: ["", Validators.required],
            NoKep: ["", Validators.required],
            TglKep: ["", Validators.required],
            TglTerimaKep: ["", Validators.required],
            NoSkp: ["", Validators.required],
            TglSkp: ["", Validators.required],
            Npwp: ["", Validators.required],


        });
    }

    /* EVENTS */
    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        // prepare model to be sent
        this.model.RefJenisPermohonanUr = this.formGroup.controls['RefJenisPermohonanUr'].value;
        this.model.PemohonName = this.formGroup.controls['PemohonName'].value;
        this.model.NoSuratPermohonan = this.formGroup.controls['NoSuratPermohonan'].value;
        this.model.TglSuratPermohonan = this.formGroup.controls['TglSuratPermohonan'].value;
        this.model.TglTerimaPermohonan = this.formGroup.controls['TglTerimaPermohonan'].value;
        this.model.TglKirimPermohonan = this.formGroup.controls['TglKirimPermohonan'].value;
        this.model.RefJenisPajakUr = this.formGroup.controls['RefJenisPajakUr'].value;
        this.model.NoKep = this.formGroup.controls['NoKep'].value;
        this.model.TglKep = this.formGroup.controls['TglKep'].value;
        this.model.TglTerimaKep = this.formGroup.controls['TglTerimaKep'].value;
        this.model.NoSkp = this.formGroup.controls['NoSkp'].value;
        this.model.TglSkp = this.formGroup.controls['TglSkp'].value;
        this.model.Npwp = this.formGroup.controls['Npwp'].value;
        this.dialogRef.close(this.model);
    }
}
