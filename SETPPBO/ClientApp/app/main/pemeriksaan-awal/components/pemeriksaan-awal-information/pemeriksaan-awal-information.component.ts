import { Component, OnInit, ViewChild } from '@angular/core';
import { PemeriksaanAwal } from '../../models/pemeriksaan-awal';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { PemeriksaanAwalService } from '../../services/pemeriksaan-awal.service';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
@Component({
    selector: 'app-pemeriksaan-awal-information',
    templateUrl: './pemeriksaan-awal-information.component.html',
    styleUrls: ['./pemeriksaan-awal-information.component.css'],
    providers: [PemeriksaanAwalService]
})

export class PemeriksaanAwalInformationComponent implements OnInit {
    model: PemeriksaanAwal;
    formGroup: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private pemeriksaanAwalservice: PemeriksaanAwalService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private snackBarService: PuiSnackbarService,
    ) {
        this.createForm();
    }
    createForm() {
        this.formGroup = this.formBuilder.group({
            NoPendaftaran: ["", Validators.required],
            RefJenisPermohonanUr: ["", Validators.required],
            NoSuratPermohonan: ["", Validators.required],
            TglSuratPermohonan: ["", Validators.required],
        });

    }

    onOkClick() {
        this.model.RefStatusId = 131;
        this.pemeriksaanAwalservice.update(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil ditambahkan");
            this.router.navigate(['/pemeriksaan-awal']);
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
            });


    }
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            // edit
            if (params["id"]) {
                this.pemeriksaanAwalservice.getKelengkapanById(params["id"]).subscribe(result => {
                    this.createForm();
                    this.model = result;
                    this.formGroup.setValue({
                        NoPendaftaran: this.model.NoPendaftaran,
                        RefJenisPermohonanUr: this.model.RefJenisPermohonanUr,
                        NoSuratPermohonan: this.model.NoSuratPermohonan,
                        TglSuratPermohonan: this.model.TglSuratPermohonan
                    });
                })
            }
        });
    }

}