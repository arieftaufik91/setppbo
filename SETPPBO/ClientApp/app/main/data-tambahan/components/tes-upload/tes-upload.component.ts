import { Component, OnInit, Inject,Input } from "@angular/core";
import { DataTambahanEntry } from "../../models/data-tambahan-tes";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatOption } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';
import { ActivatedRoute, Router } from "@angular/router";
import { DataServiceService } from "../../services/data-service.service";
import { DataTambahanService } from "../../services/data-tambahan.service";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-tes-upload',
  templateUrl: './tes-upload.component.html',
  styleUrls: ['./tes-upload.component.css'],
  providers : [DataServiceService, DataTambahanService]
})
export class TesUploadComponent implements OnInit {
  uploadForm: FormGroup;
  model: DataTambahanEntry;
  files:any;
  formGroup: FormGroup;
  isEdit = false;
  item:any[];
 permohonanId =  this.route.snapshot.params['id'];
 public progress: number;
 public message: string;
 val2: string ="tes";
  constructor(
    private http: HttpClient,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public data: DataServiceService,
    private snackbar: PuiSnackbarService,
    public service : DataTambahanService,
    private router: Router,
    
  ) {
    this.createForm();
    this.createFormUpload();
  }
  ngOnInit() {
    
    this.model = new DataTambahanEntry();
    this.model.FileId= [];
    this.model.Uraian = [];
    this.model.Keterangan =[];
    this.uploadForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]) // here
    });
  }
  initItemRows() {
    return this._fb.group({
      FileId: [''],
      Uraian :[''],
      Keterangan:['']
    });
}

upload(files:any) {
  if (files.length === 0)
    return;

  const formData = new FormData();

  for (let file of files)
    formData.append(file.name, file);
    let params = new HttpParams();
    
    params = params.append('tes',this.permohonanId);

  const uploadReq = new HttpRequest('POST', `api/UploadFile`, formData, {
    reportProgress: true, params :params,
  });
  
  this.http.request(uploadReq).subscribe(event => {
    if (event.type === HttpEventType.UploadProgress)
      this.progress = Math.round(100 * event.loaded);
    else if (event.type === HttpEventType.Response)
      this.message = "success";
  });
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
      PermohonanId: [""],
      NoSuratPengantar: [""],
      TglSuratPengantar: [""],
      TglKirim:[""],
      TglTerima:[""],
      RefCaraKirimID:[""]
    });
  }
  get itemRows(): FormArray { return this.uploadForm.get('itemRows') as FormArray; }

  onNoClick() {
    this.model.FileId = [];
   var tes = this.itemRows;
    for (var i =0 ; i <tes.length; i++ ) {
      this.model.FileId.push(this.itemRows.at(i).value.FileId);
      this.model.Uraian.push(this.itemRows.at(i).value.Uraian);
      this.model.Keterangan.push(this.itemRows.at(i).value.Keterangan);
  }
  console.log(this.model.FileId);
    
 

  }
  
 
 

  onOkClick() {

   
   
    this.model.PermohonanId = this.permohonanId;
      this.model.NoSuratPengantar = this.formGroup.controls['NoSuratPengantar'].value;
      this.model.TglSuratPengantar = this.formGroup.controls['TglSuratPengantar'].value;
      this.model.TglKirim = this.formGroup.controls['TglKirim'].value;
      this.model.TglTerima = this.formGroup.controls['TglTerima'].value;
      this.model.RefCaraKirimID = this.formGroup.controls['RefCaraKirimID'].value;
      for (var i =0 ; i <this.itemRows.length; i++ ) {
        this.model.FileId.push(this.itemRows.at(i).value.FileId);
        this.model.Uraian.push(this.itemRows.at(i).value.Uraian);
        this.model.Keterangan.push(this.itemRows.at(i).value.Keterangan);
    }
 console.log(this.model);
     this.service.add(this.model as DataTambahanEntry).subscribe(result => {   
       this.snackbar.showSnackBar("success", "Edit Banding berhasil!");
       console.log(this.model);
     });
  }

}
