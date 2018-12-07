import { Component, OnInit, Inject } from '@angular/core';
import { RefHakim } from '../../models/ref-hakim';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { RefHakimService } from '../../services/ref-hakim.service';

@Component({
    selector: 'ref-hakim-form',
    templateUrl: './ref-hakim-form.component.html',
    styleUrls: ['./ref-hakim-form.component.css'],
    providers: [RefHakimService]
})
export class RefHakimFormComponent implements OnInit {
    model: RefHakim;
    formGroup: FormGroup;
    isEdit = false;
    apiResult: any;

    constructor(
        private _service: RefHakimService,
        public dialogRef: MatDialogRef<RefHakimFormComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.model = {} as RefHakim;
        // prepare model
        if (this.data != null) {
            // edit
            this.isEdit = true;
            this.model = this.data; // asumsi yang dilempar oleh data adalah object RefAlasan
            this.formGroup.setValue({
                //refHakimId: this.model.RefHakimId,
                nama: this.model.Nama,
                nik: this.model.Nik,
                pegawaiId: this.model.PegawaiId
            });
        }
    }

    createForm() {
        // create form
        this.formGroup = this.formBuilder.group({
            //refHakimId: ["", Validators.required],
            nama: ["", Validators.required],
            nik: ["", Validators.required],
            pegawaiId: ["", Validators.required]
        });
    }

    /* EVENTS */
    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        // prepare model to be sent
        this.model.Nama = this.formGroup.controls['nama'].value;
        this.model.Nik = this.formGroup.controls['nik'].value;
        this.model.PegawaiId = this.formGroup.controls['pegawaiId'].value;
        this.dialogRef.close(this.model);
    }

    onCari() {
        this._service
            .getNamaByNip(this.formGroup.controls['nik'].value)
            .subscribe(result => {
                this.apiResult = result;
                console.log(this.apiResult);
                this.formGroup.patchValue({
                    nama: this.apiResult.Nama,
                    nik: this.apiResult.NIP18,
                    pegawaiId: this.apiResult.IDPegawai
                });
                this.model.Nama = this.apiResult.Nama;
                this.model.Nik = this.apiResult.NIP18;
                this.model.PegawaiId = this.apiResult.IDPegawai;
            });
    }
}
