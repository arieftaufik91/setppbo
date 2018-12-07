import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Penetapan } from '../../models/penetapan';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PenetapanComponent } from '../penetapan/penetapan.component';
import { PenetapanService } from '../../services/penetapan.service';
import { Refkota } from '../../models/refkota';
import { Nomortap } from '../../models/nomortap';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';

@Component({
  selector: 'app-penetapan-ac-add',
  templateUrl: './penetapan-ac-add.component.html',
  styleUrls: ['./penetapan-ac-add.component.css'],
  providers: [PenetapanService, ReferensiTemplateService]
})
export class PenetapanAcAddComponent implements OnInit {
  formModel: Penetapan;
  refKota: Refkota[];
  formGroup: FormGroup;
  formTitle: string;
  permohonanId: any;
  progress: number;
  pemohonPath: string;
  berkasPath: string = "Penetapan";
  uploadPath: string;
  isUploading = false;
  message = 'Hola Mundo!';
  isEdit = false;
  selectedkota = new FormControl("");
  noPenetapan: string;
  selected: any[] = [];
  selectedkotamodel :string;
  

  onChange(newValue:any) {
    console.log(newValue);
    this.selectedkotamodel = newValue;
  }
  
  @ViewChild("file") fileInput: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private _refTemplateService: ReferensiTemplateService,
    private _penetapanService: PenetapanService,
    
  ){
    this.createForm();  
  }

  ngOnInit() {
    this._penetapanService.getKotaPenetapan().subscribe(result => {
      this.refKota = result;
    });
    this._penetapanService.getNomorTerakhir().subscribe(result => {
      this.formModel = this.formModel; 
      
     this.formGroup.patchValue({    
        NoPenetapan: result
      });
    })
  }

  createForm(){
    this._penetapanService.getKotaPenetapan().subscribe(result => {
      this.refKota = result;
    });
    this.formGroup = this.formBuilder.group({
      NoPenetapan: [{disabled: true}, Validators.required],
      TglPenetapan: ["", Validators.required],
      selectedkota: ["", Validators.required],
      PejabatPenandatangan: ["", Validators.required],
      PosisiPejabatPenandatangan: [""]
    });
  }


}
