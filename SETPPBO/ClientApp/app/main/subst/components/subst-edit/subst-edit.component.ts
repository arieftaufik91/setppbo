import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Subst } from "../../models/subst";
import { FormGroup, FormBuilder, Validators, FormControl, MaxLengthValidator } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SubstService } from "../../services/subst.service";
import { HttpParams } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { RefcarakirimpermohonanService } from "../../../referensi/services/refcarakirimpermohonan.service";
import { Refcarakirimpermohonan } from "../../../referensi/models/refcarakirimpermohonan";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { RefPengirim } from "../../models/refPengirim";
//upload URL
const uploadURL ='ftp://10.242.77.90/setpp/';

@Component({
  selector: 'app-subst-edit',
  templateUrl: './subst-edit.component.html',
  styleUrls: ['./subst-edit.component.css'],
  providers: [SubstService, RefcarakirimpermohonanService]
})
export class SubstEditComponent implements OnInit {

  isEdit: boolean = false;
  isSentByPostman: boolean = false;
  model: Subst;
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;
  progress: number;  
  modelCaraKirim: Refcarakirimpermohonan[];
  listSender: RefPengirim[];
  selectedSender: RefPengirim;
  caraKirimPos: number;
  statusUpload: boolean = true;
  pemohonPath: string;
  berkasPath: string = "SubSt";
  uploadPath: string;
  RefCaraKirimSubStId = new FormControl();
  DocFileName: string;
  PdfFileName: string;
  urlDownload: string;
  isUpload: boolean = false;
  isFailed: boolean = false;  

  @ViewChild("file") fileInput: any;
  @ViewChild("file1") fileInput1: any;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<SubstEditComponent>,   
    private formBuilder: FormBuilder,   
    private refcarakirimservice: RefcarakirimpermohonanService,
    private substservice: SubstService,
    private snackBarService: PuiSnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  getCaraKirimPos() {
    let i = this.modelCaraKirim.find(caraKirim => caraKirim.Uraian.toLowerCase() == "pos");
    if (i != null) {
      return i.RefCaraKirimId;
    }
    return 0;
  }

  ngOnInit() {
    this.model = this.data;
    this.RefCaraKirimSubStId = new FormControl(this.data.RefCaraKirimSubStId);
    this.refcarakirimservice.getAll().subscribe(result => {
      this.modelCaraKirim = result;
      if (this.RefCaraKirimSubStId.value === this.getCaraKirimPos()) {
        this.isSentByPostman = true;
      } else {
        this.isSentByPostman = false;
      }
    });
  }

