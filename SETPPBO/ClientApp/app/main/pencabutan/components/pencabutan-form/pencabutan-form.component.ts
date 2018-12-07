import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Pencabutan } from '../../models/pencabutan';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';

@Component({
  selector: 'app-pencabutan-form',
  templateUrl: './pencabutan-form.component.html',
  styleUrls: ['./pencabutan-form.component.css'],
  providers: [RefcarakirimpermohonanService, PuiSnackbarService]
})
export class PencabutanFormComponent implements OnInit {
  formModel     : Pencabutan;
  formGroup     : FormGroup;
  formTitle     : string;
  caraKirimModel: Refcarakirimpermohonan[];
  permohonanId  : any;
  progress      : number;
  pemohonPath   : string;
  berkasPath    : string = "Pencabutan";
  uploadPath    : string;
  isUploading   = false;
  extension     : string;
  isSentByPostman: boolean = false;
  formReady       : boolean = true;  
  modelCaraKirim  : Refcarakirimpermohonan[];

  @ViewChild("file") fileInput  : any;
  @ViewChild("file") fileInput1 : any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PencabutanFormComponent>,
    private _refCaraKirimService: RefcarakirimpermohonanService,
    private _snackBarService: PuiSnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    //console.log(uploadURL+new Date().getFullYear()+'/'+this.data.PemohonId+'/'+'pencabutan/');
    this.createForm();
  }

  ngOnInit() {
    this.formModel = this.data;
    
  }


  getCaraKirimPos() {
    let i = this.modelCaraKirim.find(caraKirim => caraKirim.Uraian.toLowerCase() == "pos");
    if (i != null) {
      return i.RefCaraKirimId;
    }
    return 0;
  }

  createForm(){
    this._refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
    });
    //this.formModel = {} as Pencabutan;
    //this.formModel.PermohonanId = this.data.permohonanId;
    this.formGroup = this.formBuilder.group({
      NoSengketa: [{value:'',disabled: true}],
      NoKep: [{value:'',disabled: true}],
      NoPendaftaran: [{value:'',disabled: true}],
      NoSuratPencabutan: ["", Validators.required],
      TglSuratPencabutan: ["", Validators.required],
      TglTerimaPencabutan: ["", Validators.required],
      RefCaraKirimPencabutanId: ["", Validators.required],
      TglKirimPos:[ {value: '', disabled: !this.isSentByPostman}, this.isSentByPostman ? Validators.required : null]
    });
    this.formGroup.patchValue({
      NoSengketa: this.data.NoSengketa,
      NoKep: this.data.NoKep,
      NoPendaftaran: this.data.NoPendaftaran
    });
  }


  checkSender() {
    if (this.formGroup.controls['RefCaraKirimPencabutanId'].value === this.getCaraKirimPos()) {
      this.isSentByPostman = true;
      this.formReady = false;
    } else {
      this.isSentByPostman = false;
      this.formReady = true;
      this.formGroup.patchValue({
        TglKirimPos : ""
      })
    }
  }
  //fungsi upload
  upload(file:any, path: string) {
  
    const formData = new FormData();
    formData.append(file.name, file);
    let params = new HttpParams(); 
    params = params.append('param', path);
  
    const uploadReq = new HttpRequest('POST', `api/UploadFile`, formData, {
      reportProgress: true, params :params,
    });
    
    this.http.request(uploadReq).subscribe(event => {
      this.isUploading = true;
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded);
      else if (event.type === HttpEventType.Response){
        this.isUploading = false;
        if(event.body=="Upload Success"){
          this.dialogRef.close(this.formModel);
        }else{
          this._snackBarService.showSnackBar("error", "File gagal di-upload, silahkan coba lagi");
        }
        
      }
        
    });
  }

  editForm() {
    if (this.formGroup.controls['TglKirimPos'].value !== "") this.formReady = true;
    else this.formReady = true;
  }

 
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick(){

    let fi = this.fileInput.nativeElement;
    let i = this.fileInput1.nativeElement;
  
    const TglSuratPencabutan = new Date(this.formGroup.controls['TglSuratPencabutan'].value);
    const TglTerimaPencabutan = new Date(this.formGroup.controls['TglTerimaPencabutan'].value);
    const TglKirimPos = new Date(this.formGroup.controls['TglKirimPos'].value);

    this.formModel.NoSuratPencabutan = this.formGroup.controls['NoSuratPencabutan'].value;
    this.formModel.TglSuratPencabutan = new Date(Date.UTC(TglSuratPencabutan.getFullYear(), TglSuratPencabutan.getMonth(), TglSuratPencabutan.getDate())); 
    this.formModel.TglTerimaPencabutan = new Date(Date.UTC(TglTerimaPencabutan.getFullYear(), TglTerimaPencabutan.getMonth(), TglTerimaPencabutan.getDate())); 
    this.formModel.TglKirimPencabutan = new Date(Date.UTC(TglKirimPos.getFullYear(), TglKirimPos.getMonth(), TglKirimPos.getDate())); 
    this.formModel.RefCaraKirimPencabutanId = this.formGroup.controls['RefCaraKirimPencabutanId'].value;
    
    if(fi.files[0] === undefined){
      this.dialogRef.close(this.formModel);
    }
    else{
      this.uploadPath =this.formModel.PermohonanId+"/"+this.berkasPath;
      this.extension = fi.files[0].name.substr(fi.files[0].name.lastIndexOf('.') + 1);
      if (this.fileSizeHandler(fi.files[0]) && (this.extension == 'doc' || this.extension  == 'docx') || this.extension == 'pdf') {
        if (fi.files && fi.files[0]) {
          let fileToUpload = fi.files[0];
          this.formModel.FilePencabutan = fi.files[0].name;
          if (this.fileSizeHandler(fileToUpload)) {}
          this.upload(fileToUpload,this.uploadPath);
        }
      } else {
        this._snackBarService.showSnackBar("error","Jenis dan Ukuran File Tidak Sesuai");
       
      }
    }
   
  }


  fileSizeHandler (file: any) {
    if (file.size > 20000000) {
      return false;
    } else {
      return true;
    }
  }
}
