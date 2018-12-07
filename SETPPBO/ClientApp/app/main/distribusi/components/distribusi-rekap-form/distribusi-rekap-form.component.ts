import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DistribusiService } from '../../services/distribusi.service';

@Component({
  selector: 'app-distribusi-rekap-form',
  templateUrl: './distribusi-rekap-form.component.html',
  styleUrls: ['./distribusi-rekap-form.component.css'],
  providers: [DistribusiService]
})
export class DistribusiRekapFormComponent implements OnInit {

  formGroup: FormGroup;
  listMajelis: any[];
  listReason: any[];
  listPermohonan: any[];

  constructor(
    public dialogRef: MatDialogRef<DistribusiRekapFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private _service: DistribusiService
  ) {
    this.createForm();
    this.fetch();     
  }

  ngOnInit() {
  }

  createForm() {
    // create form
    this.listPermohonan = [];
    this.formGroup = this.formBuilder.group({
      majelis: ["", Validators.required],
      alasan: ["", Validators.required],
    });
  }

  fetch() {
    this._service.getListMajelis(false, this.data).subscribe(result => {
      this.listMajelis = result;
    });
    this._service.getListAlasan().subscribe(result => {
      this.listReason = result;
    });
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
      // prepare model to be sent
      this.data.forEach(item => {
        item.RefMajelisPenunjukanId = this.formGroup.controls['majelis'].value;
        item.KeteranganPenunjukan = "" + this.formGroup.controls['alasan'].value;
        this.listPermohonan.push(item)
      })
      this.dialogRef.close(this.listPermohonan);
  }

}
