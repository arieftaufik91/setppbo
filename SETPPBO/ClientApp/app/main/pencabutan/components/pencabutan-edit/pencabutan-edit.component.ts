import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Pencabutan } from '../../models/pencabutan';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PencabutanService } from '../../services/pencabutan.service';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";


@Component({
  selector: 'app-pencabutan-edit',
  templateUrl: './pencabutan-edit.component.html',
  styleUrls: ['./pencabutan-edit.component.css'],
  providers: [RefcarakirimpermohonanService, PuiSnackbarService, AdministrasiBandingGugatanService, PencabutanService]
})
export class PencabutanEditComponent implements OnInit {
  formModel       : Pencabutan;
  formGroup       : FormGroup;
  formTitle       : string;
  caraKirimModel  : Refcarakirimpermohonan[];
  permohonanId    : any;
  progress        : number;
  pemohonPath     : string;
  berkasPath      : string = "Pencabutan";
  uploadPath      : string;
  isUploading     = false;
  extension       : string;
  item            : any;
  file            : string;
  filepath        : any;
  cetak           : string;
  PencabutanFileName  : string;


  selectedcarakirim = new FormControl();
  
  @ViewChild("file") fileInput: any;

  constructor(
    private http                      : HttpClient,
    private _servicecetak             : AdministrasiBandingGugatanService,
    private formBuilder               : FormBuilder,
    public dialogRef                  : MatDialogRef<PencabutanEditComponent>,
    private _refCaraKirimService      : RefcarakirimpermohonanService,
    private _snackBarService          : PuiSnackbarService,
    private _service                  : PencabutanService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.createForm();
  }

  fetch() {
    this._service.getDetailPermohonan(this.data.PermohonanId)
      .subscribe(result => {
        this.item = result;
        this.file = result.FilePencabutan;
      });

      this._service.getDetailPencabutan(this.data.PermohonanId).subscribe(result => {
        this.filepath = result.path;
      });
  }

  ngOnInit() {
    this.formModel = this.data;
    this._refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
    });
    console.log(this.data);

    this.selectedcarakirim = new FormControl(this.data.RefCaraKirimPencabutanId);
    this.PencabutanFileName = this.data.FilePencabutan;
    this.fetch();
  }

  download() {
    this._servicecetak.getBaseUrl().subscribe(result => {
      this.cetak = result;
      this.cetak = this.cetak + "/api/DownloadFileDT/"  + this.filepath + "/" + this.file;
    });

    setTimeout(() => {
      window.open(this.cetak);
    }, 250);
   
  
  }

  createForm(){
    this._refCaraKirimService.getAll().subscribe(result => {
      this.caraKirimModel = result;
    });

    this.selectedcarakirim = new FormControl(this.data.RefCaraKirimPencabutanId);

    
    this.formGroup = this.formBuilder.group({
      NoSengketa              : [{value:'',disabled: true}],
      NoKep                   : [{value:'',disabled: true}],
      NoPendaftaran           : [{value:'',disabled: true}],
      NoSuratPencabutan       : ["", Validators.required],
      TglSuratPencabutan      : ["", Validators.required],
      TglTerimaPencabutan     : ["", Validators.required],
     
    });
    this.formGroup.patchValue({
      NoSengketa              : this.data.NoSengketa,
      NoKep                   : this.data.NoKep,
      NoPendaftaran           : this.data.NoPendaftaran,
      NoSuratPencabutan       : this.data.NoSuratPencabutan,
      TglSuratPencabutan      : this.data.TglSuratPencabutan,
      TglTerimaPencabutan     : this.data.TglTerimaPencabutan
    });
  }

  


  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick(){

    const TglSuratPencabutan                = new Date(this.formGroup.controls['TglSuratPencabutan'].value);
    const TglTerimaPencabutan               = new Date(this.formGroup.controls['TglTerimaPencabutan'].value);
    const TglKirimPos                       = new Date(this.formGroup.controls['TglKirimPos'].value);
    
    this.formModel.NoSuratPencabutan        = this.formGroup.controls['NoSuratPencabutan'].value;
    this.formModel.TglSuratPencabutan       = new Date(Date.UTC(TglSuratPencabutan.getFullYear(), TglSuratPencabutan.getMonth(), TglSuratPencabutan.getDate())); 
    this.formModel.TglTerimaPencabutan      = new Date(Date.UTC(TglTerimaPencabutan.getFullYear(), TglTerimaPencabutan.getMonth(), TglTerimaPencabutan.getDate())); 
    this.formModel.TglKirimPencabutan       = new Date(Date.UTC(TglKirimPos.getFullYear(), TglKirimPos.getMonth(), TglKirimPos.getDate())); 
    this.formModel.RefCaraKirimPencabutanId = this.selectedcarakirim.value;
    
    this.uploadPath = this.formModel.PermohonanId+"/"+this.berkasPath;
    
    let fi = this.fileInput.nativeElement;
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

  fileSizeHandler (file: any) {
    if (file.size > 20000000) {
      return false;
    } else {
      return true;
    }
  }
}
