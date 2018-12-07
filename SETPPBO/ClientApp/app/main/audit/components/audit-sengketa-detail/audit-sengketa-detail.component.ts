import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AuditSengketa } from '../../models/audit-sengketa';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuditSengketaService } from '../../services/audit-sengketa.service';

@Component({
    selector: 'audit-sengketa-detail',
    templateUrl: './audit-sengketa-detail.component.html',
    styleUrls: ['./audit-sengketa-detail.component.css'],
    providers: [AuditSengketaService]
})
export class AuditSengketaDetailComponent implements OnInit {
    // default properties
    items: AuditSengketa[];
    tempItems: AuditSengketa[];
    item: AuditSengketa;

    // ngx-datatable properties
    columns: any[];

    //~ default value
    itemLimit = 10;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service: AuditSengketaService,
        public dialogRef: MatDialogRef<AuditSengketaDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.prepareTableContent();
    }

    ngOnInit() {
        //this.prepareTableContent();

        // set datatable.column
        // specify column
        this.columns = [
            { name: "Time", prop: "LogDate" },
            { name: "Surat Permohonan", prop: "NoSuratPermohonan" },
            { name: "User", prop: "Name" },
            { name: "Url", prop: "StringUrl" },
            { name: "Method", prop: "Method" },
            { name: "Old Value", prop: "OldValue" },
            { name: "New Value", prop: "NewValue" }
        ];
    }

    /**
     * Function untuk menyiapkan isi tabel.
     * Ambil dari SampleService.
     */
    prepareTableContent() {
        this._service.getById(this.data.PermohonanId).subscribe(result => {
            this.items = result;
            this.tempItems = [...result];
        });
    }

    /* EVENTS */
    onOkClick() {
        this.dialogRef.close();
    }
}
