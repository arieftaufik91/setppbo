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
import { ActivatedRoute } from '@angular/router';

import { Router } from "@angular/router";

@Component({
  selector: 'app-penetapan-edit',
  templateUrl: './penetapan-edit.component.html',
  styleUrls: ['./penetapan-edit.component.css'],
  providers: [PenetapanService]
})
export class PenetapanEditComponent implements OnInit {
  penetapan :Penetapan;
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
    private _penetapanService: PenetapanService,
    private router: Router,
    private route: ActivatedRoute,
    
  ){
    this.createForm();  
  }

  ngOnInit() {
    const id: string = this.route.snapshot.params['id'];


   
    this._penetapanService.getPenetapanEdit(id).subscribe(result => {
      this.formModel = this.formModel; // asumsi yang dilempar oleh data adalah object Quote
 
     this.formGroup.patchValue({    
        NoPenetapan: result.NoPenetapan,
        TglPenetapan: result.TglPenetapan,
        selectedkota: result.TempatSidang.toString()
    
      });
    })
 //  this._penetapanService.getById(this.formModel.NoPenetapan).subscribe(result =>{
  
   //    this.selectedkota = new FormControl(this.formModel.kotaId);
    //   this.formModel = this.formModel; // asumsi yang dilempar oleh data adalah object Quote
    //   this.formGroup.setValue({
    //     NoPenetapan: this.formModel.NoPenetapan,
    //     TglPenetapan: this.formModel.TglPenetapan,
    
    //   });
    // }
    // else{
    //     this.formModel = new Penetapan();
    //   }
    
  }

  createForm(){
    this._penetapanService.getKotaPenetapan().subscribe(result => {
      this.refKota = result;
    });
    this.formGroup = this.formBuilder.group({
      NoPenetapan: ["", Validators.required],
      TglPenetapan: ["", Validators.required],
      selectedkota: ["", Validators.required],
      PejabatPenandatangan: ["", Validators.required],
      PosisiPejabatPenandatangan: [""]
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
