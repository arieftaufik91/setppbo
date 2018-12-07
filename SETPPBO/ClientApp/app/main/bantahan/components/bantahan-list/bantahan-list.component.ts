import { Component, OnInit, ViewChild } from '@angular/core';
import { BantahanService } from '../../services/bantahan.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Bantahan } from '../../models/bantahan';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { BantahanFormComponent } from '../bantahan-form/bantahan-form.component';
import { BantahanDetailComponent } from '../bantahan-detail/bantahan-detail.component';
import { BantahanEditComponent } from '../bantahan-edit/bantahan-edit.component';
import { AdministrasiBandingGugatanService } from '../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service';
import { BantahanDownloadComponent } from '../bantahan-download/bantahan-download.component';
import { SharedDataService } from '../../../administrasi-banding-gugatan/services/shared-data.service';
import { Http } from '@angular/http';
// import { ReferensiTemplate } from '../../../referensi/models/referensi-template';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-bantahan-list',
  templateUrl: './bantahan-list.component.html',
  styleUrls: ['./bantahan-list.component.css'],
  providers: [BantahanService,ReferensiTemplateService],
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
export class BantahanListComponent implements OnInit {

  items: Bantahan[];
  tempItems: Bantahan[];
  item: Bantahan;
  isSaved: boolean = false;
  cetakk :any;
  downloadlink: string;
  downloadBaseUrl: string;
  cetaktandaterima  : string;
  isloading = false;

  // ngx-datatable properties
  // columns: any[];
  selected: any[] = [];
  filepathDoc: string;
filepathPdf: string;

  // animations properties
  state = "inactive";
  isVisible = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;
 
  constructor( 
    // private bantahanService: BantahanService,
    private dialog: MatDialog,
    private snackbarService: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
    private _sharedService: SharedDataService,
    private _service: BantahanService,
    private _refTemplateService: ReferensiTemplateService,
    private http: Http
    // private _refTemplateService: ReferensiTemplateService
    // private router: Router
  ) { }
  ngOnInit() {
    this.prepareTableContent();
    this._refTemplateService.checkTemplate(1013).subscribe(result =>{
      if(!result){
      }else{
      }
    });
  }

  /**
   * Function untuk menyiapkan isi tabel.
   * Ambil dari BantahanService.
   */
  prepareTableContent() {
    this._service.getDaftarBantahan().subscribe(result => {
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
    let dialogRef = this.dialog.open(BantahanDetailComponent, {
      data: this.selected[0]
    });
  }

  addBantahan(data: string){
    let dialogRef = this.dialog.open(BantahanFormComponent,{
    data: this.selected[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.item = result;
          this._service.addBantahan(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbarService.showSnackBar("Sukses", "Bantahan berhasil!");
              this.isSaved = true;
                this.downloadlink = this.downloadBaseUrl +"/api/Bantahan/CetakTandaTerimaBantahan/"+ this.item.PermohonanId;
                this.isloading =true;
          });  
      }
    });
  }

onDeleteClick() {

  this.dialogsService
    .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Menghapus Data Bantahan?")
    .subscribe(accept => {
      if (accept) {
        this._service.getBaseUrl().subscribe(result => {
          this.filepathDoc = result;
          this.filepathDoc = this.filepathDoc + "/api/DeleteFile/"  + this.selected[0].TahunMasuk + "." + this.selected[0].PemohonId + "." + this.selected[0].PermohonanId + ".Bantahan." + "/" + this.selected[0].FileDocBantahan;
        
          this.filepathPdf = result;
          this.filepathPdf = this.filepathPdf + "/api/DeleteFile/"  + this.selected[0].TahunMasuk + "." + this.selected[0].PemohonId + "." + this.selected[0].PermohonanId + ".Bantahan." + "/" + this.selected[0].FilePdfBantahan;                    
        });
        
        setTimeout(() => {
          return this.http.request(this.filepathDoc).subscribe(result => {
            this.http.request(this.filepathPdf).subscribe(result => {
              this._service.deleteBantahan(this.selected[0].PermohonanId, this.selected[0]).subscribe(result =>{
                this.snackbarService.showSnackBar("Sukses", "Hapus Data Bantahan berhasil!");
                this.prepareTableContent();
                this.selected = [];
              });
            })
          })

         

        }, 250);

       
     
      }
    });
}

  
  print(){
  if (this.item != null) {
    this._service.getBaseUrl().subscribe(result => {
      this.cetakk = result + "/api/Bantahan/CetakTandaTerimaBantahan/" +   this.item.PermohonanId;
    });
  } else {
    this._service.getBaseUrl().subscribe(result => {
      this.cetakk = result + "/api/Bantahan/CetakTandaTerimaBantahan/" +   this.selected[0].PermohonanId;
    });
  }
  setTimeout(() => {
    window.open(this.cetakk);
  }, 250);
}



  onEditClick(permohonanId: number) {
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

  backToList(){
    this.isSaved = false;
  }

  showDownload(permohonan: any) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    dialogConfig.data = {
      permohonan: this.selected[0],
    };
    let dialogRef = this.dialog.open(BantahanDownloadComponent, dialogConfig);
   
}

  cetak(){
    /*this._service.kirim(this.item).subscribe(result => {
    this.snackbarService.showSnackBar("Sukses", "Kirim Bantahan berhasil!");
    });*/
    this.snackbarService.showSnackBar("", "Tanda Terima akan diunduh, harap tunggu");
  }
}