import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTambahanPermohonan } from "../../models/data-tamabahan-permohonan";
import { DataTambahanService } from "../../services/data-tambahan.service";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { DataServiceService } from "../../services/data-service.service";

@Component({
  selector: 'app-data-tambahan-permohonan',
  templateUrl: './data-tambahan-permohonan.component.html',
  styleUrls: ['./data-tambahan-permohonan.component.css'],
  providers : [DataTambahanService, DataServiceService ]
})
export class DataTambahanPermohonanComponent implements OnInit {
  items       : DataTambahanPermohonan[];
  tempItems   : DataTambahanPermohonan[];
  item        : DataTambahanPermohonan;
  message     : string ="Tes Service";
  
  columns     : any[];
  selected    : any[] = [];
  state = "inactive";
  isVisible = false;

  offset          : number = 0;
  limit           : number = 10;
  count           : number = 0;
  search          : string = '';

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private router: Router,
    private _service: DataTambahanService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
    public data: DataServiceService
  ) { }

  ngOnInit() {
    this.data.changeMessage("tes");
    this.data.currentMessage.subscribe(message => this.message = message)
    this.prepareTableContent();
  
  }
  prepareTableContent() {
    let data = { Limit: this.limit, Offset: this.offset, Search: this.search };
    this._service.getByPaging(data).subscribe(result => {
        this.items = result.Data;
        this.tempItems = [...result.Data];
        this.count = result.Count;
    });
  }

  showDetail(PermohonanId: string) {
    this.data.changeMessage(PermohonanId);
    this.router.navigate(['/datatambahan', this.selected[0].PermohonanId]);
    this.data.setUserData("tes service");
  }

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

  onSelect(event: any) {
    // console.log("Selected: ", event.selected[0].QuoteId);
    if (event.selected[0] == null) {
      this.deactivateState();
    } else {
      this.activateState();
    }
  }
 /**
   * Method untuk unselect pilihan baris di tabel.
   * @param row 
   */
  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  /* ANIMATIONS EVENT */
  toggleState() {
    this.state = this.state === "active" ? "inactive" : "active";
  }

  activateState() {
    this.state = "active";
    this.isVisible = true;
  }

  deactivateState() {
    this.state = "inactive";
    this.isVisible = false;
  }

}

