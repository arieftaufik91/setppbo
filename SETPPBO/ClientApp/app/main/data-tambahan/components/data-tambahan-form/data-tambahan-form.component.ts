import { Component, OnInit, Inject,Input } from "@angular/core";
import { DataTambahanEntry } from "../../models/data-tambahan-entry";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatOption } from "@angular/material";
import {MatSelectModule} from '@angular/material/select';
import { ActivatedRoute, Router } from "@angular/router";
import { DataServiceService } from "../../services/data-service.service";
import { DataTambahanService } from "../../services/data-tambahan.service";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";

@Component({
  selector: 'app-data-tambahan-form',
  templateUrl: './data-tambahan-form.component.html',
  styleUrls: ['./data-tambahan-form.component.css'],
  providers : [DataServiceService, DataTambahanService]

})
export class DataTambahanFormComponent implements OnInit {
  
  model: DataTambahanEntry;
  formGroup: FormGroup;
  isEdit = false;
  message : string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public data: DataServiceService,
    private snackbar: PuiSnackbarService,
    public service : DataTambahanService,
    private router: Router,
    
  ) {
    this.createForm();
  }
  ngOnInit() {
    this.message = this.route.snapshot.params['id'];
   
    
    
    this.model = new DataTambahanEntry();
  
  }

  createForm() {
    
    this.formGroup = this.formBuilder.group({
      PermohonanId: [""],
      NoSuratPengantar: [""],
      TglSuratPengantar: [""],
      TglKirim:[""],
      TglTerima:[""],
      RefCaraKirimID:[""],
      FileId: [""],
      Uraian: [""],
      Keterangan:[""]
    });
  }

  onNoClick() {
  }
  

  onOkClick() {
    this.model.PermohonanId = this.formGroup.controls['PermohonanId'].value;
      this.model.NoSuratPengantar = this.formGroup.controls['NoSuratPengantar'].value;
      this.model.TglSuratPengantar = this.formGroup.controls['TglSuratPengantar'].value;
      this.model.TglKirim = this.formGroup.controls['TglKirim'].value;
      this.model.TglTerima = this.formGroup.controls['TglTerima'].value;
      this.model.RefCaraKirimID = this.formGroup.controls['RefCaraKirimID'].value;
      this.model.FileId = this.formGroup.controls['FileId'].value;
      this.model.Uraian = this.formGroup.controls['Uraian'].value;
      this.model.Keterangan = this.formGroup.controls['Keterangan'].value;

      this.service.add(this.model as DataTambahanEntry).subscribe(result => {   
        this.snackbar.showSnackBar("success", "Edit Banding berhasil!");
        const id: string = this.route.snapshot.params['id'];
        this.router.navigate(['/datatambahan', id]);
      });
  }

}
