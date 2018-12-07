import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AuditUser } from '../../models/audit-user';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuditUserService } from '../../services/audit-user.service';

@Component({
    selector: 'audit-user-detail',
    templateUrl: './audit-user-detail.component.html',
    styleUrls: ['./audit-user-detail.component.css'],
    providers: [AuditUserService]
})
export class AuditUserDetailComponent implements OnInit {
    // default properties
    items: AuditUser[];
    tempItems: AuditUser[];
    item: AuditUser;

    // ngx-datatable properties
    columns: any[];

    //~ default value
    itemLimit = 10;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service: AuditUserService,
        public dialogRef: MatDialogRef<AuditUserDetailComponent>,
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
        this._service.getById(this.data.UserId).subscribe(result => {
            console.log(result);
            this.items = result;
            this.tempItems = [...result];
        });
    }

    /* EVENTS */
    onOkClick() {
        this.dialogRef.close();
    }
}
