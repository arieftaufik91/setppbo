import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTambahanSuratPengantar } from "../../models/data-tambahan-surat-pengantar";
import { DataTambahanService } from "../../services/data-tambahan.service";
import { DataTambahanFormComponent} from '../../components/data-tambahan-form/data-tambahan-form.component'; 
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import {DataServiceService} from "../../services/data-service.service";
import { DataTambahanDetailComponent } from '../data-tambahan-detail/data-tambahan-detail.component';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';


@Component({
  selector: 'app-data-tambahan-list',
  templateUrl: './data-tambahan-list.component.html',
  styleUrls: ['./data-tambahan-list.component.css'],
  providers: [DataTambahanService, DataServiceService,AdministrasiBandingGugatanService, ReferensiTemplateService]
})
export class DataTambahanListComponent implements OnInit {
  items: DataTambahanSuratPengantar[];
  tempItems: DataTambahanSuratPengantar[];
  item: DataTambahanSuratPengantar;
  mssage:string;
  suratPengantar:string;
  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];
  state = "inactive";
  isVisible = false;
  cetak:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _servicecetak : AdministrasiBandingGugatanService,
    private _service: DataTambahanService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
    private dataservice : DataServiceService,
    private _refTemplateService: ReferensiTemplateService

  ) { }

  ngOnInit() {
    this.mssage = this.dataservice.getUserData();
    this.prepareTableContent();
  }
  prepareTableContent() {
    const id: string = this.route.snapshot.params['id'];
    this._service.getDataTambahan(id)
      .subscribe(sengketa => this.items = sengketa);
    
  
  }
print(){

 
  this._servicecetak.getBaseUrl().subscribe(result => {
    this.cetak = result;
    this.cetak = this.cetak + "/api/datatambahan/cetaktt/" +  this.selected[0].SuratPengantarId;
  });
  setTimeout(() => {
    window.open(this.cetak);
  }, 250);

  
  
}


  showDetail(permohonan: any) {
      let dialogConfig = new MatDialogConfig();
      dialogConfig.width = '70%';
      dialogConfig.data = {
        permohonan: this.selected[0],
      };
      let dialogRef = this.dialog.open(DataTambahanDetailComponent, dialogConfig);
     
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
    const val = event.target.value.toLowerCase();
    const temp = this.filterByValue(this.tempItems, val);
    this.items = temp;
  }
onAddClick(){
  const id: string = this.route.snapshot.params['id'];
  this.router.navigate(['/datatambahanupload/', id]);
}

  onAddClick1() {
    let dialogRef = this.dialog.open(DataTambahanFormComponent, {
      data: this.selected[0]
    });
   dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
      this._service.add(result).subscribe(result => {
      this.prepareTableContent();
     this.snackbar.showSnackBar();
     });
     }
    });
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


  onDeleteClick() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus Surat Pengantar?")
      .subscribe(accept => {
        if (accept) {
          this.suratPengantar = this.selected[0].SuratPengantarId;
         
        
          let item = this.selected[0];
          this._service.delete(this.suratPengantar).subscribe(
           result => {
             this.prepareTableContent();
             this.snackbar.showSnackBar("success", "Hapus Surat Pengantar berhasil!");
            },
           error => {},
            () => {}
          );
        }
      });
  }

}
