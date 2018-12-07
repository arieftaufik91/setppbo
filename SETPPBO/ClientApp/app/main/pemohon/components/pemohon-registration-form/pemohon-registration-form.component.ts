import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Pemohon } from "../../models/pemohon";
import { Kota } from "../../models/kota";
import { Provinsi } from "../../models/provinsi";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PemohonService } from '../../services/pemohon.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';

@Component({
    selector: 'pemohon-registration-form',
    templateUrl: './pemohon-registration-form.component.html',
    styleUrls: ['./pemohon-registration-form.component.css'],
    providers: [PemohonService]
})
export class PemohonRegistrationFormComponent implements OnInit {
    model: Pemohon;
    formGroup: FormGroup;
    isEdit = false;

    kota: Kota[] = [];
    provinsi: Provinsi[] = [];
    selectedKota: Kota;
    selectedProvinsi: Provinsi;

    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    phonePattern = "^[\d \-\(\)\+]*$";
    numberPattern = "^[\d]*$";

    @ViewChild("fileN") fileNID: any; //~

    constructor(
        private snackbar: PuiSnackbarService,
        private _service: PemohonService,
        public dialogRef: MatDialogRef<PemohonRegistrationFormComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createForm();
    }

    ngOnInit() {
    }

    createForm() {
        if (this.data != null) {
            this.isEdit = true;
            // create form
            //~ set default value on new form object
            this.formGroup = this.formBuilder.group({
                nama: ["", Validators.required],
                npwp: ["", Validators.required],
                contactPerson: ["", Validators.required],
                alamat: ["", Validators.required],
                kota: ["", Validators.required],
                provinsi: [""],
                kodePos: ["", Validators.required],
                email: ["", Validators.required],
                //~
                //fileNpwpForm: [""]
            });
        } else {
            this.isEdit = false;
            // create form - update (no file)
            //~ set default value on new form object
            this.formGroup = this.formBuilder.group({
                nama: ["", Validators.required],
                npwp: ["", Validators.required],
                contactPerson: ["", Validators.required],
                alamat: ["", Validators.required],
                kota: ["", Validators.required],
                provinsi: [""],
                kodePos: ["", Validators.required],
                email: ["", Validators.required],
                //~
                fileNpwpForm: [""]
            });
        }

        this.model = {} as Pemohon;

        //~ inject data for update
        if (this.data != null) {
            this.isEdit = true;

            this._service.getById(this.data.PemohonId).subscribe(result => {
                this.model = result;

                //~ get list of provinsis, and select provinsi by default
                //~ update list provinsi
                this._service.getProvinsi().subscribe(resultProvinsis => {
                    this.provinsi = resultProvinsis;

                    //~ get first item for default provinsi if needed
                    let firstProv: any;
                    firstProv = this.provinsi.shift();

                    //~ update list kota
                    if (result.RefKotaId != null) {
                        //~ get detail kota
                        this._service.getKotaById(result.RefKotaId).subscribe(resultKota => {
                            //~ get list  of kota based on ID Provinsi
                            this._service.getKotaByProvinsi(resultKota.IDRefProvinsi).subscribe(resultKotas => {
                                this.kota = resultKotas;
                                this.selectedKota = resultKota;
                                //~ (filter) update list province, by resultKota idProvince
                                this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == resultKota.IDRefProvinsi)[0];
                            });
                        });
                    } else if ((result.RefKotaId == null || result.RefKotaId == undefined) && result.Kota != null) {
                        //~ if no refkotaid and kota is not null, then should be able to find kota by keyword, then if found, get provinsi
                        this._service.GetKotaByName(result.Kota).subscribe(resultKota => {
                            //~ if found by name
                            if (resultKota != null) {
                                //~ update kota by its provinsiID
                                this._service.getKotaByProvinsi(resultKota.IDRefProvinsi).subscribe(resultKotas => {
                                    this.kota = resultKotas;

                                    this.selectedKota = this.kota.filter(x => x.IDRefKota == resultKota.IDRefKota)[0];
                                    this.selectedProvinsi = this.provinsi.filter(x => x.IDRefProvinsi == resultKota.IDRefProvinsi)[0];
                                });
                            } else {
                                //~ if not found by name, then get default, but leave kota as is
                                this.selectedProvinsi = firstProv;
                                this._service.getKotaByProvinsi(this.selectedProvinsi.IDRefProvinsi).subscribe(resultKotas => {
                                    this.kota = resultKotas;

                                    //~ empty id
                                    this.selectedKota = new Kota();
                                    this.selectedKota.IDRefKota = 0;
                                    this.selectedKota.IDRefProvinsi = 0;
                                    this.selectedKota.KodeKota = '';
                                    this.selectedKota.NamaKota = result.Kota;
                                });
                            }
                        });
                    } else {
                        this.getListKotaProvinsi();
                    }

                    this.formGroup.setValue({
                        nama: this.model.Nama,
                        npwp: this.model.Npwp,
                        contactPerson: this.model.ContactPerson,
                        alamat: this.model.Alamat,
                        kota: this.model.Kota,
                        provinsi: [""],
                        kodePos: this.model.KodePos,
                        email: this.model.Email,
                        //~
                        //fileNpwpForm: this.model.NpwpFileId
                        //fileNpwpForm: true //~ made blank
                    });
                });
            });
        } else {
            this.getListKotaProvinsi();
        }
    }

    //~ get list provinsi
    getListProvinsi() {
        this._service.getProvinsi().subscribe(result => {
            this.provinsi = result;
        });
    }

    //~ get list kota by provinsiID
    getListKotaByProvinsi(idRefProvinsi: number) {
        this._service.getKotaByProvinsi(idRefProvinsi).subscribe(result => {
            this.kota = result;
        });
    }

    //~ get list kota and provinsi by by default
    getListKotaProvinsi() {
        this._service.getProvinsi().subscribe(resultProvinsis => {
            this.provinsi = resultProvinsis;

            let firstProv: any;
            firstProv = this.provinsi.shift();
            this.selectedProvinsi = firstProv;

            if (resultProvinsis != null || resultProvinsis != undefined) {
                this._service.getKotaByProvinsi(firstProv.IDRefProvinsi).subscribe(resultKotas => {
                    this.kota = resultKotas;

                    let firstKota: any;
                    firstKota = this.kota.shift();
                    this.selectedKota = firstKota;
                });
            }
        });
    }

    /* EVENTS */
    onNoClick() {
        this.dialogRef.close();
    }

    onOkClick() {
        // prepare model to be sent
        this.model.Nama = this.formGroup.controls['nama'].value;
        this.model.Npwp = this.formGroup.controls['npwp'].value;
        this.model.ContactPerson = this.formGroup.controls['contactPerson'].value;
        this.model.Alamat = this.formGroup.controls['alamat'].value;
        this.model.RefKotaId = this.selectedKota.IDRefKota;
        this.model.Kota = this.selectedKota.NamaKota;
        this.model.KodePos = this.formGroup.controls['kodePos'].value;
        this.model.Email = this.formGroup.controls['email'].value;

        //~ file

        const formData = new FormData();

        let nid = this.fileNID.nativeElement;
        if (nid.files && nid.files[0]) {
            let fileToUpload = nid.files[0];

            //~ check file
            if (!this._service.checkFile(fileToUpload)) {
                this.snackbar.showSnackBar("error", "File invalid");
            } else {
                formData.append("file", fileToUpload);
                formData.append("data", JSON.stringify(this.model));

                this.dialogRef.close(formData);
            }
        } else {
            this.snackbar.showSnackBar("error");
            this.dialogRef.close();
        }
    }

    onUpdateClick() {
        // prepare model to be sent
        this.model.Nama = this.formGroup.controls['nama'].value;
        //this.model.Npwp = this.formGroup.controls['npwp'].value;
        this.model.ContactPerson = this.formGroup.controls['contactPerson'].value;
        this.model.Alamat = this.formGroup.controls['alamat'].value;
        this.model.RefKotaId = this.selectedKota.IDRefKota;
        this.model.Kota = this.selectedKota.NamaKota;
        this.model.KodePos = this.formGroup.controls['kodePos'].value;
        this.model.Email = this.formGroup.controls['email'].value;

        this.dialogRef.close(this.model);
    }

    //~ view npwp
    onViewNpwp() {
        window.open(window.location.origin + '/api/Pemohon/npwp/v/' + `${this.data.PemohonId}`);
    }

    onChangeProvinsi() {
        this._service.getKotaByProvinsi(this.selectedProvinsi.IDRefProvinsi).subscribe(result => {
            console.log("result prov", result)
            this.kota = result;

            let firstKota: any;
            firstKota = this.kota.shift();
            this.selectedKota = firstKota;
        });
    }
}
