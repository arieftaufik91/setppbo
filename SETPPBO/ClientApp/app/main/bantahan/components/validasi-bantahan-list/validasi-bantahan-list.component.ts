import { Component, OnInit, ViewChild } from '@angular/core';
import { BantahanService } from '../../services/bantahan.service';
import { Bantahan } from '../../models/bantahan';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { Router } from '@angular/router';
import { ValidasiBantahanFormComponent } from '../validasi-bantahan-form/validasi-bantahan-form.component';
import { BantahanDetailComponent } from '../bantahan-detail/bantahan-detail.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { 
  trigger,
  state,
  style,
  animate,
  transition
 } from '@angular/animations';
import { BantahanEditComponent } from '../bantahan-edit/bantahan-edit.component';

@Component({
  selector: 'app-validasi-bantahan-list',
  templateUrl: './validasi-bantahan-list.component.html',
  styleUrls: ['./validasi-bantahan-list.component.css'],
  providers: [BantahanService],
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
export class ValidasiBantahanListComponent implements OnInit {

   // default properties
   items: Bantahan[];
   tempItems: Bantahan[];
   item: Bantahan;
   isSaved: boolean = false;

   // ngx-datatable properties
  //columns: any[];
  selected: any[] = [];

  //animations properties
  state ="inactive";
  isVisible =false;


  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor( 
    private _service: BantahanService,
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
   * Ambil dari BantahanService.
   */
  prepareTableContent() {
    this._service.getAllDaftarBantahanValidasi().subscribe(result => {
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
validasiBantahan() {

  this.dialogsService
    .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Mem-validasi Data Surat Bantahan ini?")
    .subscribe(accept => {
      if (accept) {
        this._service.validasiBantahan(this.selected[0].PermohonanId, this.selected[0]).subscribe(result => {
          this.prepareTableContent();
          this.snackbarService.showSnackBar("Sukses", "Validasi Bantahan berhasil!");
      });
      }
    });
}


  showDetail(permohonanId: string) {
  let dialogRef = this.dialog.open(BantahanDetailComponent, {
    data: this.selected[0]
  });
  } 
  validasi(data: Bantahan){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selected[0];
    let dialogRef = this.dialog.open(ValidasiBantahanFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
          this.item = result;
          this._service.addBantahan(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbarService.showSnackBar("Sukses", "Validasi Bantahan berhasil!");
              this.isSaved = true;
          });
      }
    });
  }

  backToList(){
    this.isSaved = false;
  }

 onEditClick() {
    // console.log('edit selected', this.selected);
  let dialogRef = this.dialog.open(BantahanEditComponent, {
      data: this.selected[0]
  });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //this.item = result;
          this._service.addBantahan(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbarService.showSnackBar("Sukses", "Edit Bantahan berhasil!");
              //this.isSaved = true;
              //this.downloadlink = "http://localhost:42336/api/Bantahan/CetakTandaTerimaBantahan/" + this.item.PermohonanId;
          });  
      }
    });
  }
  
  isValidated(){
    if(this.selected[0]==null){
      return false;
    }else{
      this.item = this.selected[0];
      return this.item.TglValidasiBantahan!=null;
    }

  }
}

