import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { DistribusiService } from '../../services/distribusi.service';

@Component({
  selector: 'app-distribusi-rekap-detail',
  templateUrl: './distribusi-rekap-detail.component.html',
  styleUrls: ['./distribusi-rekap-detail.component.css'],
  providers: [DistribusiService]
})
export class DistribusiRekapDetailComponent implements OnInit {

  permohonanId: string;
  item: any;

  constructor(
    public dialogRef: MatDialogRef<DistribusiRekapDetailComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: DistribusiService
  ) { 
    this.permohonanId = data.permohonanId;
    this.fetch();    
  }

  ngOnInit() {
  }

  close() {
      this.dialogRef.close();
  }

  fetch() {
    this._service.getDetailBerkas(this.permohonanId).subscribe(result => {
      this.item = result;
    });
  }
}
