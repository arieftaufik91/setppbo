import { Component, OnInit, ViewChild } from '@angular/core';

import { PemohonService } from '../../services/pemohon.service';

import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog, MatDialogConfig } from "@angular/material";

import { PemohonFormComponent } from "../pemohon-form/pemohon-form.component";
import { PemohonVerificationFormComponent } from "../pemohon-verification-form/pemohon-verification-form.component";
import { PemohonRegistrationFormComponent } from "../pemohon-registration-form/pemohon-registration-form.component";
import { PemohonDetailComponent } from '../pemohon-detail/pemohon-detail.component';

import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from "@angular/animations";
import { Pemohon } from '../../models/pemohon';

@Component({
    selector: 'pemohon',
    templateUrl: './pemohon.component.html',
    styleUrls: ['./pemohon.component.css'],
    providers: [PemohonService],
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
export class PemohonComponent implements OnInit {
    codeMsg: string; //~ temp

    // default properties
    items: Pemohon[];
    tempItems: Pemohon[];
    item: Pemohon;

    // ngx-datatable properties
    columns: any[];
    selected: any[] = [];

    // animations properties
    state = "inactive";

    //~ default value
    itemLimit = 10;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service: PemohonService,
        private dialog: MatDialog,
        private snackbar: PuiSnackbarService,
        private dialogsService: PuiConfirmDialogService
    ) { }

    ngOnInit() {
        this.codeMsg = ""; //~ temp

        this.prepareTableContent();

        // set datatable.column
        // specify column
        this.columns = [
            // { prop: "PemohonId" },
            { prop: "Nama" },
            { prop: "Npwp", name: "NPWP" },
            { prop: "Ereg", name: "eReg" }
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
        this.codeMsg = ""; //~ temp

        if (event.selected[0] == null) {
            this.deactivateState();
        } else {
            this.activateState();
        }
        // navigate to detail
        //this.router.navigate(['/sample', event.selected[0].QuoteId]);
    }

    /**
     * Method untuk unselect pilihan baris di tabel.
     * @param row 
     */
    singleSelectCheck(row: any) {
        return this.selected.indexOf(row) === -1;
    }
    /**
     * 
     */
    onRegisterClick() {
        // add new quote
        // dialog form
        let dialogRef = this.dialog.open(PemohonRegistrationFormComponent, {});

        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this._service.register(result).subscribe(result => {
                    this.prepareTableContent();
                    this.snackbar.showSnackBar("success", "Registrasi Pemohon berhasil disimpan");
                }, error => {
                    this.snackbar.showSnackBar("error", "Registrasi Pemohon gagal! Error: " + error.statusText);
                });
            }
        });
    }
    /**
     * 
     */
    onAddClick() {
        // add new quote
        // dialog form
        let dialogRef = this.dialog.open(PemohonFormComponent, {});

        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this._service.add(result).subscribe(result => {
                    this.prepareTableContent();
                    this.snackbar.showSnackBar("success", "Pemohon berhasil disimpan");
                }, error => {
                    this.snackbar.showSnackBar("error");
                });
            }
        });
    }

    //~ verification
    onVerificationClick() {
        //~ should get retrieved/loaded data from service
        let dialogRef = this.dialog.open(PemohonVerificationFormComponent, {
            data: this.selected[0]
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this._service.verify(result).subscribe(result => {
                    this.prepareTableContent();
                    this.snackbar.showSnackBar("success", "Pemohon berhasil diverifikasi");
                });
            }
        });
    }

    //~ close dialog
    onNoClick() {
        this.dialog.closeAll();
    }

    onEditClick() {
        //this.selected[0].isEdit = true;

        //~ should get retrieved/loaded data from service
        let dialogRef = this.dialog.open(PemohonRegistrationFormComponent, {
            data: this.selected[0]
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this._service.update(result).subscribe(result => {
                    this.prepareTableContent();
                    this.snackbar.showSnackBar("success", "Edit Pemohon berhasil!");
                }, error => {
                    this.snackbar.showSnackBar("error");
                });
            }
        });
    }

    showDetail(pemohonId: string) {
        //let dialogConfig = new MatDialogConfig();
        //dialogConfig.data = {
        //    pemohonId: pemohonId,
        //};
        let dialogRef = this.dialog.open(PemohonDetailComponent, {
            data: this.selected[0]
        });
    }

    //~ generate verification code and link
    onGenVerCodeClick() {
        //~ should get retrieved/loaded data from service
        // let dialogRef = this.dialog.open(PemohonRegistrationFormComponent, {
        //     data: this.selected[0]
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     this.prepareTableContent();
        // });


        this._service.sverify(this.selected[0]).subscribe(result => {
            this.prepareTableContent();
            this.snackbar.showSnackBar("success", "Kode verifikasi berhasil dibuat!");
            this.codeMsg = result;
        });
    }

    // onDeleteClick() {
    //   // konfirmasi
    //   this.dialogsService
    //     .confirm("Konfirmasi", "Yakin mau menghapus pemohon?")
    //     .subscribe(accept => {
    //       if (accept) {
    //         let item = this.selected[0];
    //         this._service.delete(item).subscribe(
    //           result => {
    //             this.prepareTableContent();
    //             this.snackbar.showSnackBar("success", "Hapus pemohon berhasil!");
    //           },
    //           error => { },
    //           () => { }
    //         );
    //       }
    //     });
    // }

    // onDeleteClick() {
    //   // konfirmasi
    //   this.dialogsService
    //     .confirm("Konfirmasi", "Yakin mau menghapus pemohon?")
    //     .subscribe(accept => {
    //       if (accept) {
    //         let item = this.selected[0];
    //         this._service.delete(item).subscribe(
    //           result => {
    //             this.prepareTableContent();
    //             this.snackbar.showSnackBar("success", "Hapus pemohon berhasil!");
    //           },
    //           error => { },
    //           () => { }
    //         );
    //       }
    //     });
    // }

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
        this.table.offset = 0;
    }
}
