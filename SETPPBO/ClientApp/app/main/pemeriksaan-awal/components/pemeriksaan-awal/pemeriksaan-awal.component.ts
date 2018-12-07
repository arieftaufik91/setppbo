import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { PemeriksaanAwalService } from '../../services/pemeriksaan-awal.service';

import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";

import { PemeriksaanAwalDetailComponent } from "../pemeriksaan-awal-detail/pemeriksaan-awal-detail.component";

import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from "@angular/animations";

import { PemeriksaanAwal } from '../../../pemeriksaan-awal/models/pemeriksaan-awal';
import { WingToolbarComponent } from '../../../../shared/wing/components/wing-toolbar/wing-toolbar.component';
import { SharedDataService } from '../../../administrasi-banding-gugatan/services/shared-data.service';

@Component({
    selector: 'pemeriksaan-awal',
    templateUrl: './pemeriksaan-awal.component.html',
    styleUrls: ['./pemeriksaan-awal.component.css'],
    providers: [PemeriksaanAwalService],
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
export class PemeriksaanAwalComponent implements OnInit {
    // default properties
    items: PemeriksaanAwal[];
    tempItems: PemeriksaanAwal[];
    item: PemeriksaanAwal;

    // ngx-datatable properties
    columns: any[] = [];
    selected: any[] = [];
    @ViewChild('tglSurat') tglSurat: TemplateRef<any>;

    // Pagination & Search Variable
    offset: number = 0;
    limit: number = 10;
    count: number = 0;
    search: string = '';
    @ViewChild(WingToolbarComponent) wingToolbar: WingToolbarComponent;

    // animations properties
    state = "inactive";

    isEdit = false;
    isSend = false;

    downloadBPELink: string;
    downloadBaseUrl: string;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service: PemeriksaanAwalService,
        private snackbar: PuiSnackbarService,
        private dialogsService: PuiConfirmDialogService,
        private _sharedService: SharedDataService,
        private router: Router
    ) { }

    ngOnInit() {

        this.downloadBaseUrl = this._sharedService.getURL();

        this.prepareTableContent();

        // set datatable.column
        // specify column
        this.columns = [
            { prop: "NoSengketa", name: "No. Sengketa" },
            { prop: "NoKep", name: "No. KEP/SPKTNP/S" },
            { prop: "NoSkp", name: "No. SKP/SPTNP" },
            { prop: "RefJenisPermohonanUr", name: "Jenis Sengketa" },
            { prop: "NoSuratPermohonan", name: "No. Surat" },
            { prop: "TglSuratPermohonan", name: "Tgl. Surat", cellTemplate: this.tglSurat },

        ];

    }
    onSelect(event: any) {
        if (event.selected[0] == null) {
            this.deactivateState();
            this.state = 'inactive';
        } else {
            this.activateState();
            this.state = 'active';
            this.wingToolbar.searchShow = false; //for hiding searchbar input
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
    /*
      onAddClick() {
          this.router.navigate(['/permohonan/add']);
      }
    
      onEditDraftClick() {
          this.router.navigate(['/permohonan/edit', this.selected[0].PermohonanId]);
      }
    
      onSendDraftClick() {
          this.router.navigate(['/permohonan/information', this.selected[0].PermohonanId]);
      }
    
      onEditValidClick() {
          this.router.navigate(['/permohonan/editValidasi', this.selected[0].PermohonanId]);
      }
    
      onSendValidClick() {
          this.router.navigate(['/permohonan/informationValidasi', this.selected[0].PermohonanId]);
      }
    */
    onEditCheckClick() {
        this.router.navigate(['/pemeriksaan-awal/edit', this.selected[0].PermohonanId]);
    }

    onSendCheckClick() {
        this.router.navigate(['/pemeriksaan-awal/information', this.selected[0].PermohonanId]);
    }

    activateState() {
        this.state = "active";

        if (this.selected[0].RefStatusId == 130) { // Draft Pemeriksaan Awal  
            this.resetStatus();
            this.isEdit = true;
            this.isSend = true;
        }
        else if (this.selected[0].RefStatusId == 121) { // Kirim Validasi  
            this.resetStatus();
            this.isEdit = true;
            this.isSend = false;
        }
        else {
            this.isEdit = false;
            this.isSend = false;
        }
    }

    deactivateState() {
        this.state = "inactive";
        this.isEdit = false;
        this.isSend = false;
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

    resetStatus() {
        this.isEdit = false;
        this.isSend = false;
    }

    /* Pagination & Search Server Side */

    /* prepareTableContent()
     * Function untuk menyiapkan isi tabel.
     * return dari API wajib ada Data dan Count, Contoh di PermohonanController -> GetByPaging()
     * limit = batas jumlah row yang diambil, offset = halaman sekarang.
     */
    prepareTableContent() {
        let data = { Limit: this.limit, Offset: this.offset, Search: this.search };
        this._service.getAll(data).subscribe(result => {
            this.items = result.Data;
            this.tempItems = [...result.Data];
            this.count = result.Count;
        });
    }

    /* prepareTableContent()
     * Function untuk melakukan pencarian secara server side
     */
    updateFilter(event: any) {
        try {
            this.search = event.target.value.toLowerCase();
        } catch (error) {
            this.search = ''
        }
        this.prepareTableContent();
        this.table.offset = 0;
    }

    /* Function untuk memperbaharui halaman saat ini.
     * based on click from ngx-datatable pagination number.
     */
    setPage(event: any) {
        this.offset = event.offset;
        this.prepareTableContent()
    }

    //for refresh table content
    refresh(event: any) {
        this.updateFilter(event);
    }

    /* !!!!! WARNING !!!!!
        WAJIB IMPORT WingModule PADA MODUL YANG TERDAPAT WING COMPONENT
    */

}
