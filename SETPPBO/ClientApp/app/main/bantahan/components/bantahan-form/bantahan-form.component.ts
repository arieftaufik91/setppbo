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
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
//upload URL
const uploadURL ='ftp://10.242.77.90/setpp/';
@Component({
  selector: 'app-bantahan-form',
  templateUrl: './bantahan-form.component.html',
  styleUrls: ['./bantahan-form.component.css'],
  providers: [RefcarakirimpermohonanService]
})
export class BantahanFormComponent implements OnInit {
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
  isSentByPostman: boolean = false;
  formReady: boolean = true;
  RefCaraKirimBantahanId = new FormControl();
  isUpload: boolean = false; 
  isFailed: boolean = false; 

  @ViewChild("file") fileInput: any;
  @ViewChild("file1") fileInput1: any;
  
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<BantahanFormComponent>,
    private formBuilder: FormBuilder,
    private refCaraKirimService: RefcarakirimpermohonanService,
    private snackBarService: PuiSnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Bantahan
  ) {
    this.createForm();
  }
  ngOnInit() {
    this.model = this.data;
  }

editForm() {
  if (this.formGroup.controls['TglKirimBantahan'].value !== "") this.formReady = true;
  else this.formReady = true;
}  

checkSender() {
    if (this.formGroup.controls['RefCaraKirimBantahanId'].value === 3) {
      this.isSentByPostman = true;
      this.formReady = false;
    } else {
      this.isSentByPostman = false;
      this.formReady = true;
      this.formGroup.patchValue({
        TglKirimBantahan : ""
      })
    }
  }

  createForm() {
    // create form
    this.refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;   
    });
    
    this.formGroup = new FormGroup({
      NoSuratBantahan: new FormControl('', [Validators.required, Validators.maxLength(256)]),
      TglSuratBantahan: new FormControl('', Validators.required),
      TglTerimaBantahan: new FormControl('', Validators.required),
      RefCaraKirimBantahanId: new FormControl('', Validators.required),
      TglKirimBantahan: new FormControl ({ value: '', disabled: !this.isSentByPostman}, this.isSentByPostman ? Validators.required : null),
      TglTerimaAbgBantahan:  new FormControl('', Validators.required)
    });
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
    this.model.TglSuratBantahan =  new Date(Date.UTC(TglSuratBantahan.getFullYear(), TglSuratBantahan.getMonth(), TglSuratBantahan.getDate()));
    this.model.TglTerimaBantahan = new Date(Date.UTC(TglTerimaBantahan.getFullYear(), TglTerimaBantahan.getMonth(), TglTerimaBantahan.getDate()));
    this.model.RefCaraKirimBantahanId = this.formGroup.controls['RefCaraKirimBantahanId'].value;
    if (this.formGroup.controls['TglKirimBantahan'].value != null) this.model.TglKirimBantahan = new Date(Date.UTC(TglKirimBantahan.getFullYear(), TglKirimBantahan.getMonth(), TglKirimBantahan.getDate()));
    this.model.TglTerimaAbgBantahan = new Date(Date.UTC(TglTerimaAbgBantahan.getFullYear(), TglTerimaAbgBantahan.getMonth(), TglTerimaAbgBantahan.getDate()));
      }
  this.isFailed = false;     
  this.isUpload = false;
  if (this.statusUpload || (i.files[0] === undefined && fi.files[0] === undefined)) this.dialogRef.close(this.model);
}, 500);
}
}
