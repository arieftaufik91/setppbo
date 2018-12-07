import { Component, OnInit, ViewChild } from "@angular/core";
import { Quote } from "../../models/quote";
import { SampleService } from "../../services/sample.service";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";
import { QuoteFormComponent } from "../quote-form/quote-form.component";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: "main-sample",
  templateUrl: "./sample.component.html",
  styleUrls: ["./sample.component.css"],
  providers: [SampleService],
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
  
export class SampleComponent implements OnInit {
  // default properties
  items: Quote[];
  tempItems: Quote[];
  item: Quote;

  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];

  // animations properties
  state = "inactive";

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _service: SampleService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService
  ) {}

  ngOnInit() {
    this.prepareTableContent();

    // set datatable.column
    // specify column
    this.columns = [{ prop: "Quote" }];
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
    // dialog form
    let dialogRef = this.dialog.open(QuoteFormComponent, {});

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
    let dialogRef = this.dialog.open(QuoteFormComponent, {
      data: this.selected[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("quote dialog closed", result);
      if (result != null) {
        this._service.update(result).subscribe(result => {
          this.prepareTableContent();
          this.snackbar.showSnackBar("success", "Edit Quote berhasil!");
        });
      }
    });
  }

  onDeleteClick() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus quote?")
      .subscribe(accept => {
        if (accept) {
          let item = this.selected[0];
          this._service.delete(item).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Hapus quote berhasil!");
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
