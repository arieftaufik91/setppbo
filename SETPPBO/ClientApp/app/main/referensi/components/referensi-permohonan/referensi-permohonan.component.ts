import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { RefPermohonan } from "../../models/referensi-permohonan"
import { ReferensiPermohonanService } from "../../services/referensi-permohonan.service"
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { Transition, Rotation } from "../../../../shared/wing/components/wing-toolbar/wing-toolbar.animation";
import { WingToolbarComponent } from "../../../../shared/wing/components/wing-toolbar/wing-toolbar.component";
import { SharedDataService } from "../../../administrasi-banding-gugatan/services/shared-data.service";
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { ReferensiPermohonanFormComponent} from "../referensi-permohonan-form/referensi-permohonan-form.component"


@Component({
  selector        : 'app-referensi-permohonan',
  templateUrl     : './referensi-permohonan.component.html',
  styleUrls       : ['./referensi-permohonan.component.css'],
  providers       :[ReferensiPermohonanService]
})
export class ReferensiPermohonanComponent implements OnInit {
    items           : RefPermohonan[];
    tempItems       : RefPermohonan[];
    item            : RefPermohonan;

    rows            : any[];
    columns         : any[] = [];
    selected        : any[] = [];
    link            : any;
    state           : string;
    isVisible       : boolean;
   
    offset          : number = 0;
    limit           : number = 10;
    count           : number = 0;
    search          : string = '';
    
    @ViewChild(WingToolbarComponent) wingToolbar: WingToolbarComponent;
    @ViewChild('tglSurat') tglSurat: TemplateRef<any>;

    isEdit        = false;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(
        private _service        : ReferensiPermohonanService,
        private snackbar        : PuiSnackbarService,
        private dialogsService  : PuiConfirmDialogService,
        private _sharedService  : SharedDataService,
        private router          : Router,
        private dialog          : MatDialog,

    ) { }

    ngOnInit() {
        this.prepareTableContent();
        this.columns = [
            { prop: "NoPendaftaran", name: "No. Pendaftaran" },
            { prop: "NoSengketa", name: "No. Sengketa" },
            { prop: "PemohonName", name: "Pemohon" },
            { prop: "NoKep", name: "No. KEP/SPKTNP/S" },
            { prop: "NoSkp", name: "No. SKP/SPTNP" },
            { prop: "RefJenisPermohonanUr", name: "Jenis Sengketa" },
            { prop: "NoSuratPermohonan", name: "No. Surat" },
            { prop: "TglSuratPermohonan", name: "Tgl. Surat", cellTemplate: this.tglSurat },
            { prop: "RefStatus", name: "Status" },

        ];
    }

    editRefPermohonan(){
        let dialogConfig = new MatDialogConfig();
        dialogConfig.width = '30%';
        dialogConfig.data = this.selected[0];
        let dialogRef = this.dialog.open(ReferensiPermohonanFormComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.item = result;
              this._service.edit(result).subscribe(result => {
                  this.prepareTableContent();
                  this.snackbar.showSnackBar("success", "Edit Permohonan berhasil!");
              });
          }
        });
      }

    onSelect(event: any) {
        // console.log("Selected: ", event.selected[0].QuoteId);
        if (event.selected[0] == null) {
          this.deactivateState();
        } else {
          this.activateState();
        }
      }

      activateState() {
        this.state      = "active";
        this.isVisible  = true;
      }
    
      deactivateState() {
        this.state       = "inactive";
        this.isVisible   = false;
      }

   
    /**
     * Method untuk unselect pilihan baris di tabel.
     * @param row 
     */
    singleSelectCheck(row: any) {
        return this.selected.indexOf(row) === -1;
    }


    onEditDraftClick() {
        this.router.navigate(['/permohonan/edit', this.selected[0].PermohonanId]);
    }

    
   

   
    filterByValue(array: any[], string: string) {
        return array.filter(
            data =>
                JSON.stringify(data)
                    .toLowerCase()
                    .indexOf(string.toLowerCase()) !== -1
        );
    }

    prepareTableContent() {
        let data = { Limit: this.limit, Offset: this.offset, Search: this.search };
        this._service.getByPaging(data).subscribe(result => {
            this.items = result.Data;
            this.tempItems = [...result.Data];
            this.count = result.Count;
        });
    }

    updateFilter(event: any) {
        try {
            this.search = event.target.value.toLowerCase();
        } catch (error) {
            this.search = ''
        }
        this.prepareTableContent();
        this.table.offset = 0;
    }

    setPage(event: any) {
        this.offset = event.offset;
        this.prepareTableContent()
    }

    refresh(event: any) {
        this.updateFilter(event);
    }

}
