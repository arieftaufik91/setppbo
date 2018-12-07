import { Component, OnInit, Inject,Input } from "@angular/core";
import { DataTambahanEntry } from "../../models/data-tambahan-tes";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatOption } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';
import { ActivatedRoute, Router } from "@angular/router";
import { DataServiceService } from "../../services/data-service.service";
import { DataTambahanService } from "../../services/data-tambahan.service";
import { GuidService } from "../../services//guid.service";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { HttpParams } from '@angular/common/http';
import { RefcarakirimpermohonanService } from '../../../referensi/services/refcarakirimpermohonan.service';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';



@Component({
  selector: 'app-data-tambahan-upload',
  templateUrl: './data-tambahan-upload.component.html',
  styleUrls: ['./data-tambahan-upload.component.css'],
  providers : [DataServiceService, DataTambahanService, RefcarakirimpermohonanService, GuidService, ReferensiTemplateService]
})

export class DataTambahanUploadComponent implements OnInit {
  formData        : FormData[] =[];
  uploadForm      : FormGroup;
  filesize        : number[] = new Array();
  model           : DataTambahanEntry;
  files           :any;
  formGroup       : FormGroup;
  isEdit          = false;
  guid            :string[] = new Array();
  item            :any[];
  modelCaraKirim  : Refcarakirimpermohonan[];
  suratpengantarid: string ;
  permohonanId    =  this.route.snapshot.params['id'];
  isSentByPostman : boolean = false;
  formReady       : boolean = true;  
  public progress : number;
  public message  : string;
  val2: string    ="tes";
  
  
  constructor(
    private _refTemplateService : ReferensiTemplateService,
    private guidservice         : GuidService,
    private http                : HttpClient,
    private refcarakirimservice : RefcarakirimpermohonanService,
    private _fb                 : FormBuilder,
    private route               : ActivatedRoute,
    private formBuilder         : FormBuilder,
    public data                 : DataServiceService,
    private snackbar            : PuiSnackbarService,
    public service              : DataTambahanService,
    private router              : Router,

    
  ) 
  {
    this.createForm();
    this.createFormUpload();
  }

  editForm() {
    if (this.formGroup.controls['TglKirim'].value !== "") this.formReady = true;
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
    if (this.formGroup.controls['RefCaraKirimID'].value === this.getCaraKirimPos()) {
      this.isSentByPostman = true;
      this.formReady = false;
    } else {
      this.isSentByPostman = false;
      this.formReady = true;
      this.formGroup.patchValue({
        TglKirim : ""
      })
    }
  }

newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

ngOnInit() {
     this.refcarakirimservice.getAll().subscribe(result => {
            this.modelCaraKirim = result;
        });
    this.model = new DataTambahanEntry();
    this.model.FileId= [];
    this.model.Uraian=[];
    this.model.Keterangan =[];
    this.uploadForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]) // here
    });
  }

  initItemRows() {
    return this._fb.group({
      FileId: [''],
      Keterangan:[''],
    });
}

upload(files:any) {
    if (files.length === 0)
    return;
    this.formData[this.itemRows.length - 1] = new FormData;
    for (let file of files)
    this.filesize[this.itemRows.length - 1] = file.size;
    for (let file of files)
    this.formData[this.itemRows.length -1].append(file.name, file);
}

addNewRow() {
  const control = <FormArray>this.uploadForm.controls['itemRows'];
  control.push(this.initItemRows());
}

deleteRow(index: number) {
  const control = <FormArray>this.uploadForm.controls['itemRows'];
  control.removeAt(index);
}
  
createFormUpload(){
    this.uploadForm = this._fb.group({
      itemRows: this._fb.array([])
    });
    this.uploadForm.setControl('itemRows', this._fb.array([]));
}

createForm() {
    this.formGroup = this.formBuilder.group({
      PermohonanId      : [""],
      NoSuratPengantar  : ["", Validators.required],
      TglSuratPengantar : ["", Validators.required],
      TglKirim          : [{value: '', disabled: !this.isSentByPostman}, this.isSentByPostman ? Validators.required : null],
      TglTerima         : ["", Validators.required],
      RefCaraKirimID    : [""],
      
    });
}

get itemRows(): FormArray { return this.uploadForm.get('itemRows') as FormArray; }

onNoClick(){
  this.router.navigate(['/datatambahan/' + this.permohonanId]);   
}

onOkClick() {

  this._refTemplateService.checkTemplate(10).subscribe(result =>{
    if(!result){
    
    }else{
      console.log("Sukses");
    }
  });

  for (var i =0 ; i <this.itemRows.length; i++ ) {
    var id = this.newGuid();
    this.guid.push(id);
    console.log(this.guid[i]);
  }

  
 
  for (var i =0 ; i <this.itemRows.length; i++ ) {
    
  }

  const TglSuratPengantar                 = new Date(this.formGroup.controls['TglSuratPengantar'].value);
  const TglTerima                         = new Date(this.formGroup.controls['TglTerima'].value);
  const TglKirim                          = new Date(this.formGroup.controls['TglKirim'].value);

  this.model.PermohonanId                 = this.permohonanId;
  this.model.NoSuratPengantar             = this.formGroup.controls['NoSuratPengantar'].value;
  this.model.TglSuratPengantar            = new Date(Date.UTC(TglSuratPengantar.getFullYear(), TglSuratPengantar.getMonth(), TglSuratPengantar.getDate())); 
  this.model.TglKirim                     = new Date(Date.UTC(TglKirim.getFullYear(), TglKirim.getMonth(), TglKirim.getDate())); 
  this.model.TglTerima                    = new Date(Date.UTC(TglTerima.getFullYear(), TglTerima.getMonth(), TglTerima.getDate())); 
  this.model.RefCaraKirimID               = this.formGroup.controls['RefCaraKirimID'].value;
    for (var i =0 ; i <this.itemRows.length; i++ ) {
      if(this.filesize[i] >  40000000){
        this.snackbar.showSnackBar("error", this.itemRows.at(i).value.Keterangan + " File lebih dari 40 MB");
        this.model.FileId.push("Failed");
        this.model.Keterangan.push("Failed");
        this.model.Uraian.push("Failed");
      } else
      {
        let params = new HttpParams();
        params = params.append('param',this.permohonanId + "/Data Tambahan/" + this.guid[i] );
        const uploadReq = new HttpRequest('POST', `api/UploadFileDT`, this.formData[i], {
             reportProgress: true, params : params
        });
        
        this.http.request(uploadReq).subscribe(event => {
           if (event.type === HttpEventType.UploadProgress)
              this.progress = Math.round(100 * event.loaded);
           else if (event.type === HttpEventType.Response){
            }
        });
  
        this.model.FileId.push(this.itemRows.at(i).value.FileId);
        this.model.Keterangan.push(this.itemRows.at(i).value.Keterangan);
        this.model.Uraian.push(this.guid[i]);
      }
      
    }
  this.service.add(this.model as DataTambahanEntry).subscribe(result => {   
  //this.snackbar.showSnackBar("success", "Simpan Data Tambahan Berhasil!");
  this.suratpengantarid = result; 
  this.message = "success";
  this.router.navigate(['/datatambahantt/' + this.suratpengantarid]);     
  }
  , (error) =>{
  this.snackbar.showSnackBar("error", "Data Tambahan gagal disimpan");
  });
}





}
