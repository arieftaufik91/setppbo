import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { AdministrasiBandingGugatanService } from "../../services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";
import { AdministrasiBandingGugatan } from "../../models/administrasi-banding-gugatan/administrasi-banding-gugatan";
import { PermintaanBantahanService } from "../../services/permintaan-bantahan/permintaan-bantahan.service";
import { PermintaanBantahan } from "../../models/permintaan-bantahan/permintaan-bantahan";
import { PermintaanBantahanComponent } from "../permintaan-bantahan/permintaan-bantahan.component";
import { SharedDataService } from '../../services/shared-data.service';
import { WingToolbarComponent } from '../../../../shared/wing/components/wing-toolbar/wing-toolbar.component';

@Component({
  selector: 'app-administrasi-banding-gugatan',
  templateUrl: './administrasi-banding-gugatan.component.html',
  styleUrls: ['./administrasi-banding-gugatan.component.css'],
  providers: [AdministrasiBandingGugatanService,PermintaanBantahanService]
})
export class AdministrasiBandingGugatanComponent implements OnInit {

  items: AdministrasiBandingGugatan[];
  tempItems: AdministrasiBandingGugatan[];
  item: AdministrasiBandingGugatan;
  itemsMbantah: PermintaanBantahan[];
  tempItemsMbantah: PermintaanBantahan[];
  itemMbantah: PermintaanBantahan;
  colABG: any[];
  colMbantah: any[];
  selected: any[] = [];
  showSearch: boolean;
  state     : string;

  @Input() tipe: number = 1;
  @ViewChild(DatatableComponent) table: DatatableComponent;  
  @ViewChild(WingToolbarComponent) wingToolbar: WingToolbarComponent;

  constructor(
    private abgService         : AdministrasiBandingGugatanService,
    private mintaBantahService : PermintaanBantahanService,
    private dialog             : MatDialog,
    private snackbar           : PuiSnackbarService,
    private dialogService      : PuiConfirmDialogService,
    private router             : Router,
    private _sharedService     : SharedDataService
  ) { }

  ngOnInit() {
    
    this.abgService.getBaseUrl().subscribe(result => {
      this._sharedService.setURL(result);
      //this._sharedService.setURL("http://localhost:42336"); // dev purpose
      //this._sharedService.setURL(result); // use this for published
    });
    this.abgService.getRefTtd().subscribe(result =>{
      this._sharedService.setRefTtd(result);
    });
    this.prepareABG();
    
  }

  prepareABG() {
    // getbyid 1: Banding, 2:Gugatan  ==> perlu dijadikan parameter agar component-nya reusable
    this.abgService.getById(this.tipe+"").subscribe(result => {
      this.items = result;
      this.tempItems = [...result];
      
    });

    this.colABG = [
      { prop: "Nama", name: "Pemohon" },
      { prop: "NoSengketa", name: "No Sengketa" },
      { prop: "NoTandaTerimaSubSt", name: "Tanda Terima" },
      { prop: "NoSuratPermintaanSubSt", name: "Permintaan SUB/Tanggapan" },
      { prop: "NoSubSt", name: "SUB/Tanggapan" },
      { prop: "NoSuratPermintaanBantahan", name: "Permintaan Bantahan" },
      { prop: "NoSuratBantahan", name: "Surat Bantahan" },
      { prop: "NoSuratPermintaanSalinan", name: "Salinan Bantahan" },
      { prop: "JenisPemeriksaan", name:"Jenis Pemeriksaan"},
      { prop: "PembagianBerkas", name:"Subbagian"}
    ];
  }

  prepareMintaBantah() {
    this.mintaBantahService.getById().subscribe(result => {
      this.itemsMbantah = result;
      this.tempItemsMbantah = [...result];
    });

    this.colMbantah = [
      { prop: "NoSengketa", name: "Nomor Sengketa" },
      { prop: "NoSuratPermintaanBantahan", name: "No. Permintaan Bantahan" },
      { prop: "TglSuratPermintaanBantahan", name: "Tanggal Surat" },
      { prop: "RefTtdPermintaanBantahanId", name: "Penandatangan" },
      { prop: "Nama", name: "Pemohon" },
      { prop: "Alamat", name: "Alamat" },
      // { prop: "RefKotaId", name: "Salinan Bantahan" },
      { prop: "Kota", name: "Kota" },
      { prop: "KodePos", name: "Kode Pos" },
      { prop: "NoSubSt", name: "Nomor SUB/Tanggapan" },
      { prop: "TglSubSt", name: "Tanggal SUB/Tanggapan" },
      { prop: "NoSuratPermohonan", name: "Surat Banding" },
      { prop: "TglSuratPermohonan", name: "Tanggal" }
    ];
  }

  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  onSelect() {
    if(this.selected.length == 0){
      this.state = "inactive";
    } else {
      this.state      = "active"
      this.wingToolbar.searchShow = false;
    }
  }

  reset(event: any) {
    this.onSearch(event);
  }

  onSearch(event: any){
    try {
      var keyword = event.target.value.toLowerCase();
    } catch (error) {
      keyword     = "";
    }

    this.items       = this.arrayFilter(this.tempItems, keyword);;
    this.table.offset = 0;
  }

  arrayFilter(array: any[], string: string) {
    return array.filter(
      data =>
        JSON.stringify(data)
          .toLowerCase()
          .indexOf(string.toLowerCase()) !== -1
    );
  }

  onClickView() {
    // console.log(this.selected[0].PermintaanId);
    // debugger;
    this._sharedService.setData(this.selected[0].PermohonanId);
    this._sharedService.setTipe(this.tipe);
    console.log(this.selected[0].JenisPemeriksaan);
      if(this.selected[0].JenisPemeriksaan=='AC'){
        this._sharedService.setAC(true);
      }else{
        this._sharedService.setAC(false);
      }
    this.abgService.getProvinsi().subscribe(result => {
      this._sharedService.setProvinsi(result);
      this.router.navigate(['banding/detail', this.selected[0].PermohonanId]);    
    });
    
    //let dialogRef = this.dialog.open(CityDetailComponent, {data: this.selected[0]});

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.cityService.update(result, result.SpesificationId).subscribe(result => {
    //       this.prepareCity();
    //       this.snackbar.showSnackBar();
    //     });
    //   }
    // });
  }

  onClickEdit() {

    let dialogRef = this.dialog.open(PermintaanBantahanComponent, {data: this.selected[0]});
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mintaBantahService.update(result, result.PermohonanId).subscribe(result => {
          this.prepareMintaBantah();
          this.snackbar.showSnackBar("success", "Simpan Permintaan Bantahan berhasil !");
        });
      }
    });
  }

//   onEditClick(permohonanId: number) {
//     // console.log('edit selected', this.selected);
//     let dialogRef = this.dialog.open(PermohonanTabComponent, {
//         data: permohonanId,
//     });

//     dialogRef.afterClosed().subscribe(result => {
//         //console.log("quote dialog closed", result);
//         if (result != null) {
//             this.mintaBantahService.update(result).subscribe(result => {
//                 this.prepareTableContent();
//                 this.snackbar.showSnackBar("success", "Edit Permohonan berhasil!");
//             });
//         }
//     });
// }

}
