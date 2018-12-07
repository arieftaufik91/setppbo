import { Component, OnInit, ViewChild } from '@angular/core';
import { RefPenandatangan } from '../../models/ref-penandatangan';
import { RefPenandatanganService } from '../../services/ref-penandatangan.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { RefPenandatanganFormComponent } from '../ref-penandatangan-form/ref-penandatangan-form.component';

@Component({
  selector: 'app-ref-penandatangan',
  templateUrl: './ref-penandatangan.component.html',
  styleUrls: ['./ref-penandatangan.component.css'],
  providers: [RefPenandatanganService]
})
export class RefPenandatanganComponent implements OnInit {

  items: RefPenandatangan[];
  tempItems: RefPenandatangan[];
  item: RefPenandatangan;

  columns: any[];
  selected: any[] = [];
  isSelected= true;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _service: RefPenandatanganService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService
  ) { }

  ngOnInit() {
    this.prepareTableContent();
    this.columns = [
      // { prop: "RefConfigId" },
      { prop: "Uraian" },
      { prop: "ConfigKey" }
    ];
  }

  prepareTableContent() {
    this._service.getAll().subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
    });
  }

  onSelect(event: any){
    if (event.selected[0] == null) {
      this.isSelected = true;
    } else {
      this.isSelected = false;
    }
  }

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

  onEditClick(){
    let dialogRef = this.dialog.open(RefPenandatanganFormComponent, {
      data: this.selected[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("quote dialog closed", result);
      if (result != null) {
        this._service.update(result).subscribe(result => {
          this.prepareTableContent();
          this.snackbar.showSnackBar("success", "Edit TTD berhasil!");
        });
      }
    });
  }
}
