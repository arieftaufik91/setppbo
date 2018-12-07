import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ReferensiTemplateService } from '../../services/referensi-template.service';
import { ReferensiTemplate } from '../../models/referensi-template';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';

@Component({
  selector: 'app-referensi-template-form',
  templateUrl: './referensi-template-form.component.html',
  styleUrls: ['./referensi-template-form.component.css'],
  providers: [ReferensiTemplateService]
})
export class ReferensiTemplateFormComponent implements OnInit {
  formModel: ReferensiTemplate;
  formGroup: FormGroup;
  isEdit = false;
  isFileChanged = false;
  isFileExist = false;
  selectedStatus = new FormControl();
  fileData: any;
  progress: number;
  items: ReferensiTemplate[];
  
  @ViewChild("fileInput") fileInput: any;
  
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackbar: PuiSnackbarService,
    public dialogRef: MatDialogRef<ReferensiTemplateFormComponent>,
    private _service: ReferensiTemplateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.items = this.data.items;
    this.createForm();
  }

  ngOnInit() {
    if(this.data.item != null){
      this.isEdit = true;
      this.formModel = this.data.item;
      this.selectedStatus = new FormControl(this.data.item.Status); 
      this.formGroup.setValue({
        Uraian: this.formModel.Uraian,
        FileId: this.formModel.FileId,
        JenisFile: this.formModel.JenisFile
      });
      
      //this.formGroup!.get('FileId')!.setValue(this.formModel.FileId);
    }else{
      this.formModel = {} as ReferensiTemplate;
      this.selectedStatus = new FormControl(true);
    }
    
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      Uraian: ["", Validators.required],
      FileId: ["", Validators.required],
      JenisFile: ["", Validators.required]
    });
  }

  onFileChange(event: any) {
    this.isFileChanged = true;
    this.isFileExist = false;
    if (event.target.files.length > 0) {
        let file = event.target.files[0];
        this.formGroup!.get('FileId')!.setValue(file.name);
        console.log(file);
        this.fileData = file;
    }
  }

  //fungsi upload; file: file yang diupload, filename: renaming file yang diupload
  upload(file:any, filename: string) {
  
    const formData = new FormData();
    formData.append(file.name, file);
    let params = new HttpParams(); 
    params = params.append('param', filename);
  
    const uploadReq = new HttpRequest('POST', `api/UploadFile/Template`, formData, {
      reportProgress: true, params :params,
    });
    
    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded);
      else if (event.type === HttpEventType.Response){
        this.dialogRef.close(this.formModel);
      }
        
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // prepare model to be sent
    this.formModel.Uraian = this.formGroup.controls['Uraian'].value;
    this.formModel.JenisFile = this.formGroup.controls['JenisFile'].value;
    this.formModel.Status = this.selectedStatus.value;
    
    // console.log(this.fileData.name);
    // console.log(this.fileData);
    // this._service.upload(this.fileData).subscribe(result => {
    //   this.dialogRef.close(this.formModel);
    // });

    //prevent file updated while editing
    if(this.isFileChanged){
      let fi = this.fileInput.nativeElement;
      if (fi.files && fi.files[0]) {
        let fileToUpload = fi.files[0];
        for(let item of this.items){
          console.log(fi.files[0].name+" || "+item.FileId)
          if(fi.files[0].name == item.FileId){
            this.isFileExist = true;
          }
        }
        //prevent insert the same file name but ignore this when editing
        if(this.isFileExist && !this.isEdit) {
          this.snackbar.showSnackBar("error", "Nama File sudah ada!");
        }else{
          this.formModel.FileId = this.formModel.Uraian.split(" ").join("")+"."+fi.files[0].name.split(".")[1];
          // filename diambil dari uraian tanpa spasi
          this.upload(fileToUpload,this.formModel.Uraian.split(" ").join("")+"."+fi.files[0].name.split(".")[1]);
        }
        this.isFileChanged = false;
      }  
    }else{
      this.dialogRef.close(this.formModel);
    }
  }
}
