import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Bantahan } from '../../models/bantahan';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { HttpParams } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { BantahanService } from '../../services/bantahan.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';

const uploadURL ='ftp://10.242.77.90/setpp/';
@Component({
  selector: 'app-bantahan-edit',
  templateUrl: './bantahan-edit.component.html',
  styleUrls: ['./bantahan-edit.component.css'],
  providers: [BantahanService,RefcarakirimpermohonanService]
})
export class BantahanEditComponent implements OnInit {

  isEdit: boolean = false;
  model: Bantahan;
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;
  progress: number;
  caraKirimModel: Refcarakirimpermohonan[];
  statusUpload: boolean = true;
  pemohonPath: string;
  berkasPath: string = "Bantahan";
  uploadPath: string;
  DocFileName: string;
  PdfFileName: string;
  urlDownload: string;
  RefCaraKirimBantahanId = new FormControl();
  caraKirimPos: number;
  formReady: boolean = true;
  isSentByPostman: boolean = false;
  isUpload: boolean = false;
  isFailed: boolean = false;

  @ViewChild("file") fileInput: any;
  @ViewChild("file1") fileInput1: any;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<BantahanEditComponent>,
    private formBuilder: FormBuilder,
    private refCaraKirimService: RefcarakirimpermohonanService,
    private bantahanservice : BantahanService,
    private snackBarService: PuiSnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
   }  
  getCaraKirimPos() {
    let i = this.caraKirimModel.find(caraKirim => caraKirim.Uraian.toLowerCase() == "pos");
    if (i != null) {
      return i.RefCaraKirimId;
    }
    return 0;
  }
  

  ngOnInit() {
    this.model = this.data;
    this.RefCaraKirimBantahanId = new FormControl(this.data.RefCaraKirimBantahanId);
    this.refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
    if (this.RefCaraKirimBantahanId.value === this.getCaraKirimPos()) {
      this.isSentByPostman = true;
    } else {
      this.isSentByPostman = false;
    }
  });
}

/*checkSender() {
    if (this.formGroup.controls['RefCaraKirimBantahanId'].value === 5) {
      this.isSentByPostman = true;
      this.formReady = false;
    } else {
      this.isSentByPostman = false;
      this.formReady = true;
      this.formGroup.patchValue({
        TglKirimBantahan : ""
      })
    }
  }*/


  createForm() {
    // create form
   this.RefCaraKirimBantahanId = new FormControl(this.data.RefCaraKirimBantahanId);    
    this.refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
      if (this.RefCaraKirimBantahanId.value === this.getCaraKirimPos()) {
        this.isSentByPostman = true;
      } else {
        this.isSentByPostman = false;
      }
    });

    this.formGroup = new FormGroup({
      NoSuratBantahan: new FormControl(this.data.NoSuratBantahan,  [Validators.required, Validators.maxLength(256)]),
      TglSuratBantahan: new FormControl(this.data.TglSuratBantahan, Validators.required),
      TglTerimaBantahan: new FormControl(this.data.TglTerimaBantahan, Validators.required),
      TglTerimaAbgBantahan: new FormControl(this.data.TglTerimaAbgBantahan, Validators.required),
      TglKirimBantahan: new FormControl({value: this.data.TglKirimBantahan, disabled: !this.isSentByPostman}),
    });
    this.DocFileName = this.data.FileDocBantahan;
    this.PdfFileName = this.data.FilePdfBantahan;
}

editForm() {
  
  this.isEdit = false;

  let fi = this.fileInput.nativeElement;
  let i = this.fileInput1.nativeElement;

  if (this.model.NoSuratBantahan != this.formGroup.controls['NoSuratBantahan'].value) {
    this.isEdit = true;
  }
  
  if (this.model.TglSuratBantahan != this.formGroup.controls['TglSuratBantahan'].value) {
    this.isEdit = true;      
  }

  if (this.model.TglTerimaBantahan != this.formGroup.controls['TglTerimaBantahan'].value) {
    this.isEdit = true;      
  }

  if (this.model.RefCaraKirimBantahanId != this.RefCaraKirimBantahanId.value) {
    this.isEdit = true;     
  }

  if (this.RefCaraKirimBantahanId.value === this.getCaraKirimPos()) {
    this.isSentByPostman = true;
    this.formGroup.patchValue({
      TglKirimBantahan : this.formGroup.controls['TglKirimBantahan'].value != "" ? this.formGroup.controls['TglKirimBantahan'].value : this.data.TglKirimBantahan
    })
  } else {
    this.isSentByPostman = false;
    this.formGroup.patchValue({
      TglKirimBantahan : ""
    })       
  }

  if (this.model.TglKirimBantahan != this.formGroup.controls['TglKirimBantahan'].value) {
    this.isEdit = true;            
  }

 
  if (this.model.TglTerimaAbgBantahan != this.formGroup.controls['TglTerimaAbgBantahan'].value) {
    this.isEdit = true;                  
  } 

  if (fi.files[0] === undefined) {} else {
    if (this.model.FileDocBantahan != fi.files[0].name) {
      this.isEdit = true;
    }
  }

  if (i.files[0] === undefined) {} else {
    if (this.model.FilePdfBantahan != i.files[0].name) {
      this.isEdit = true;
    }
  }

  if (this.formGroup.controls['TglKirimBantahan'].value == null && this.RefCaraKirimBantahanId.value === this.getCaraKirimPos()) {
    this.isEdit = false;
  }

  if (this.formGroup.invalid) {
    this.isEdit = false;
  }

}  


