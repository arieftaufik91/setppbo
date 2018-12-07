import { Component, OnInit, Inject } from '@angular/core';
import { Pemohon } from "../../models/pemohon";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PemohonService } from '../../services/pemohon.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { Http } from "@angular/http";

@Component({
    selector: 'pemohon-verification-form',
    templateUrl: './pemohon-verification-form.component.html',
    styleUrls: ['./pemohon-verification-form.component.css'],
    providers: [PemohonService],
})
export class PemohonVerificationFormComponent implements OnInit {
    item: any;
    model: Pemohon;
    formGroup: FormGroup;
    isEdit = false;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    phonePattern = "^[\d \-\(\)\+]*$";
    numberPattern = "^[\d]*$";
    apiUrl: string = "api/Pemohon";

    constructor(
        private _service: PemohonService,
        private snackbar: PuiSnackbarService,
        public dialogRef: MatDialogRef<PemohonVerificationFormComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private http: Http
    ) {
        this.createForm();
    }

    ngOnInit() {
        // prepare model
        if (this.data != null) {
            console.log("this.data", this.data);
            // edit
            this.isEdit = true;
            this.model = this.data; // asumsi yang dilempar oleh data adalah object Quote
            this.item = this.model;
            this.formGroup.setValue({
                nama: this.model.Nama,
                npwp: this.model.Npwp
            });
        } else {
            // add
            // this.model = new Pemohon();
            this.model = {} as Pemohon;
            this.item = this.model;
        }
    }

    createForm() {
        // create form
        //~ set default value on new form object
        this.formGroup = this.formBuilder.group({
            nama: ["", Validators.required],
            npwp: ["", Validators.required]
        });
    }

    /* EVENTS */
    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        // prepare model to be sent
        //this.model.Nama = this.formGroup.controls['nama'].value;
        //this.model.Npwp = this.formGroup.controls['npwp'].value;

        this.dialogRef.close(this.model);
    }

    //~ not valid
    onNotOkClick() {
        // prepare model to be sent
        // this.model.Nama = this.formGroup.controls['nama'].value;
        // this.model.Npwp = this.formGroup.controls['npwp'].value;

        this._service.unverify(this.model).subscribe(result => {
            this.snackbar.showSnackBar("success", "Pemohon berhasil diverifikasi: Tidak Valid");
        }, (error) => {
            this.snackbar.showSnackBar("error", "Pemohon gagal diverifikasi: Tidak Valid");
        });

        this.dialogRef.close();
    }

    //~ view npwp
    onViewNpwp() {
        window.open(window.location.origin + '/api/Pemohon/npwp/v/' + `${this.model.PemohonId}`);
    }
}
