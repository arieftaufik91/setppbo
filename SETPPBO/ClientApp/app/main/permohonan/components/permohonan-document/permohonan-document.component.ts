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
    selector: 'app-permohonan-document',
    templateUrl: './permohonan-document.component.html',
    styleUrls: ['./permohonan-document.component.css'],
    providers: [PermohonanService, KelengkapanService]

})
export class PermohonanDocumentComponent implements OnInit {
    model: Permohonan;
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


    progress: number;

    status1: number;
    status2: number;
    status3: number;
    status4: number;
    status5: number;
    status6: number;

    constructor(
        private formBuilder: FormBuilder,
        private permohonanservice: PermohonanService,
        private kelengkapanservice: KelengkapanService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private snackBarService: PuiSnackbarService,

    ) {
        this.createForm();

    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            File1Id: [""],
            File2Id: [""],
            File3Id: [""],
            File4Id: [""],
            File5Id: [""],
            File6Id: [""]
        });

    }
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.permohonanservice.getKelengkapanById(params["id"]).subscribe(result => {
                this.model = result;
            });
        });
    }

    onOkClick() {
        this.status1 = 0;
        this.status2 = 0;
        this.status3 = 0;
        this.status4 = 0;
        this.status5 = 0;
        this.status6 = 0;

        this.uploadPath1 = this.model.PermohonanId + "/" + this.berkasPath1;

        let fi1 = this.fileInput1.nativeElement;
        if (fi1.files && fi1.files[0]) {
            let fileToUpload = fi1.files[0];
//            this.model.File1Id = fi1.files[0].name;
            this.upload(fileToUpload, this.uploadPath1);
        }

        this.uploadPath2 = this.model.PermohonanId + "/" + this.berkasPath2;

        let fi2 = this.fileInput2.nativeElement;
        if (fi2.files && fi2.files[0]) {
            let fileToUpload = fi2.files[0];
  //          this.model.File2Id = fi2.files[0].name;
            this.upload(fileToUpload, this.uploadPath2);
        }

        this.uploadPath3 = this.model.PermohonanId + "/" + this.berkasPath3;

        let fi3 = this.fileInput3.nativeElement;
        if (fi3.files && fi3.files[0]) {
            let fileToUpload = fi3.files[0];
    //        this.model.File3Id = fi3.files[0].name;
            this.upload(fileToUpload, this.uploadPath3);
        }

        this.uploadPath4 = this.model.PermohonanId + "/" + this.berkasPath4;

        let fi4 = this.fileInput4.nativeElement;
        if (fi4.files && fi4.files[0]) {
            let fileToUpload = fi4.files[0];
      //      this.model.File4Id = fi4.files[0].name;
            this.upload(fileToUpload, this.uploadPath4);
        }

        this.uploadPath5 = this.model.PermohonanId + "/" + this.berkasPath5;

        let fi5 = this.fileInput5.nativeElement;
        if (fi5.files && fi5.files[0]) {
            let fileToUpload = fi5.files[0];
        //    this.model.File5Id = fi5.files[0].name;
            this.upload(fileToUpload, this.uploadPath5);
        }

        this.uploadPath6 = this.model.PermohonanId + "/" + this.berkasPath6;

        let fi6 = this.fileInput6.nativeElement;
        if (fi6.files && fi6.files[0]) {
            let fileToUpload = fi6.files[0];
          //  this.model.File6Id = fi6.files[0].name;
            this.upload(fileToUpload, this.uploadPath6);
        }

        this.snackBarService.showSnackBar("success", "Dokumen Permohonan Berhasil ditambahkan");
        this.router.navigate(['/permohonan']);

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


}
