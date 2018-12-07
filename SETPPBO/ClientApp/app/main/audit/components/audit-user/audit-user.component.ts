import { Component, OnInit, ViewChild } from '@angular/core';

import { AuditUserService } from '../../services/audit-user.service';

import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";

import { AuditUserDetailComponent } from '../audit-user-detail/audit-user-detail.component';

import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from "@angular/animations";

import { AuditUserList } from '../../models/audit-user-list';

@Component({
    selector: 'audit-user',
    templateUrl: './audit-user.component.html',
    styleUrls: ['./audit-user.component.css'],
    providers: [AuditUserService],
    animations: [
        trigger("myState", [
            state(
                "inactive",
                style({
                    transform: "translate3d(0,0,0)",
                    left: "-50px",
                    opacity: 0
                })
            ),
            state(
                "active",
                style({
                    transform: "translate3d(10px,0,0)",
                    opacity: 1
                })
            ),
            transition("inactive => active", animate("300ms ease-in")),
            transition("active => inactive", animate("300ms ease-out"))
        ]),
        trigger("myRotation", [
            state(
                "inactive",
                style({
                    // rotate left
                    transform: "rotate(-90deg)"
                })
            ),
            state(
                "active",
                style({
                    transform: "rotate(90deg)"
                })
            ),
            transition("inactive => active", animate("300ms ease-in")),
            transition("active => inactive", animate("300ms ease-out"))
        ])
    ]
})
export class AuditUserComponent implements OnInit {
    // default properties
    items: AuditUserList[];
    tempItems: AuditUserList[];
    item: AuditUserList;

    // ngx-datatable properties
    columns: any[];
    selected: any[] = [];

    // animations properties
    state = "inactive";

    //~ default value
    itemLimit = 10;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service: AuditUserService,
        private dialog: MatDialog,
        private snackbar: PuiSnackbarService,
        private dialogsService: PuiConfirmDialogService
    ) { }

    ngOnInit() {
        this.prepareTableContent();

        // set datatable.column
        // specify column
        this.columns = [
            { name: "User", prop: "Name" },
            { name: "Total Log", prop: "Count" }
        ];
    }

    /**
     * Function untuk menyiapkan isi tabel.
     * Ambil dari SampleService.
     */
    prepareTableContent() {
        this._service.getAll().subscribe(result => {
            this.items = result;
            this.tempItems = [...result];
        });
    }

    /* SCRIPT EVENT */
    /**
     * Function ketika baris di dalam tabel diklik.
     * Digunakan untuk aktivasi / deaktivasi toolbar
     * @param event 
     */
    onSelect(event: any) {
        console.log(this.selected[0]);
        if (event.selected[0] == null) {
            this.deactivateState();
        } else {
            this.activateState();
        }
    }

    /**
     * Method untuk unselect pilihan baris di tabel.
     * @param row 
     */
    singleSelectCheck(row: any) {
        return this.selected.indexOf(row) === -1;
    }

    onViewClick() {
        console.log('edit selected', this.selected);
        let dialogRef = this.dialog.open(AuditUserDetailComponent, {
            data: this.selected[0]
        });

        dialogRef.afterClosed().subscribe(result => {
            this.prepareTableContent();
            this.deactivateState();
            this.selected = [];
        });
    }

    /* ANIMATIONS EVENT */
    toggleState() {
        this.state = this.state === "active" ? "inactive" : "active";
    }

    activateState() {
        this.state = "active";
    }

    deactivateState() {
        this.state = "inactive";
    }

    /* FILTER EVENT */
    filterByValue(array: any[], string: string) {
        return array.filter(
            data =>
                JSON.stringify(data)
                    .toLowerCase()
                    .indexOf(string.toLowerCase()) !== -1
        );
    }

    updateFilter(event: any) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.filterByValue(this.tempItems, val);

        // update the rows
        this.items = temp;
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }
}