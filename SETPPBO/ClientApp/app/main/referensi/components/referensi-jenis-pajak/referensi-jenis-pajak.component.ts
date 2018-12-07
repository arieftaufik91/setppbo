import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferensiJenisPajakService } from '../../services/referensi-jenis-pajak.service'
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ReferensiJenisPajakFormComponent } from '../referensi-jenis-pajak-form/referensi-jenis-pajak-form.component'
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { ReferensiJenisPajak } from '../../models/referensi-jenis-pajak';

@Component({
    selector: 'app-referensi-jenis-pajak',
    templateUrl: './referensi-jenis-pajak.component.html',
    styleUrls: ['./referensi-jenis-pajak.component.css'],
    providers: [ReferensiJenisPajakService]
})
export class ReferensiJenisPajakComponent implements OnInit {
  items       : ReferensiJenisPajak[];
  tempItems   : ReferensiJenisPajak[];
  item        : ReferensiJenisPajak;
  columns     : any[];
  selected    : any[] = [];
  state       = "inactive";
  selectedclear : boolean = false;
  itemLimit = 10;
  

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _service      : ReferensiJenisPajakService,
    private dialog        : MatDialog,
    private snackbar      : PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService
  ) { }

  ngOnInit() {
    this.prepareTableContent();
    this.columns = [
      { prop: "RefJenisPajakId" },
      { prop: "Uraian" },
      { prop: "UraianSingkat" },
      { prop: "Kode" },
      { prop: "RefJenisKasus.Uraian" },
      { prop: "IsPph" }
    ];
  }


  prepareTableContent() {
    this._service.getAll().subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
    });
  }


  /**
   * @param event 
   */
  onSelect(event: any) {
    console.log(this.selected[0]);
    if (event.selected[0] == null) {
      this.deactivateState();
    } else {
      this.activateState();
    }
  }

  
  /**
   * @param event 
   */
  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  
  /**
   * @param event 
   */
  addJenisPajak() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    
    let dialogRef = this.dialog.open(ReferensiJenisPajakFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log("quote dialog closed", result);
        this._service.add(result).subscribe(result => {
         // this.prepareTableContent();
          this.snackbar.showSnackBar();
        });
      }
    });
  }

  
  /**
   * @param event 
   */
  editJenisPajak() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.data = this.selected[0];
    let dialogRef = this.dialog.open(ReferensiJenisPajakFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._service.update(result).subscribe(result => {
          this.prepareTableContent();
          this.snackbar.showSnackBar("success", "Edit Jenis Pajak berhasil!");
          this.deactivateState();
          this.selected = [];
        });
      }
    });
  }

  deleteJenisPajak() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus Jenis Pajak?")
      .subscribe(accept => {
        if (accept) {
          let item = this.selected[0];
          this._service.delete(this.selected[0].RefAlasanId).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Hapus Alasan berhasil!");
            },
            error => { },
            () => { }
          );
        }
      });
  }

  /* ANIMATIONS EVENT */
  toggleState() {
    this.state = this.state === "active" ? "inactive" : "active";
  }

  activateState() {
    this.state = "active";
  }

  deactivateState() {
    this.state = "inactive";
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
    // this.table.offset = 0;
  }
}



