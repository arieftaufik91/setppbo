import { Component, OnInit, Inject,Input } from "@angular/core";
import { Refnormawaktu } from "../../models/refnormawaktu";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatOption } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';
import { Refjenisnormawaktu } from "../../models/refjenisnormawaktu";
import { RefjenisnormawaktuService } from "../../services/referensi-jenisNormaWaktu.service"

@Component({
  selector: 'app-referensi-normaWaktu-form',
  templateUrl: './referensi-normaWaktu-form.component.html',
  styleUrls: ['./referensi-normaWaktu-form.component.css'],
  providers: [RefjenisnormawaktuService],
})
export class RefnormawaktuFormComponent implements OnInit {
  model: Refnormawaktu;
  formGroup: FormGroup;
  isEdit = false;
  items: Refjenisnormawaktu[]
  
  selectedjenisnormawaktu = new FormControl("");
  selectedjenispermohonan = new FormControl("");



  constructor( 
    private refjenisnormawaktuService : RefjenisnormawaktuService,
    public dialogRef: MatDialogRef<RefnormawaktuFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }
  ngOnInit() {
     // prepare model
   
     if (this.data != null) {
      this.getRefjenisnormawaktuService();
      // edit
      this.isEdit = true;
      this.selectedjenisnormawaktu = new FormControl(this.data.RefJenisNormaWaktuId);
      this.selectedjenispermohonan = new FormControl(this.data.RefJenisPermohonanId);
      this.model = this.data; // asumsi yang dilempar oleh data adalah object Quote
      this.formGroup.setValue({
        RefNormaWaktuId: this.data.RefNormaWaktuId,
       
        bulan: this.model.Bulan,
        hari: this.model.Hari
      });
    } else {
      // add
      this.getRefjenisnormawaktuService();
      this.model = new Refnormawaktu();
    }
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      RefNormaWaktuId: ["", Validators.required],
      
     
      bulan: ["", Validators.required],
      hari: ["", Validators.required] 
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
      // prepare model to be sent
      this.model.RefNormaWaktuID = this.formGroup.controls['RefNormaWaktuId'].value;
      this.model.RefJenisPermohonanID = this.selectedjenispermohonan.value;
      this.model.RefJenisNormaWaktuID = this.selectedjenisnormawaktu.value;
      this.model.Bulan = this.formGroup.controls['bulan'].value;
      this.model.Hari = this.formGroup.controls['hari'].value;
    this.dialogRef.close(this.model);
  }

  getRefjenisnormawaktuService(){
    this.refjenisnormawaktuService.getAll().subscribe(result => this.items = result)
  }

}
