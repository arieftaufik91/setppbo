import { Component, OnInit, ViewChild } from "@angular/core";
import { Permohonan } from "../../../permohonan/models/permohonan";
import { SengketaService } from "../../services/sengketa.service";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog, MatDialogConfig } from "@angular/material";
//import { PermohonanFormComponent } from "../permohonan-form/permohonan-form.component";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { Params } from "@angular/router";


@Component({
  selector: 'app-sengketa-list',
  templateUrl: './sengketa-list.component.html',
  styleUrls: ['./sengketa-list.component.css'],
  providers: [SengketaService]
})
export class SengketaListComponent implements OnInit {
  items         : Permohonan[];
  tempItems     : Permohonan[];
  item          : Permohonan;
 
  rows          : any[];
  tempRows      : any[];
  columns       : any[];
  selected      : any[] = [];

  inputTglAwal  : Date;
  inputTglAkhir : Date;
  params        : Params;

  Filter        : any[]        =[];

  selectedValue : string;
  LIMITS = [
    { key: '10', value: 10},
    { key: '20', value: 20},
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
    private _service: SengketaService,
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
      this._service.getSengketa().subscribe(result => {
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
              this._service.getDaftarCetak(this.daftarCetak).subscribe(result => {
                  var currentDate = new Date()
                  this._service.exportAsExcelFile(result, 'Daftar_BandingdanGugatan' + currentDate.getDate() + "_" + this.months[currentDate.getMonth()] + "_" + currentDate.getFullYear());
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
    
    FilterByName(){
      this.Filter         = [];

      this.inputTglAwal   == null ? this.inputTglAwal   = new Date()  : this.inputTglAwal ;
      this.inputTglAkhir  == null ? this.inputTglAkhir  = new Date()  : this.inputTglAkhir ;

      this.Filter.push(this.inputTglAwal);
      this.Filter.push(this.inputTglAkhir)

      this._service.getAllDaftarSidangFilter(this.Filter).subscribe(result => {
        this.items = result;
          this.tempItems = [...result];
          this.daftarCetak = [];
          this.selected = [];
          this.rows = result;
          this.tempRows = [...result];
      });

    }
}
