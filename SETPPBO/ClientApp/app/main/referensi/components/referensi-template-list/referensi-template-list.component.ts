import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ReferensiTemplate } from '../../models/referensi-template';
import { ReferensiTemplateService } from '../../services/referensi-template.service';
import { ReferensiTemplateFormComponent } from '../referensi-template-form/referensi-template-form.component';

@Component({
  selector: 'app-referensi-template-list',
  templateUrl: './referensi-template-list.component.html',
  styleUrls: ['./referensi-template-list.component.css'],
  providers: [ReferensiTemplateService],
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
export class ReferensiTemplateListComponent implements OnInit {

  items: ReferensiTemplate[];
  tempItems: ReferensiTemplate[];
  item: ReferensiTemplate;

  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];

  // animations properties
  state = "inactive";
  isVisible = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  constructor(
    private _service: ReferensiTemplateService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
  ) { }

  ngOnInit() {
    this.prepareTableContent();

    // set datatable.column
    // specify column
    this.columns = [
      { prop: "RefTemplateId", name: "No. ID" },
      { prop: "Uraian", name: "Uraian" },
      { prop: "FileId", name: "File ID"},
      { prop: "JenisFile", name: "Jenis File"},
      { prop: "Status", name: "Status" }
    ]
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

    /* SCRIPT EVENT */
  /**
   * Function ketika baris di dalam tabel diklik.
   * Digunakan untuk aktivasi / deaktivasi toolbar
   * @param event 
   */
  onSelect(event: any) {
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

  /**
   * 
   */
  onAddClick() {
    // add new quote
    //dialog form
    let dialogRef = this.dialog.open(ReferensiTemplateFormComponent, {
      data: {
        items: this.items,
        item: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this._service.add(result).subscribe(result => {
        this.prepareTableContent();
        this.snackbar.showSnackBar("success", "Tambah Referensi berhasil!");
      });
     }
    });
  }

  onEditClick() {
    let dialogRef = this.dialog.open(ReferensiTemplateFormComponent, {
      data: {
        items: this.items,
        item: this.selected[0]
      }
    });
    var oldFileName = this.selected[0].FileId;
    console.log(oldFileName);
   dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this._service.update(result, oldFileName).subscribe(result => {
          this.prepareTableContent();
          this.snackbar.showSnackBar("success", "Edit Referensi berhasil!");
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
          this._service.delete(this.selected[0].RefTemplateId).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Hapus Referensi berhasil!");
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
}
