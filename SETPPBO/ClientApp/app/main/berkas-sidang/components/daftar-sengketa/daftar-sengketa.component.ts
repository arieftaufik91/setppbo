import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { DaftarSengketa } from "../../models/daftarSengketa";
import { BerkasSidangService } from "../../services/berkas-sidang.service";

@Component({
  selector: 'app-daftar-sengketa',
  templateUrl: './daftar-sengketa.component.html',
  styleUrls: ['./daftar-sengketa.component.css'],
  providers: [BerkasSidangService]
})
export class DaftarSengketaComponent implements OnInit {

  // default properties
  items: DaftarSengketa[];
  tempItems: DaftarSengketa[];
  item: DaftarSengketa;

  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _service: BerkasSidangService
  ) { 
    
  }

  ngOnInit() {
    this.prepareTableContent();

    // set datatable.column
    // specify column
    this.columns = [
      { prop: "NoSuratPermohonan", name: "No. Surat Banding" },
      { prop: "NoSengketa", name: "No. Sengketa" },
      { prop: "Nama", name: "Nama Pemohon" },
      { prop: "NoSubSt", name: "No. SUB/Tanggapan" },
      { prop: "NoSuratBantahan", name: "No. Bantahan" },
      { prop: "Uraian", name: "Status" }
    ];
  }

  /**
   * Function untuk menyiapkan isi tabel.
   * Ambil dari SampleService.
   */
  prepareTableContent() {
    this._service.getAllDaftarSengketa().subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
    });
  }

  /**
   * Method untuk unselect pilihan baris di tabel.
   * @param row 
   */
  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
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