//fungsi upload
upload(file:any, path: string) {
  
  const formData = new FormData();
  formData.append(file.name, file);
  let params = new HttpParams(); 
  params = params.append('param', path);

  const uploadReq = new HttpRequest('POST', `api/UploadFile/UploadBantahan`, formData, {
    reportProgress: true, params :params,
  });
  
  this.http.request(uploadReq).subscribe(event => {
    if (event.type === HttpEventType.UploadProgress){
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

downloadDocFile() {
  this.bantahanservice.getBaseUrl().subscribe(result => {
    this.urlDownload = result;
    this.urlDownload = this.urlDownload + "/api/DownloadBantahan/doc/Bantahan/"  + this.data.PermohonanId
  });

  setTimeout(() => {
    window.open(this.urlDownload);
  }, 250);
  
}

downloadPdfFile() {
  this.bantahanservice.getBaseUrl().subscribe(result => {
    this.urlDownload = result;
    this.urlDownload = this.urlDownload + "/api/DownloadBantahan/pdf/Bantahan/"  + this.data.PermohonanId
  });

  setTimeout(() => {
    window.open(this.urlDownload);
  }, 250);
  
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

    const TglSuratBantahan = new Date(this.formGroup.controls['TglSuratBantahan'].value);
    const TglTerimaBantahan = new Date(this.formGroup.controls['TglTerimaBantahan'].value);
    const TglKirimBantahan = new Date(this.formGroup.controls['TglKirimBantahan'].value);
    const TglTerimaAbgBantahan = new Date(this.formGroup.controls['TglTerimaAbgBantahan'].value);

    this.uploadPath =this.model.PermohonanId+"/"+this.berkasPath;

if(fi.files[0] === undefined) {} else {
  if (this.fileSizeHandler(fi.files[0]) && (fi.files[0].name.replace(/^.*\./, '') == 'doc' || fi.files[0].name.replace(/^.*\./, '') == 'docx')) {
    if (fi.files && fi.files[0]) {
      let fileToUpload = fi.files[0];
      this.model.FileDocBantahan = fi.files[0].name;
      this.upload(fileToUpload,this.uploadPath);
    }
  } else {
    this.snackBarService.showSnackBar("Gagal", "Silahkan Unggah Kembali File Surat Bantahan Sesuai Dengan Ketentuan!");
    this.statusUpload = false;
    this.isFailed = true;
  }
}

if(i.files[0] === undefined) {} else {
  if (this.fileSizeHandler(i.files[0]) && i.files[0].name.replace(/^.*\./, '') == 'pdf') {      
    if (i.files && i.files[0]) {
      let fileToUpload = i.files[0];
      this.model.FilePdfBantahan = i.files[0].name;
      this.upload(fileToUpload,this.uploadPath);
    }
  } else {
    this.snackBarService.showSnackBar("Gagal", "Silahkan Unggah Kembali File Surat Bantahan Sesuai Dengan Ketentuan!");
    this.statusUpload = false;
    this.isFailed = true;
  }
}

    setTimeout(() => {
      if (!this.isFailed) {
 // prepare model to be sent
      this.model.NoSuratBantahan = this.formGroup.controls['NoSuratBantahan'].value;
      this.model.TglSuratBantahan = new Date(Date.UTC(TglSuratBantahan.getFullYear(), TglSuratBantahan.getMonth(), TglSuratBantahan.getDate()));
      this.model.TglTerimaBantahan = new Date(Date.UTC(TglTerimaBantahan.getFullYear(), TglTerimaBantahan.getMonth(), TglTerimaBantahan.getDate()));
      this.model.RefCaraKirimBantahanId = this.RefCaraKirimBantahanId.value;
      this.model.TglKirimBantahan = this.formGroup.controls['TglKirimBantahan'].value != null ? new Date(Date.UTC(TglKirimBantahan.getFullYear(), TglKirimBantahan.getMonth(), TglKirimBantahan.getDate())) : new Date(0);
      this.model.TglTerimaAbgBantahan = new Date(Date.UTC(TglTerimaAbgBantahan.getFullYear(), TglTerimaAbgBantahan.getMonth(), TglTerimaAbgBantahan.getDate()));
      }

      this.isFailed = false;
      this.isUpload = false;
      if (this.statusUpload || (i.files[0] === undefined && fi.files[0] === undefined)) this.dialogRef.close(this.model);
    }, 500);
  }
}
