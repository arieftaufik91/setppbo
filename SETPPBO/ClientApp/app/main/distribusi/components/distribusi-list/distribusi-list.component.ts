import { Component, OnInit, ViewChild } from '@angular/core';
import { DistribusiService } from '../../services/distribusi.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { WingToolbarComponent } from '../../../../shared/wing/components/wing-toolbar/wing-toolbar.component';

@Component({
  selector: 'app-distribusi-list',
  templateUrl: './distribusi-list.component.html',
  styleUrls: ['./distribusi-list.component.css'],
  providers: [DistribusiService]
})
export class DistribusiListComponent implements OnInit {

  rows: any[];
  tempRows: any[];
  selected: any[] = [];
  state: string = "inactive";

  // Pagination & Search Variable
  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  search: string = '';
  @ViewChild(WingToolbarComponent) wingToolbar: WingToolbarComponent;

  @ViewChild(DatatableComponent) table: DatatableComponent;  

  constructor(
    private _service: DistribusiService,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService
  ) { }

  ngOnInit() {
    this.prepareTableContent();
  }

  prepareTableContent() {
    /*this._service.getBerkasSiapSidang().subscribe(result => {
      this.rows = result;
      this.tempRows = [...result];
    });*/
    let data = { Limit: this.limit, Offset: this.offset, Search: this.search };
    this._service.getBerkasSiapSidangServerSide(data).subscribe(result => {
        this.rows = result.Data;
        this.tempRows = [...result.Data];
        this.count = result.Count;
        this.selected = [];
    });
  }

  /*onSelect( event: any ) {
    this.selected = event.selected;
    this.distributed = [];
    this.selected.forEach(item => {
      this.distributed.push(item.PermohonanId)
    })
  }*/

  selectAll() {
    this.selected = [...this.rows]
  }

  deselectAll() {
    this.selected = []
  }

  /*submitDocument() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Melakukan Distribusi Berkas?")
      .subscribe(accept => {
        if (accept) {
          this._service.prosesDistribusi(this.distributed).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Distribusi Berkas Berhasil!");
            },
            error => {},
            () => {}
          );
        }
      });
  }*/

  submitDocument() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Melakukan Distribusi Berkas?")
      .subscribe(accept => {
        if (accept) {
          this._service.prosesDistribusi(this.selected).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Distribusi Berkas Berhasil!");
              this.selected = [];
            },
            error => {},
            () => {}
          );
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
