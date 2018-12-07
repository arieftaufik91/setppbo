import { Component, OnInit, ViewChild } from '@angular/core';
import { PencabutanService } from '../../services/pencabutan.service';
import { Pencabutan } from '../../models/pencabutan';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { Router } from '@angular/router';
import { PencabutanDetailComponent } from '../pencabutan-detail/pencabutan-detail.component';
import { ValidasiPencabutanFormComponent } from '../validasi-pencabutan-form/validasi-pencabutan-form.component';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: 'app-validasi-pencabutan-list',
  templateUrl: './validasi-pencabutan-list.component.html',
  styleUrls: ['./validasi-pencabutan-list.component.css'],
  providers: [PencabutanService],
  animations: [
    trigger("myState", [
      state(
        "inactive",
        style({
          transform: "translate3d(0,0,0)",
          left: "-50px",
          opacity: 0
        })
      ),
      state(
        "active",
        style({
          transform: "translate3d(10px,0,0)",
          opacity: 1
        })
      ),
      transition("inactive => active", animate("300ms ease-in")),
      transition("active => inactive", animate("300ms ease-out"))
    ])
  ]
})
export class ValidasiPencabutanListComponent implements OnInit {

  // default properties
  items: Pencabutan[];
  tempItems: Pencabutan[];
  item: Pencabutan;
  isSaved: boolean = false;

  // ngx-datatable properties
  //columns: any[];
  selected: any[] = [];

  // animations properties
  state = "inactive";
  isVisible = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private _service: PencabutanService,
    private dialog: MatDialog,
    private dialogsService: PuiConfirmDialogService,
    private snackbarService: PuiSnackbarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prepareTableContent();
  }

  /**
   * Function untuk menyiapkan isi tabel.
   * Ambil dari PencabutanService.
   */
  prepareTableContent() {
    this._service.getAllDaftarPermohonanForValidasi().subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
    });
  }

  /* SCRIPT EVENT */
  /**
   * Function ketika baris di dalam tabel diklik.
   * Digunakan untuk aktivasi / deaktivasi toolbar
   * @param event 
   */
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

  showDetail(permohonanId: string) {
    let dialogRef = this.dialog.open(PencabutanDetailComponent, {
      data: this.selected[0]
    });
  }

  validasiPencabutan(data: Pencabutan){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selected[0];
    let dialogRef = this.dialog.open(ValidasiPencabutanFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
          this.item = result;
          this._service.addPencabutan(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbarService.showSnackBar("Sukses", "Validasi berhasil!");
              this.isSaved = true;
          });
      }
    });
  }

  backToList(){
    this.isSaved = false;
  }

  isValidated(){
    if(this.selected[0]==null){
      return false;
    }else{
      this.item = this.selected[0];
      return this.item.TglValidasiPencabutan!=null;
    }
  }
}
