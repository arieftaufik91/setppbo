import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { PemohonService } from '../../services/pemohon.service';
import { Pemohon } from '../../models/pemohon';

@Component({
    selector: 'pemohon-detail',
    templateUrl: './pemohon-detail.component.html',
    styleUrls: ['./pemohon-detail.component.css'],
    providers: [PemohonService]
})
export class PemohonDetailComponent implements OnInit {
    item: any;

    constructor(
        public dialogRef: MatDialogRef<PemohonDetailComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Pemohon,
        private _service: PemohonService
    ) {
        this.fetch();
    }

    ngOnInit() {
    }

    fetch() {
        if (this.data != null) {
            this._service.getById(this.data.PemohonId)
                .subscribe(result => {
                    this.item = result;
                });
        }
    }

    /* EVENTS */
    onNoClick() {
        this.dialogRef.close();
    }

    //~ view npwp
    onViewNpwp() {
        window.open(window.location.origin + '/api/Pemohon/npwp/v/' + `${this.data.PemohonId}`);
    }
}