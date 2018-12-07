import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { DashboardService } from '../../services/dashboard.service';
import { DashboardList } from '../../models/dashboard-list';

@Component({
  selector: 'app-dashboard-daftar-berkas-masuk',
  templateUrl: './dashboard-daftar-berkas-masuk.component.html',
  styleUrls: ['./dashboard-daftar-berkas-masuk.component.css'],
  providers: [DashboardService],
})
export class DashboardDaftarBerkasMasukComponent implements OnInit {

  // default properties
  items: DashboardList[];
  tempItems: DashboardList[];

  // ngx-datatable properties
  columns: any[];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Output() changeCounter = new EventEmitter<number>();    

  constructor(
    private _service: DashboardService
  ) { }

  ngOnInit() {
    this.prepareTableContent();

    // set datatable.column
    // specify column
    this.columns = [
      { prop: "tgl_terima_permohonan", name: "Tanggal Terima Permohonan" }, 
      { prop: "nama_pemohon", name: "Nama Pemohon" }, 
      { prop: "no_surat", name: "Nomor Surat" }, 
      { prop: "no_sengketa", name: "Nomor Sengketa" }
    ];
  }

  prepareTableContent() {
    this._service.getDaftarBerkasMasuk().subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
      this.changeCounter.emit(result.length);
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
    this.items = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
