import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataTambahanTT } from '../../models/data-tambahan-tt';
import { DataTambahanService } from '../../services/data-tambahan.service';
import { HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";

declare var saveAs:any;
@Component({
  selector: 'app-data-tambahan-konfirmasi',
  templateUrl: './data-tambahan-konfirmasi.component.html',
  styleUrls: ['./data-tambahan-konfirmasi.component.css'],
  providers: [DataTambahanService, AdministrasiBandingGugatanService]
})
export class DataTambahanKonfirmasiComponent implements OnInit {
  item : DataTambahanTT;
  downloadlink :string;
  suratPengantarID:string =  this.route.snapshot.params['id'];
  message:string ="";
  url: string = "api/datatambahan/cetaktt";
  cetak :string;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private _servicecetak : AdministrasiBandingGugatanService,
    private datatambahanService: DataTambahanService,
    private location: Location,
    private router: Router,
    private snackbar: PuiSnackbarService
  ) { }

  ngOnInit() {
    this.gettandaterima();
    this.downloadlink = "http://localhost:42336/api/datatambahan/cetaktt/" + this.suratPengantarID;
  }
  gettandaterima(): void {
    const id: string = this.route.snapshot.params['id'];
    this.datatambahanService.gettandaterima(id)
      .subscribe(item => this.item = item);
  }
 
  goBack(): void {
    this.location.back();
  }
  onCetak() {
  
        this._servicecetak.getBaseUrl().subscribe(result => {
          this.cetak = result;
          this.cetak = this.cetak + "/api/datatambahan/cetaktt/" +   this.suratPengantarID;
        });
        setTimeout(() => {
          window.open(this.cetak);
        }, 250);
      
    
  }
}
