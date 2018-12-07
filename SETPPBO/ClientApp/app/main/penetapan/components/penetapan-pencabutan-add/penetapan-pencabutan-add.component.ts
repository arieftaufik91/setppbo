import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Penetapan } from '../../models/penetapan';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Refcarakirimpermohonan } from '../../../referensi/models/refcarakirimpermohonan';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PenetapanPencabutanComponent } from '../penetapan-pencabutan/penetapan-pencabutan.component';
import { Refkota } from '../../models/refkota';
import { PenetapanService } from '../../services/penetapan.service';


@Component({
  selector: 'app-penetapan-pencabutan-add',
  templateUrl: './penetapan-pencabutan-add.component.html',
  styleUrls: ['./penetapan-pencabutan-add.component.css'],
  providers: [PenetapanService]
})
export class PenetapanPencabutanAddComponent implements OnInit {
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
  selectedkota = new FormControl("");
  isEdit = false;
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
    private _penetapanService: PenetapanService,
  ){
    this.createForm();
  }

  ngOnInit() {
    this._penetapanService.getKotaPenetapan().subscribe(result => {
      this.refKota = result;
    });
    this._penetapanService.getNomorCabutTerakhir().subscribe(result => {
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
      NoPenetapan: [{value:'', disabled: true}, Validators.required],
      TglPenetapan: ["", Validators.required],
      selectedkota: ["", Validators.required],
      
    });

  }


  /* EVENTS */
  onNoClick() {
    
  }

  onOkClick(){
    this.formModel.NoPenetapan = this.formGroup.controls['NoPenetapan'].value;
    this.formModel.TglPenetapan = this.formGroup.controls['TglPenetapan'].value;
    this.formModel.TempatSidang = this.selectedkota.value;
    this.formModel.PejabatPenandatangan = this.formGroup.controls['PejabatPenandatangan'].value;
    this.formModel.PosisiPejabatPenandatangan = this.formGroup.controls['PosisiPejabatPenandatangan'].value;
    
  }
}
