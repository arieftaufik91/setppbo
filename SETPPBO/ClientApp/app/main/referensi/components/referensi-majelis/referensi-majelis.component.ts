import { Component, OnInit,ViewChild } from '@angular/core';
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
import { ReferensimajelisService } from '../../services/referensi-majelis.service';
import { ReferensiMajelis } from '../../models/referensi-majelis';
import { ReferensiMajelisformComponent } from '../referensi-majelisform/referensi-majelisform.component';

@Component({
  selector: 'app-referensi-majelis',
  templateUrl: './referensi-majelis.component.html',
  styleUrls: ['./referensi-majelis.component.css'],
  providers: [ReferensimajelisService],
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
    ]),
    trigger("myRotation", [
      state(
        "inactive",
        style({
          // rotate left
          transform: "rotate(-90deg)"
        })
      ),
      state(
        "active",
        style({
          transform: "rotate(90deg)"
        })
      ),
      transition("inactive => active", animate("300ms ease-in")),
      transition("active => inactive", animate("300ms ease-out"))
    ])
  ]
})
export class ReferensiMajelisComponent implements OnInit {
  items: ReferensiMajelis[];
  tempItems: ReferensiMajelis[];
  item: ReferensiMajelis;

   // ngx-datatable properties
   columns: any[];
   selected: any[] = [];
 
   // animations properties
   state = "inactive";
   
   @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private refmajelisService: ReferensimajelisService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
    private _service: ReferensimajelisService
  ) { }

  ngOnInit() {
    this.prepareTableContent();


    this.columns = [{prop: "RefMajelisId"}, 
                    {prop: "Kode"},
                    {prop: "Majelis"},
                    {prop: "Harsinom"},
                    {prop: "HakimKetuaId"},
                    {prop: "NamaHakimKetua"},
                    {prop: "NiphakimKetua"},
                    {prop: "HakimAnggota1Id"},
                    {prop: "NamaHakimAnggota1"},
                    {prop: "NiphakimAnggota1"},
                    {prop: "HakimAnggota2Id"},
                    {prop: "NamaHakimAnggota2"},
                    {prop: "NiphakimAnggota2"},
                    {prop: "Spid"},
                    {prop: "NamaSp"},
                    {prop: "Nipsp"},
                    {prop: "Psp1id"},
                    {prop: "Psp2id"},
                    {prop: "RefJenisKasusId"},
                    {prop: "TotalBerkas"}];

  /**
   * Function untuk menyiapkan isi tabel.
   * Ambil dari SampleService.
   */
  }
  prepareTableContent() {
    this._service.getAll().subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
    });
  }

  /*
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
    // navigate to detail
    //this.router.navigate(['/sample', event.selected[0].QuoteId]);
  }

  /**
   * Method untuk unselect pilihan baris di tabel.
   * @param row 
   */
  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }
  /**
   * 
   */
  onAddClick() {
    // add new quote
    //dialog form
    let dialogRef = this.dialog.open(ReferensiMajelisformComponent, {});

   dialogRef.afterClosed().subscribe(result => {
  // console.log("quote dialog closed", result);
      if (result != null) {
      this._service.add(result).subscribe(result => {
      this.prepareTableContent();
     this.snackbar.showSnackBar();
     });
     }
    });
  }

  onEditClick() {
    // console.log('edit selected', this.selected);
    let dialogRef = this.dialog.open(ReferensiMajelisformComponent, {
      data: this.selected[0]
    });

   dialogRef.afterClosed().subscribe(result => {
      //console.log("quote dialog closed", result);
      if (result != null) {
        this._service.update(result).subscribe(result => {
          this.prepareTableContent();
          this.snackbar.showSnackBar("success", "Edit referensi majelis berhasil!");
       });
      }
    });
  }

  onDeleteClick() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus referensi?")
      .subscribe(accept => {
        if (accept) {
          console.log(this.selected[0]);
          let item = this.selected[0];
          this._service.delete(this.selected[0].RefMajelisId).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Hapus referensi majelis berhasil!");
            },
            error => {},
            () => {}
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
   this.table.offset = 0;
}
}
