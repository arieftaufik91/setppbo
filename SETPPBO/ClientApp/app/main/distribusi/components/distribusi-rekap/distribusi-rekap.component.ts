import { Component, OnInit, ViewChild } from '@angular/core';
import { DistribusiService } from '../../services/distribusi.service';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DistribusiRekapDetailComponent } from '../distribusi-rekap-detail/distribusi-rekap-detail.component';
import { DistribusiRekapFormComponent } from '../distribusi-rekap-form/distribusi-rekap-form.component';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { WingToolbarComponent } from '../../../../shared/wing/components/wing-toolbar/wing-toolbar.component';

@Component({
  selector: 'app-distribusi-rekap',
  templateUrl: './distribusi-rekap.component.html',
  styleUrls: ['./distribusi-rekap.component.css'],
  providers: [DistribusiService]  
})
export class DistribusiRekapComponent implements OnInit {

  rows: any[];
  tempRows: any[];
  selected: any[] = [];
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

  // Pagination & Search Variable
  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  search: string = '';
  state: string = "inactive";
  @ViewChild(WingToolbarComponent) wingToolbar: WingToolbarComponent;

  @ViewChild(DatatableComponent) table: DatatableComponent;  

  constructor(
    private _service: DistribusiService,
    private dialogsService: PuiConfirmDialogService,
    private snackbar: PuiSnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.prepareTableContent();
  }

  prepareTableContent() {
    /*this._service.getBerkasSudahDistribusi().subscribe(result => {
      this.rows = result;
      this.tempRows = [...result];
      this.daftarCetak = [];
      this.selected = [];
    });*/
    let data = { Limit: this.limit, Offset: this.offset, Search: this.search };
    this._service.getBerkasSudahDistribusiServerSide(data).subscribe(result => {
        this.rows = result.Data;
        this.tempRows = [...result.Data];
        this.count = result.Count;
        this.daftarCetak = [];
        this.selected = [];
    });
  }

  print() {
    this.dialogsService
      .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Mencetak Rekap Distribusi?")
      .subscribe(accept => {
        if (accept) {
          this.daftarCetak = []
          this.selected.forEach(item => {
            this.daftarCetak.push(item.PermohonanId)
          })
          this._service.getDaftarCetakDistribusi(this.daftarCetak).subscribe(result => {
              var currentDate = new Date()
              this._service.exportAsExcelFile(result, 'Rekap_Distribusi_' + currentDate.getDate() + "_" + this.months[currentDate.getMonth()] + "_" + currentDate.getFullYear());
          });
        }
      });
  }

  onSelect() {
    if(this.selected.length == 0){
      this.state = "inactive";
    } else {
      this.state = "active";
      this.wingToolbar.searchShow = false;
    }
  }

  /*changeMajelis(permohonan: any) {
      let dialogRef = this.dialog.open(DistribusiRekapFormComponent, {
        data: permohonan
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
            this._service.prosesRedistribusi(result.PermohonanId, result).subscribe(result => {
                this.prepareTableContent();
                this.snackbar.showSnackBar("success", "Proses Distribusi Ulang Berhasil!");
            });
        }
      });
  }*/

  changeMajelis() {
      let dialogRef = this.dialog.open(DistribusiRekapFormComponent, {
        data: this.selected
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          console.log(result)
            this._service.prosesRedistribusi(result).subscribe(result => {
                this.prepareTableContent();
                this.snackbar.showSnackBar("success", "Proses Distribusi Ulang Berhasil!");
            });
        }
      });
  }

  showDetail() {
      let dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        permohonanId: this.selected[0].PermohonanId,
      };
      let dialogRef = this.dialog.open(DistribusiRekapDetailComponent, dialogConfig);
  }

  selectAll() {
    this.selected = [...this.rows]
  }

  deselectAll() {
    this.selected = []
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

  //for refresh table content
  refresh(event: any) {
      this.updateFilter(event);
  }

}
