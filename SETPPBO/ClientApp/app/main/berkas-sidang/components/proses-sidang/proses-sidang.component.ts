import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProsesSidang } from "../../models/proses-sidang";
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { ProsesSidangService } from "../../services/proses-sidang/proses-sidang.service";

@Component({
  selector: 'app-proses-sidang',
  templateUrl: './proses-sidang.component.html',
  styleUrls: ['./proses-sidang.component.css'],
  providers: [ProsesSidangService]
})
export class ProsesSidangComponent implements OnInit {

  // default properties
  items: ProsesSidang[];
  tempItems: ProsesSidang[];
  item: ProsesSidang;

  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tglSidangTerakhir') public tglSidangTerakhir: TemplateRef<any>;

  constructor(
    private _service: ProsesSidangService
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
      { prop: "TglDistribusiBerkas", name: "Sidang Terakhir", cellTemplate: this.tglSidangTerakhir },
      { prop: "SidangBerikutnya", name: "Sidang Berikutnya" },
      { prop: "SidangKe", name: "Sidang Ke-" },
      { prop: "Status", name: "Status" }
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

  onSelect(event: any) {
    // console.log("Selected: ", event.selected[0].QuoteId);
    if (event.selected[0] == null) {
      
    } else {
      
    }
    // navigate to detail
    //this.router.navigate(['/sample', event.selected[0].QuoteId]);
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