  createForm() {
    // create form
    this.RefCaraKirimSubStId = new FormControl(this.data.RefCaraKirimSubStId);    
    this.refcarakirimservice.getAll().subscribe(result => {
      this.modelCaraKirim = result;
      if (this.RefCaraKirimSubStId.value === this.getCaraKirimPos()) {
        this.isSentByPostman = true;
      } else {
        this.isSentByPostman = false;
      }
    });

    this.formGroup = new FormGroup({
      NoSengketa: new FormControl({ value: this.data.NoSengketa, disabled: true }, Validators.required),
      NoSubSt: new FormControl(this.data.NoSubSt, [Validators.required, Validators.maxLength(256)]),
      TglSubSt: new FormControl(this.data.TglSubSt, Validators.required),
      TglTerimaSubSt: new FormControl(this.data.TglTerimaSubSt, Validators.required),
      TglKirimSubSt: new FormControl({value: this.data.TglKirimSubSt, disabled: !this.isSentByPostman}),
      NamaPengirimSubSt:  new FormControl('', Validators.required),
      AlamatPengirimSubSt: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(512)]),
      KotaPengirimSubSt: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(64)]),
      KodePosPengirimSubSt:  new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(6)]),
      TglTerimaAbgSubSt: new FormControl(this.data.TglTerimaAbgSubSt, Validators.required)
    });

    this.substservice.getDaftarPengirim(this.data.OrganisasiId).subscribe(result => {
      this.listSender = result;
      if (this.model.NamaPengirimSubSt != null) {
          this.selectedSender = this.listSender.filter(x => x.UraianOrganisasi == this.model.NamaPengirimSubSt)[0];
          this.formGroup.patchValue({
              AlamatPengirimSubSt : this.selectedSender.Alamat,
              KotaPengirimSubSt : this.selectedSender.Kota,
              KodePosPengirimSubSt : this.selectedSender.KodePos,
          })
      } else {
          if (this.model.NamaUpTermohon != null) {
              this.selectedSender = this.listSender.filter(x => x.UraianOrganisasi == this.model.NamaUpTermohon)[0];
              this.formGroup.patchValue({
                  AlamatPengirimSubSt : this.selectedSender.Alamat,
                  KotaPengirimSubSt : this.selectedSender.Kota,
                  KodePosPengirimSubSt : this.selectedSender.KodePos,
              })
          } else {
              this.selectedSender = this.listSender[0];
              this.formGroup.patchValue({
                  AlamatPengirimSubSt : this.selectedSender.Alamat,
                  KotaPengirimSubSt : this.selectedSender.Kota,
                  KodePosPengirimSubSt : this.selectedSender.KodePos,
              })
          }
      }
      
    });

    this.DocFileName = this.data.FileDocSubSt;
    this.PdfFileName = this.data.FilePdfSubSt;
  }

  editForm() {

    this.isEdit = false;

    let fi = this.fileInput.nativeElement;
    let i = this.fileInput1.nativeElement;

    if (this.model.NoSengketa != this.formGroup.controls['NoSengketa'].value) {
      this.isEdit = true;
    }
    
    if (this.model.NoSubSt != this.formGroup.controls['NoSubSt'].value) {
      this.isEdit = true;      
    }

    if (this.model.TglSubSt != this.formGroup.controls['TglSubSt'].value) {
      this.isEdit = true;      
    }

    if (this.model.TglTerimaSubSt != this.formGroup.controls['TglTerimaSubSt'].value) {
      this.isEdit = true;      
    }

    if (this.model.RefCaraKirimSubStId != this.RefCaraKirimSubStId.value) {
      this.isEdit = true;     
    }

    if (this.RefCaraKirimSubStId.value === this.getCaraKirimPos()) {
      this.isSentByPostman = true;
      this.formGroup.patchValue({
        TglKirimSubSt : this.formGroup.controls['TglKirimSubSt'].value != "" ? this.formGroup.controls['TglKirimSubSt'].value : this.data.TglKirimSubSt
      })
    } else {
      this.isSentByPostman = false;
      this.formGroup.patchValue({
        TglKirimSubSt : ""
      })       
    }

    if (this.model.TglKirimSubSt != this.formGroup.controls['TglKirimSubSt'].value) {
      this.isEdit = true;            
    }

    if (this.model.NamaPengirimSubSt != this.selectedSender.UraianOrganisasi) {
      this.isEdit = true;            
    }

    if (this.model.TglTerimaAbgSubSt != this.formGroup.controls['TglTerimaAbgSubSt'].value) {
      this.isEdit = true;                  
    } 

    if (fi.files[0] === undefined) {} else {
      if (this.model.FileDocSubSt != fi.files[0].name) {
        this.isEdit = true;
      }
    }

    if (i.files[0] === undefined) {} else {
      if (this.model.FilePdfSubSt != i.files[0].name) {
        this.isEdit = true;
      }
    }

    if (this.formGroup.controls['TglKirimSubSt'].value == null && this.RefCaraKirimSubStId.value === this.getCaraKirimPos()) {
      this.isEdit = false;
    }

    if (this.formGroup.invalid) {
      this.isEdit = false;
    }

  }

  changeSender() {
    this.formGroup.patchValue({
      AlamatPengirimSubSt : this.selectedSender.Alamat,
      KotaPengirimSubSt : this.selectedSender.Kota,
      KodePosPengirimSubSt : this.selectedSender.KodePos,
    })
    this.editForm();
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

  downloadDocFile() {
    this.substservice.getBaseUrl().subscribe(result => {
      this.urlDownload = result;
      this.urlDownload = this.urlDownload + "/api/DownloadSubst/doc/Subst/"  + this.data.PermohonanId
    });

    setTimeout(() => {
      window.open(this.urlDownload);
    }, 250);
    
  }

  downloadPdfFile() {
    this.substservice.getBaseUrl().subscribe(result => {
      this.urlDownload = result;
      this.urlDownload = this.urlDownload + "/api/DownloadSubst/pdf/Subst/"  + this.data.PermohonanId
    });

    setTimeout(() => {
      window.open(this.urlDownload);
    }, 250);
    
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }
  
  fileSizeHandler(file: any) {
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
          this.model.RefCaraKirimSubStId = this.RefCaraKirimSubStId.value;
          this.model.TglKirimSubSt = this.formGroup.controls['TglKirimSubSt'].value != null ? new Date(Date.UTC(TglKirimSubSt.getFullYear(), TglKirimSubSt.getMonth(), TglKirimSubSt.getDate())) : new Date(0);
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
