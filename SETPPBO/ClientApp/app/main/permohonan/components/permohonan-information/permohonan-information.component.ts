import { Component, OnInit, ViewChild } from '@angular/core';
import { Permohonan } from '../../models/permohonan';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { PermohonanService } from '../../services/permohonan.service';
import { KelengkapanService } from '../../services/kelengkapan.service';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';

@Component({
  selector: 'app-permohonan-information',
  templateUrl: './permohonan-information.component.html',
  styleUrls: ['./permohonan-information.component.css'],
  providers: [PermohonanService, KelengkapanService]
})
export class PermohonanInformationComponent implements OnInit {
    model: Permohonan;
    formGroup: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private permohonanservice: PermohonanService,
        private kelengkapanservice: KelengkapanService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private snackBarService: PuiSnackbarService,
    )
    {
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
        this.model.RefStatusId = 110;
        this.permohonanservice.update(this.model).subscribe(result => {
            this.snackBarService.showSnackBar("success", "Data Permohonan Berhasil ditambahkan");
            this.router.navigate(['/permohonan']);
        },
            (error) => {
                this.snackBarService.showSnackBar("error", "Permohonan gagal disimpan");
            });


    }
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            // edit
            if (params["id"]) {
                this.permohonanservice.getKelengkapanById(params["id"]).subscribe(result => {
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
