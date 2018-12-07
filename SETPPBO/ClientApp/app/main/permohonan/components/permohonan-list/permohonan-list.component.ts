import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Permohonan } from "../../models/permohonan";
import { PermohonanService } from "../../services/permohonan.service";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { Transition, Rotation } from "../../../../shared/wing/components/wing-toolbar/wing-toolbar.animation";
import { WingToolbarComponent } from "../../../../shared/wing/components/wing-toolbar/wing-toolbar.component";
import { SharedDataService } from "../../../administrasi-banding-gugatan/services/shared-data.service";

@Component({
    selector: 'app-permohonan-list',
    templateUrl: './permohonan-list.component.html',
    styleUrls: ['./permohonan-list.component.css'],
    providers: [PermohonanService],
    animations: [Transition, Rotation]
})
export class PermohonanListComponent implements OnInit {
    // default properties
    items: Permohonan[];
    tempItems: Permohonan[];
    item: Permohonan;

    // ngx-datatable properties
    columns: any[] = [];
    selected: any[] = [];
    link: any;
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
    isDownload = false;

    downloadBPELink: string;
    downloadBaseUrl: string;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service: PermohonanService,
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
            { prop: "NoPendaftaran", name: "No. Pendaftaran" },
            { prop: "NoSengketa", name: "No. Sengketa" },
            { prop: "NoKep", name: "No. KEP/SPKTNP/S" },
            { prop: "NoSkp", name: "No. SKP/SPTNP" },
            { prop: "RefJenisPermohonanUr", name: "Jenis Sengketa" },
            { prop: "NoSuratPermohonan", name: "No. Surat" },
            { prop: "TglSuratPermohonan", name: "Tgl. Surat", cellTemplate: this.tglSurat },
        ];
    }

    /* SCRIPT EVENT */
    /**
     * Function ketika baris di dalam tabel diklik.
     * Digunakan untuk aktivasi / deaktivasi toolbar
     * @param event 
     */
    onSelect(event: any) {
        if (event.selected[0] == null) {
            this.deactivateState();
            this.state = 'inactive';
        } else {
            this.activateState();
            this.state = 'active';
            this.wingToolbar.searchShow = false; //for hiding searchbar input
        }    }

    /**
     * Method untuk unselect pilihan baris di tabel.
     * @param row 
     */
    singleSelectCheck(row: any) {
        return this.selected.indexOf(row) === -1;
    }

    onAddClick() {
        this.router.navigate(['/permohonan/add']);
    }

    onEditDraftClick() {
        this.router.navigate(['/permohonan/edit', this.selected[0].PermohonanId]);
    }

    onSendDraftClick() {
        this.router.navigate(['/permohonan/information', this.selected[0].PermohonanId]);
    }

    onDownloadBPEClick() {
        window.open(this.downloadBaseUrl + "/api/Permohonan/CetakPermohonan/" + this.selected[0].PermohonanId, '_blank');
    }

    onSendCheckClick() {
        this.router.navigate(['/permohonan/informationPemeriksaan', this.selected[0].PermohonanId]);
    }

    onDeleteClick() {
        // konfirmasi
        let message = "Yakin mau menghapus permohonan?";
        this.dialogsService.confirm("Konfirmasi", message).subscribe(accept => {
            if (accept) {
                let item = this.selected[0];
                this._service.delete(item).subscribe(result => {
                    this.prepareTableContent();
                    this.snackbar.showSnackBar("success", "Hapus permohonan berhasil!");
                });
            }
        });
    }

    activateState() {
        this.state = "active";

        if (this.selected[0].RefStatusId == 100 && this.selected[0].PegawaiId == null) { // Draft Permohonan FO 
            this.resetStatus();
            this.isEdit = false;
            this.isSend = false;
            this.isDownload = false;

        }
        else if (this.selected[0].RefStatusId == 100) { // Draft Permohonan  BO

            this.resetStatus();
            this.isEdit = true;
            this.isSend = true;
            this.isDownload = false;

        }
        else {
            this.isEdit = false;
            this.isSend = false;
            this.isDownload = true;
        }
    }

    print() {
        if (this.item != null) {
            
            this._service.getBaseUrl().subscribe(result => {
                this.link = result + "/api/Permohonan/CetakPermohonan/" + this.item.PermohonanId;
            });
        } else {
            this._service.getBaseUrl().subscribe(result => {
                
                this.link = result + "/api/Permohonan/CetakPermohonan/" + this.selected[0].PermohonanId;
            });
        }

        setTimeout(() => {
            window.open(this.link);
        }, 250);
    }

    deactivateState() {
        this.state = "inactive";
        this.isEdit = false;
        this.isSend = false;
        this.isDownload = false;
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
        this.isDownload = false;
    }

    /* Pagination & Search Server Side */

    /* prepareTableContent()
     * Function untuk menyiapkan isi tabel.
     * return dari API wajib ada Data dan Count, Contoh di PermohonanController -> GetByPaging()
     * limit = batas jumlah row yang diambil, offset = halaman sekarang.
     */
    prepareTableContent() {
        let data = { Limit: this.limit, Offset: this.offset, Search: this.search };
        this._service.getByPaging(data).subscribe(result => {
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
