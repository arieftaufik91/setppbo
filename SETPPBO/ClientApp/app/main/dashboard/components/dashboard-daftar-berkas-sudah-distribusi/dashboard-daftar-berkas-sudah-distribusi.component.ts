import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DashboardList } from '../../models/dashboard-list';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-daftar-berkas-sudah-distribusi',
  templateUrl: './dashboard-daftar-berkas-sudah-distribusi.component.html',
  styleUrls: ['./dashboard-daftar-berkas-sudah-distribusi.component.css']
})
export class DashboardDaftarBerkasSudahDistribusiComponent implements OnInit {

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
      { prop: "no_sengketa", name: "Nomor Sengketa" }, 
      { prop: "nama_pemohon", name: "Nama Pemohon" }, 
      { prop: "jenis_sengketa", name: "Jenis Sengketa" }, 
      { prop: "jenis_pemeriksaan", name: "Jenis Pemeriksaan" },
      { prop: "majelis", name: "Majelis" }
    ];
  }

  prepareTableContent() {
    this._service.getDaftarBerkasSudahDistribusi().subscribe(result => {
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
