import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { BantahanService } from '../../services/bantahan.service';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";


@Component({
  selector: 'app-bantahan-download',
  templateUrl: './bantahan-download.component.html',
  styleUrls: ['./bantahan-download.component.css'],
  providers : [BantahanService,AdministrasiBandingGugatanService]
})
export class BantahanDownloadComponent implements OnInit {

  cetak       : string;
  selected    : any[] = [];
  permohonan  : any;
  filepath    : string;
  rows        : any[];
  downloadPath: string;

  constructor(
    public dialogRef    : MatDialogRef<BantahanDownloadComponent>,
    private http        : HttpClient,
    private formBuilder : FormBuilder,
    private scetak      : AdministrasiBandingGugatanService,
    private service     : BantahanService,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) {
    this.permohonan = data.permohonan
    //this.load(); 
  }

  ngOnInit() {
  }
 

  download() {
    this.scetak.getBaseUrl().subscribe(result => {
      this.cetak = result;
      this.cetak = this.cetak + "api/DownloadFileDT/" + this.filepath + "/" + this.selected[0].FilePdfBantahan
    });
    window.open(this.cetak);
  }

  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  close(){
    this.dialogRef.close();
  }

  /*load() {
    this.service.getDownloadBantahan(this.permohonan.PermohonanId).subscribe(result =>{
      this.filepath = result.path;
      this.rows = result.bantahan;
    })
  }*/
}
