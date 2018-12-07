import { Component, OnInit, ViewChild } from '@angular/core';
import { PencabutanService } from '../../services/pencabutan.service';
import { Pencabutan } from '../../models/pencabutan';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PencabutanDetailComponent } from '../pencabutan-detail/pencabutan-detail.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { PencabutanFormComponent } from '../pencabutan-form/pencabutan-form.component';
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { ReferensiTemplate } from '../../../referensi/models/referensi-template';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";
import { PencabutanEditComponent } from '../pencabutan-edit/pencabutan-edit.component';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-pencabutan-list',
  templateUrl: './pencabutan-list.component.html',
  styleUrls: ['./pencabutan-list.component.css'],
  providers: [PencabutanService, ReferensiTemplateService, AdministrasiBandingGugatanService],
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
export class PencabutanListComponent implements OnInit {

  items             : Pencabutan[];
  tempItems         : Pencabutan[];
  item              : Pencabutan;
  isSaved           : boolean = false;
  downloadlink      : string;
  cetaktandaterima  : string;
  PermohonanId      : string;
  file              : any;
  filepath          : any;
  detelefile        : any;

  selected: any[] = [];

  state = "inactive";
  isVisible = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _servicecetak : AdministrasiBandingGugatanService,
    private _service: PencabutanService,
    private _refTemplateService: ReferensiTemplateService,
    private dialog: MatDialog,
    private dialogsService: PuiConfirmDialogService,
    private snackbarService: PuiSnackbarService,
    private http: Http
  ) { }

  ngOnInit() {
    this.prepareTableContent();
    
  }


  /**
   * Function untuk menyiapkan isi tabel.
   * Ambil dari PencabutanService.
   */
  prepareTableContent() {
    this._service.getAllDaftarPermohonan().subscribe(result => {
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

  showDetail() {
     let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    let dialogRef = this.dialog.open(PencabutanDetailComponent, {
      data: this.selected[0]
    });
  }

  onDeleteClick() {
    this._service.getDetailPermohonan(this.selected[0].PermohonanId)
      .subscribe(result => {
        this.file = result.FilePencabutan;
      });

      this._service.getDetailPencabutan(this.selected[0].PermohonanId).subscribe(result => {
        this.filepath = result.path;
        console.log(this.filepath);
      
      });
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus Pencabutan?")
      .subscribe(accept => {
        if (accept) {
          this.PermohonanId = this.selected[0].PermohonanId;
          this._servicecetak.getBaseUrl().subscribe(result => {
            this.detelefile = result;
            this.detelefile = this.detelefile + "/api/DeleteFile/"  + this.filepath + "/" + this.file;
          });
          
          setTimeout(() => {
            console.log(this.detelefile);
            return this.http.request(this.detelefile).subscribe(result => {
              this._service.deletePencabutan(this.selected[0]).subscribe(result =>{
                this.snackbarService.showSnackBar("success", "Hapus Pencabutan berhasil!");
                this.prepareTableContent();
              });
            })

           

          }, 250);

         
       
        }
      });
  }

  addPencabutan(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.data = this.selected[0];
    let dialogRef = this.dialog.open(PencabutanFormComponent, dialogConfig);
    this._servicecetak.getBaseUrl().subscribe(result => {
      this.cetaktandaterima = result;
      
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != null) {
        this.item = result;
        console.log(result);
          this._service.addPencabutan(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbarService.showSnackBar("success", "Pencabutan berhasil!");
              this.isSaved = true;
              this._servicecetak.getBaseUrl().subscribe(result => {
                this.cetaktandaterima = result;
                this.downloadlink = this.cetaktandaterima + "/api/Pencabutan/CetakTandaTerimaPencabutan/" + this.selected[0].PermohonanId;
              });
        
             
              // fungsi cek kesamaan template lokal dengan server, kalau beda: otomatis download
              // kalau download template baru gagal, muncul snackbar, template lama (lokal) yang dipakai
              // parameter checkTemplate: RefTemplateId dari template yang dipakai (4: TandaTerimaPencabutan)
              this._refTemplateService.checkTemplate(4).subscribe(result =>{
                if(!result){
                  this.snackbarService.showSnackBar("error", "Gagal update template, fungsi cetak menggunakan template lama");
                }else{
                  console.log("Sukses");
                }
              });
          });
          
      }
    });
  }

  editPencabutan(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.data = this.selected[0];
    let dialogRef = this.dialog.open(PencabutanEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.item = result;
          this._service.addPencabutan(result).subscribe(result => {
              this.prepareTableContent();
              this.snackbarService.showSnackBar("success", "Edit Pencabutan berhasil!");
          });
      }
    });
  }

  backToList(){
    this.isSaved = false;
  }
    
  cetak(){
    //console.log(this.item.Nama+"/"+this.item.PermohonanId+"/"+this.item.FilePencabutan);
    this.snackbarService.showSnackBar("", "Tanda Terima akan diunduh, harap tunggu");
  }

  print(){
    this._servicecetak.getBaseUrl().subscribe(result => {
        this.cetaktandaterima = result;
        this.cetaktandaterima = this.cetaktandaterima + "/api/Pencabutan/CetakTandaTerimaPencabutan/" + this.selected[0].PermohonanId;
    });

    setTimeout(() => {
      window.open(this.cetaktandaterima);
    }, 250);
    
   
  }

  fetch() {
    
  }

}
