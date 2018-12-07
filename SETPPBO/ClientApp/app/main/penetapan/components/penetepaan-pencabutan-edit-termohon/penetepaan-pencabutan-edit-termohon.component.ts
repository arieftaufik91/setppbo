import { Component, OnInit, Inject } from '@angular/core';
import { Penetapan } from '../../models/penetapan';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PenetapanService } from "../../services/penetapan.service"
import { id } from '@swimlane/ngx-datatable/release/utils';
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { Route, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-penetepaan-pencabutan-edit-termohon',
  templateUrl: './penetepaan-pencabutan-edit-termohon.component.html',
  styleUrls: ['./penetepaan-pencabutan-edit-termohon.component.css'],
  providers: [PenetapanService]
})
export class PenetepaanPencabutanEditTermohonComponent implements OnInit {
  model: Penetapan;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<PenetepaanPencabutanEditTermohonComponent>,
    private _service: PenetapanService,
    private formBuilder: FormBuilder,
    private snackbar: PuiSnackbarService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
   }

  ngOnInit() {
    // const id: string = this.route.snapshot.params['id'];
    // this._service.getTermohon(id).subscribe(result => {
    //   this.model = this.model;

    //   this.formGroup.setValue({
    //     NamaTermohon: this.model.NamaTermohon,
    //     NamaUpTermohon: this.model.NamaUpTermohon,
        
    //   });
    // });

    this.model = this.data;
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      NamaTermohon: ["", Validators.required],
      NamaUpTermohon: ["", Validators.required],
    });

    this.formGroup.patchValue({
      NamaTermohon: this.data.NamaTermohon,
      NamaUpTermohon: this.data.NamaUpTermohon
    })
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    this.model.NamaTermohon = this.formGroup.controls['NamaTermohon'].value;
    this.model.NamaUpTermohon = this.formGroup.controls['NamaUpTermohon'].value;
    this.dialogRef.close(this.model);
    this.snackbar.showSnackBar("success", "Update Termohon Berhasil");
  }

}
