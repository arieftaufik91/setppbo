import { Component, OnInit, Inject } from '@angular/core';
import { RefKodeTermohon } from '../../models/ref-kode-termohon';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RefOrganisasiService } from '../../../referensi/services/ref-organisasi.service';
import { RefOrganisasi } from '../../../referensi/models/ref-organisasi';

@Component({
    selector: 'app-ref-kode-termohon-form',
    templateUrl: './ref-kode-termohon-form.component.html',
    styleUrls: ['./ref-kode-termohon-form.component.css'],
    providers: [RefOrganisasiService]
})
export class RefKodeTermohonFormComponent implements OnInit {
    model: RefKodeTermohon;
    modelOrganisasi: RefOrganisasi[];
    formGroup: FormGroup;
    isEdit = false;

    constructor(
        public dialogRef: MatDialogRef<RefKodeTermohonFormComponent>,
        private formBuilder: FormBuilder,
        private refOrganisasiService: RefOrganisasiService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createForm();
    }


    ngOnInit() {
        this.model = {} as RefKodeTermohon;

        this.refOrganisasiService.getAll().subscribe(result => {
            this.modelOrganisasi = result;
        });

        // prepare model
        if (this.data != null) {
            // edit
            this.isEdit = true;
            this.model = this.data; // asumsi yang dilempar oleh data adalah object RefAlasan
            this.formGroup.setValue({
                OrganisasiId: this.model.OrganisasiId,
                KodeOrganisasi: this.model.KodeOrganisasi,
                 UraianOrganisasi: this.model.UraianOrganisasi,
                 UraianLengkapOrganisasi: this.model.UraianLengkapOrganisasi,
                UraianJabatan: this.model.UraianJabatan,
                KodeSatker: this.model.KodeSatker,
                Alamat: this.model.Alamat,
                KodeSurat: this.model.KodeSurat,
            });
        }
    }

    createForm() {
        // create form
        this.formGroup = this.formBuilder.group({
            OrganisasiId: ["", Validators.required],
            KodeOrganisasi: ["", Validators.required],
            UraianOrganisasi: ["", Validators.required],
            UraianLengkapOrganisasi: ["", Validators.required],
            UraianJabatan: ["", Validators.required],
            KodeSatker: ["", Validators.required],
            Alamat: ["", Validators.required],
            KodeSurat: ["", Validators.required],
        });
    }

    /* EVENTS */
    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        // prepare model to be sent
        this.model.OrganisasiId = this.formGroup.controls['OrganisasiId'].value;
        this.model.KodeOrganisasi = this.formGroup.controls['KodeOrganisasi'].value;
        this.model.UraianOrganisasi = this.formGroup.controls['UraianOrganisasi'].value;
        this.model.UraianLengkapOrganisasi = this.formGroup.controls['UraianLengkapOrganisasi'].value;
        this.model.UraianJabatan = this.formGroup.controls['UraianJabatan'].value;
        this.model.KodeSatker = this.formGroup.controls['KodeSatker'].value;
        this.model.Alamat = this.formGroup.controls['Alamat'].value;
        this.model.KodeSurat = this.formGroup.controls['KodeSurat'].value;
        this.dialogRef.close(this.model);
    }

    
}
