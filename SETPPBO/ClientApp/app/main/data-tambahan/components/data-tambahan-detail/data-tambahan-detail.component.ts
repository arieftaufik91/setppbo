import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { DataTambahanService } from '../../services/data-tambahan.service';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";


@Component({
  selector: 'app-data-tambahan-detail',
  templateUrl: './data-tambahan-detail.component.html',
  styleUrls: ['./data-tambahan-detail.component.css'],
  providers: [DataTambahanService, AdministrasiBandingGugatanService]
})
export class DataTambahanDetailComponent implements OnInit {
  cetak       : string;
  selected    : any[] = [];
  permohonan  : any;
  filepath    : string;
  rows        : any[];
  downloadPath: string;

  constructor(
    public dialogRef      : MatDialogRef<DataTambahanDetailComponent>,
    private http          : HttpClient,
    private formBuilder   : FormBuilder,
    private _servicecetak : AdministrasiBandingGugatanService,
    private _service      : DataTambahanService,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {   
    this.permohonan = data.permohonan
    this.load();
  }

  download() {
    this._servicecetak.getBaseUrl().subscribe(result => {
      this.cetak = result;
      this.cetak = this.cetak + "/api/DownloadFileDT/"  + this.filepath + "/" + this.selected[0].Uraian
    });

    setTimeout(() => {
      window.open(this.cetak);
    }, 250);
    
  
  }

  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  ngOnInit() {
  }

  close() {
      this.dialogRef.close();
  }

  load() {
    this._service.getDetailDataTambahan(this.permohonan.SuratPengantarId).subscribe(result => {
      this.filepath = result.path;
      this.rows = result.dataTambahan;
    });
  }

}
