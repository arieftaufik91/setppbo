import { Component, OnInit, ViewChild } from '@angular/core';
import { BerkasSiapSidangService } from '../../services/berkas-siap-sidang.service'
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Permohonan } from "../../../permohonan/models/permohonan";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-berkas-siap-sidang-list',
  templateUrl: './berkas-siap-sidang-list.component.html',
  styleUrls: ['./berkas-siap-sidang-list.component.css'],
  providers: [BerkasSiapSidangService]
})
export class BerkasSiapSidangListComponent implements OnInit {
  // default properties
  items: Permohonan[];
  tempItems: Permohonan[];
  item: Permohonan;
  // ngx-datatable properties
  rows: any[];
  tempRows: any[];
  columns: any[];
  selected: any[] = [];

  // ngx-datatable limit page
  selectedValue: string;
  LIMITS = [
    { key: '5', value: 5},
    { key: '10', value: 10},
    { key: '50', value: 50},
    { key: '100', value: 100}
  ]

  // file properties
  daftarCetak: any[] = [];
  months: string[] = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
    ];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private _service: BerkasSiapSidangService,
    private dialogsService: PuiConfirmDialogService,
    private snackbar: PuiSnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.prepareTableContent();
  }
  /**
     * Function untuk menyiapkan isi tabel.
     * Ambil dari SampleService.
     */
    prepareTableContent() {
      this._service.getBerkasSiapSidang().subscribe(result => {
          this.items = result;
          this.tempItems = [...result];
          this.daftarCetak = [];
          this.selected = [];
          this.rows = result;
          this.tempRows = [...result];
      });
    }

    print() {
      this.dialogsService
        .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Mencetak Daftar Banding dan Gugatan?")
        .subscribe(accept => {
          if (accept) {
            this.daftarCetak = []
            this.selected.forEach(item => {
              this.daftarCetak.push(item.PermohonanId)
            })
            this._service.getDaftarSiapSidang(this.daftarCetak).subscribe(result => {
                var currentDate = new Date()
                this._service.exportAsExcelFile(result, 'Daftar_DataCover' + currentDate.getDate() + "_" + this.months[currentDate.getMonth()] + "_" + currentDate.getFullYear());
            });
          }
        });
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
      this.rows = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }

    selectAll() {
        this.selected = [...this.rows]
    }

    deselectAll() {
        this.selected = []
    }

    limit: number =this.LIMITS[0].value;
    rowLimits: Array<any> = this.LIMITS;

    changeRowLimits(event: any) {
      this.limit = event.target.value;
    }

}
