import { Component, OnInit, Inject } from '@angular/core';
import { RefConfig } from '../../models/ref-config';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatOption } from "@angular/material";
import { RefConfigService } from '../../services/ref-config.service';

@Component({
  selector: 'ref-config-form',
  templateUrl: './ref-config-form.component.html',
  styleUrls: ['./ref-config-form.component.css'],
  providers: [RefConfigService]
})
export class RefConfigFormComponent implements OnInit {
  model: RefConfig;
  formGroup: FormGroup;
  isEdit = false;

  constructor(
    private _service: RefConfigService,
    public dialogRef: MatDialogRef<RefConfigFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    // create form
    this.formGroup = this.formBuilder.group({
      uraian: ["", Validators.required],
      configKey: ["", Validators.required],
      configValue: ["", Validators.required],
      isEncrypted: ["", Validators.required]
    });

    this.model = {} as RefConfig;

    // prepare model
    if (this.data != null) {
      this._service.getById(this.data.RefConfigId).subscribe(result => {
        // edit
        this.isEdit = true;
        this.model = result; // asumsi yang dilempar oleh data adalah object RefConfig
        this.formGroup.setValue({
          // refConfigId: this.model.RefConfigId,
          uraian: this.model.Uraian,
          configKey: this.model.ConfigKey,
          configValue: this.model.ConfigValue,
          isEncrypted: this.model.IsEncrypted
        });
      });
    }
  }

  /* EVENTS */
  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    // prepare model to be sent
    this.model.Uraian = this.formGroup.controls['uraian'].value;
    this.model.ConfigKey = this.formGroup.controls['configKey'].value;
    this.model.ConfigValue = this.formGroup.controls['configValue'].value;
    this.model.IsEncrypted = this.formGroup.controls['isEncrypted'].value;
    this.dialogRef.close(this.model);
  }

}
