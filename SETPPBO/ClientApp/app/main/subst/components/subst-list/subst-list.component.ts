import { Component, OnInit, ViewChild } from '@angular/core';
import { SubstService } from "../../services/subst.service";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { Subst } from "../../models/subst";
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { SubstFormComponent } from "../subst-form/subst-form.component";
import { SubstViewComponent } from "../subst-view/subst-view.component";
import { SubstValidasiComponent } from "../subst-validasi/subst-validasi.component";
import { debounce } from 'rxjs/operator/debounce';
import { SubstDetailComponent } from '../subst-detail/subst-detail.component';
import { Http } from '@angular/http';
import { SubstEditComponent } from '../subst-edit/subst-edit.component';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';

@Pipe({
  name: 'dateFormat'
})

@Component({
  selector: 'app-subst-list',
  templateUrl: './subst-list.component.html',
  styleUrls: ['./subst-list.component.css'],
  providers: [SubstService, ReferensiTemplateService],
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
export class SubstListComponent implements OnInit {

// default properties
items: Subst[];
tempItems: Subst[];
item: Subst;
isSaved: boolean = false;
link: any;
// ngx-datatable properties
columns: any[];
selected: any[] = [];
filepathDoc: string;
filepathPdf: string;

// animations properties
state = "inactive";

@ViewChild(DatatableComponent) table: DatatableComponent;

constructor(
  private _service: SubstService,
  private _refTemplateService: ReferensiTemplateService,
  private dialog: MatDialog,
  private snackbar: PuiSnackbarService,
  private dialogsService: PuiConfirmDialogService,
  private http: Http  
) {}

ngOnInit() {
  this.prepareTableContent();
  this._refTemplateService.checkTemplate(6).subscribe(result =>{
    if(!result){
    }else{
    }
  });
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

onEditClick(permohonanId: number) {
  // console.log('edit selected', this.selected);
  let dialogRef = this.dialog.open(SubstFormComponent, {
      //data: permohonanId,
      data: this.selected[0]
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
          this._service.update(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Edit SubSt berhasil!");
          });
      }
  });
}

addSubSt(data: string) {
  
  let dialogRef = this.dialog.open(SubstFormComponent, {
      data: this.selected[0]
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this.item = result;
      this._service.addSubSt(result.PermohonanId, result).subscribe(result => {
          this.prepareTableContent();
          this.snackbar.showSnackBar("Sukses", "Rekam SUB/ST berhasil!");
          this.isSaved = true;
      });  
    }
  });
}

print(){
  if (this.item != null) {
    this._service.getBaseUrl().subscribe(result => {
      this.link = result + "/api/SubSt/CetakTandaTerimaSubSt/" +   this.item.PermohonanId;
    });
  } else {
    this._service.getBaseUrl().subscribe(result => {
      this.link = result + "/api/SubSt/CetakTandaTerimaSubSt/" +   this.selected[0].PermohonanId;
    });
  }
  
  setTimeout(() => {
    window.open(this.link);
  }, 250);
}

backToList(){
  this.isSaved = false;
}

detailSubSt() {
  // console.log('edit selected', this.selected);
  let dialogRef = this.dialog.open(SubstDetailComponent, {
      data: this.selected[0]
  });
}

onDeleteClick() {

  this.dialogsService
    .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Menghapus Data SUB/ST?")
    .subscribe(accept => {
      if (accept) {
        this._service.getBaseUrl().subscribe(result => {
          this.filepathDoc = result;
          this.filepathDoc = this.filepathDoc + "/api/DeleteFile/"  + this.selected[0].TahunMasuk + "." + this.selected[0].PemohonId + "." + this.selected[0].PermohonanId + ".SubSt." + "/" + this.selected[0].FileDocSubSt;
        
          this.filepathPdf = result;
          this.filepathPdf = this.filepathPdf + "/api/DeleteFile/"  + this.selected[0].TahunMasuk + "." + this.selected[0].PemohonId + "." + this.selected[0].PermohonanId + ".SubSt." + "/" + this.selected[0].FilePdfSubSt;                    
        });
        
        setTimeout(() => {
          return this.http.request(this.filepathDoc).subscribe(result => {
            this.http.request(this.filepathPdf).subscribe(result => {
              this._service.deleteSubSt(this.selected[0].PermohonanId, this.selected[0]).subscribe(result =>{
                this.snackbar.showSnackBar("Sukses", "Hapus Data SUB/ST berhasil!");
                this.prepareTableContent();
                this.selected = [];
              });
            })
          })

         

        }, 250);

       
     
      }
    });
}

editSubSt() {
  // console.log('edit selected', this.selected);
  let dialogRef = this.dialog.open(SubstEditComponent, {
      data: this.selected[0]
  });

  dialogRef.afterClosed().subscribe(result => {
      //console.log("quote dialog closed", result);
      if (result != null) {
          this._service.updateSubSt(result.PermohonanId, result).subscribe(result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("Sukses", "Update SUB/ST berhasil!");
          });
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
 