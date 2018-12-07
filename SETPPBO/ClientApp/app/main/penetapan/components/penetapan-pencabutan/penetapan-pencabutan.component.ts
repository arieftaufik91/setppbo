import { Component, OnInit } from '@angular/core';
import { Penetapan } from "../../models/penetapan";
import { PenetapanService } from "../../services/penetapan.service";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { PenetepaanPencabutanEditTermohonComponent } from "../penetepaan-pencabutan-edit-termohon/penetepaan-pencabutan-edit-termohon.component";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: 'app-penetapan-pencabutan',
  templateUrl: './penetapan-pencabutan.component.html',
  styleUrls: ['./penetapan-pencabutan.component.css'],
  providers: [PenetapanService]
})
export class PenetapanPencabutanComponent implements OnInit {
  items: Penetapan[];
  tempItems: Penetapan[];
  item: Penetapan;
  cetak :string;
  noPenetapan: string;

  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];
  // animations properties
  state = "inactive";
  constructor(
    private _service: PenetapanService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.prepareTableContent();
    this.columns = [  
                      {prop:"NoPenetapan"}, 
                      {prop:"TglPenetapan"},
                      {prop:"NoSengketa"},
                      {prop:"Nama"},
                      {prop:"NamaTermohon"},
                      {prop:"NamaUpTermohon"},
                   ];
    this._service.getUrlCetak().subscribe(result => {
      this.cetak = result.ConfigValue
    })
  }

  print(){
    this._service.getBaseUrlCabut().subscribe(result => {
      this.noPenetapan = this.selected[0].NoPenetapan;
      // console.log(this.cetak);
      this.noPenetapan= this.noPenetapan.replace(new RegExp("/", 'g'), ".");
      this.cetak = result;
      this.cetak = this.cetak + this.noPenetapan;
    });
    setTimeout( () => {  
      window.open(this.cetak);                
    },250);
    

  }

  prepareTableContent() {
    this._service.getPenetapanPencabutan().subscribe(result => {
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
    // navigate to detail
    this.router.navigate(['/penetapanpencabutanadd']);
  }

  onEditClick() {
    this.noPenetapan = this.selected[0].NoPenetapan;
    console.log(this.noPenetapan);
    this.noPenetapan= this.noPenetapan.replace(new RegExp("/", 'g'), "");
    this.router.navigate(['/penetapanpencabutanedit', this.noPenetapan]);
  }

  onEditTermohonClick() {
    let dialogRef = this.dialog.open(PenetepaanPencabutanEditTermohonComponent, {
      data: this.selected[0]
    });
  }

  onDeleteClick() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus Penetapan?")
      .subscribe(accept => {
        if (accept) {
          this.noPenetapan = this.selected[0].NoPenetapan;
          this.noPenetapan= this.noPenetapan.replace(new RegExp("/", 'g'), ".");
          console.log(this.noPenetapan);
          let item = this.selected[0];
          this._service.deletePencabutan(this.noPenetapan).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Hapus Penetapan berhasil!");
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
   // this.table.offset = 0;
  }
  
}