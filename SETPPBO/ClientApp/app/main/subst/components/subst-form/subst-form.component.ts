import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Subst } from "../../models/subst";
import { RefPengirim } from "../../models/refPengirim";
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SubstService } from "../../services/subst.service";
//import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { HttpParams } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
//upload URL
const uploadURL ='ftp://10.242.77.90/setpp/';


@Component({
  selector: 'app-subst-form',
  templateUrl: './subst-form.component.html',
  styleUrls: ['./subst-form.component.css'],
  providers: [SubstService, RefcarakirimpermohonanService]
})
export class SubstFormComponent implements OnInit {

  model: Subst;
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;
  progress: number;  
  modelCaraKirim: Refcarakirimpermohonan[];
  listSender: RefPengirim[];
  selectedSender: RefPengirim;
  pemohonPath: string;
  berkasPath: string = "SubSt";
  uploadPath: string;
  isSentByPostman: boolean = false;
  formReady: boolean = true;
  statusUpload: boolean = true;
  isUpload: boolean = false;
  isFailed: boolean = false;  
  
  @ViewChild("file") fileInput: any;
  @ViewChild("file1") fileInput1: any;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<SubstFormComponent>,   
    private formBuilder: FormBuilder,   
    private refcarakirimservice: RefcarakirimpermohonanService,
    private substservice: SubstService,
    private snackBarService: PuiSnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.model = this.data;
  }

  editForm() {
    if (this.formGroup.controls['TglKirimSubSt'].value !== "") this.formReady = true;
    else this.formReady = true;
  }

  getCaraKirimPos() {
    let i = this.modelCaraKirim.find(caraKirim => caraKirim.Uraian.toLowerCase() == "pos");
    if (i != null) {
      return i.RefCaraKirimId;
    }
    return 0;
  }

  checkSender() {
    if (this.formGroup.controls['RefCaraKirimSubStId'].value === this.getCaraKirimPos()) {
      this.isSentByPostman = true;
      this.formReady = false;
    } else {
      this.isSentByPostman = false;
      this.formReady = true;
      this.formGroup.patchValue({
        TglKirimSubSt : ""
      })
    }
  }

  createForm() {
    // create form
    this.refcarakirimservice.getAll().subscribe(result => {
        this.modelCaraKirim = result;
    });

    this.formGroup = new FormGroup({
        NoSengketa: new FormControl({ value: this.data.NoSengketa, disabled: true }, Validators.required),
        NoSubSt: new FormControl('', [Validators.required, Validators.maxLength(256)]),
        TglSubSt: new FormControl('', Validators.required),
        TglTerimaSubSt: new FormControl('', Validators.required),
        RefCaraKirimSubStId: new FormControl('', Validators.required),
        TglKirimSubSt: new FormControl({ value: '', disabled: !this.isSentByPostman}, this.isSentByPostman ? Validators.required : null),
        NamaPengirimSubSt:  new FormControl('', Validators.required),
        AlamatPengirimSubSt: new FormControl('', [Validators.required, Validators.maxLength(512)]),
        KotaPengirimSubSt: new FormControl('', [Validators.required, Validators.maxLength(64)]),
        KodePosPengirimSubSt:  new FormControl('', [Validators.required, Validators.maxLength(6)]),
        TglTerimaAbgSubSt: new FormControl('', Validators.required)
    });

    this.substservice.getDaftarPengirim(this.data.OrganisasiId).subscribe(result => {
        this.listSender = result;
        if (this.model.NamaUpTermohon != null) {
            this.selectedSender = this.listSender.filter(x => x.UraianOrganisasi == this.model.NamaUpTermohon)[0];
            this.formGroup.patchValue({
              AlamatPengirimSubSt : this.selectedSender.Alamat,
              KotaPengirimSubSt : this.selectedSender.Kota,
              KodePosPengirimSubSt : this.selectedSender.KodePos,
            })
        }
    });

    
  }

  //fungsi upload
  upload(file:any, path: string) {

    const formData = new FormData();
    formData.append(file.name, file);
    let params = new HttpParams(); 
    params = params.append('param', path);

    const uploadReq = new HttpRequest('POST', `api/UploadFile/UploadSubst`, formData, {
      reportProgress: true, params :params,
    });

    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded);
      }
      else if (event.type === HttpEventType.Response){
        if (event.body=="Upload Success"){
          if (this.statusUpload) this.statusUpload = true;
        } else {
          this.statusUpload = false;
          this.snackBarService.showSnackBar("Gagal", "File Gagal Diunggah, Silahkan Coba Lagi!");
        }
      }
        
    });

  }

  changeSender() {
    this.formGroup.patchValue({
      AlamatPengirimSubSt : this.selectedSender.Alamat,
      KotaPengirimSubSt : this.selectedSender.Kota,
      KodePosPengirimSubSt : this.selectedSender.KodePos,
    })
  }

  /* EVENTS */
  onNoClick() {
      this.dialogRef.close();
  }

  fileSizeHandler (file: any) {

    if (file.size > 20000000) {
      return false;
    } else {
      return true;
    }
  }

  onOkClick() {
    
      this.isUpload = true;
      this.statusUpload = true;
      this.isFailed = false;

      let fi = this.fileInput.nativeElement;
      let i = this.fileInput1.nativeElement;

      const TglSubSt = new Date(this.formGroup.controls['TglSubSt'].value);
      const TglTerimaSubSt = new Date(this.formGroup.controls['TglTerimaSubSt'].value);
      const TglTerimaAbgSubSt = new Date(this.formGroup.controls['TglTerimaAbgSubSt'].value);
      const TglKirimSubSt = new Date(this.formGroup.controls['TglKirimSubSt'].value);

      this.uploadPath =this.model.PermohonanId+"/"+this.berkasPath;

      if(fi.files[0] === undefined) {} else {
        if (this.fileSizeHandler(fi.files[0]) && (fi.files[0].name.replace(/^.*\./, '') == 'doc' || fi.files[0].name.replace(/^.*\./, '') == 'docx')) {
          if (fi.files && fi.files[0]) {
            let fileToUpload = fi.files[0];
            this.model.FileDocSubSt = fi.files[0].name;
            this.upload(fileToUpload,this.uploadPath);
          }
        } else {
          this.snackBarService.showSnackBar("Gagal", "Silahkan Unggah Kembali File Sub/St Sesuai Dengan Ketentuan!");
          this.statusUpload = false;
          this.isFailed = true;
        }
      }
  
      if(i.files[0] === undefined) {} else {
        if (this.fileSizeHandler(i.files[0]) && i.files[0].name.replace(/^.*\./, '') == 'pdf') {      
          if (i.files && i.files[0]) {
            let fileToUpload = i.files[0];
            this.model.FilePdfSubSt = i.files[0].name;
            this.upload(fileToUpload,this.uploadPath);
          }
        } else {
          this.snackBarService.showSnackBar("Gagal", "Silahkan Unggah Kembali File Sub/St Sesuai Dengan Ketentuan!");
          this.statusUpload = false;
          this.isFailed = true;
        }
      }
      
      setTimeout(() => {
        if (!this.isFailed) {
            // prepare model to be sent
            this.model.NoSengketa = this.formGroup.controls['NoSengketa'].value;
            this.model.NoSubSt = this.formGroup.controls['NoSubSt'].value;
            this.model.TglSubSt = new Date(Date.UTC(TglSubSt.getFullYear(), TglSubSt.getMonth(), TglSubSt.getDate()));
            this.model.TglTerimaSubSt = new Date(Date.UTC(TglTerimaSubSt.getFullYear(), TglTerimaSubSt.getMonth(), TglTerimaSubSt.getDate()));
            this.model.RefCaraKirimSubStId = this.formGroup.controls['RefCaraKirimSubStId'].value;
            if (this.formGroup.controls['TglKirimSubSt'].value != null) this.model.TglKirimSubSt = new Date(Date.UTC(TglKirimSubSt.getFullYear(), TglKirimSubSt.getMonth(), TglKirimSubSt.getDate()));
            //this.model.NamaPengirimSubSt = this.formGroup.controls['NamaPengirimSubSt'].value;
            this.model.NamaPengirimSubSt = this.selectedSender.UraianOrganisasi;
            this.model.AlamatPengirimSubSt = this.formGroup.controls['AlamatPengirimSubSt'].value;
            this.model.KotaPengirimSubSt = this.formGroup.controls['KotaPengirimSubSt'].value;
            this.model.KodePosPengirimSubSt = this.formGroup.controls['KodePosPengirimSubSt'].value;
            this.model.TglTerimaAbgSubSt = new Date(Date.UTC(TglTerimaAbgSubSt.getFullYear(), TglTerimaAbgSubSt.getMonth(), TglTerimaAbgSubSt.getDate()));    
        }
        this.isFailed = false;
        this.isUpload = false;
        if (this.statusUpload || (i.files[0] === undefined && fi.files[0] === undefined)) this.dialogRef.close(this.model);
      }, 500);
  }
}

