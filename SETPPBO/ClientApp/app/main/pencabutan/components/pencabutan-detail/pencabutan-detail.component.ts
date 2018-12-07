import { Component, OnInit, Inject } from '@angular/core';
import { PencabutanService } from '../../services/pencabutan.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Pencabutan } from '../../models/pencabutan';
import { AdministrasiBandingGugatanService } from "../../../administrasi-banding-gugatan/services/administrasi-banding-gugatan/administrasi-banding-gugatan.service";


@Component({
  selector: 'app-pencabutan-detail',
  templateUrl: './pencabutan-detail.component.html',
  styleUrls: ['./pencabutan-detail.component.css'],
  providers: [PencabutanService, AdministrasiBandingGugatanService]
})
export class PencabutanDetailComponent implements OnInit {
  permohonan      :any;
  filepath        :any;
  permohonanId    :any;
  item            :any;
  model           :Pencabutan;
  cetak           :string;
  file            :string;
  disabledownload : boolean =true;

  constructor(
    public dialogRef: MatDialogRef<PencabutanDetailComponent>,
    private _servicecetak : AdministrasiBandingGugatanService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: PencabutanService
  ) { 
    this.model = data;
    this.fetch();
  }

  

  download() {
    this._servicecetak.getBaseUrl().subscribe(result => {
      this.cetak = result;
      this.cetak = this.cetak + "/api/DownloadFileDT/"  + this.filepath + "/" + this.file;
    });

    setTimeout(() => {
      window.open(this.cetak);
    }, 250);
   
  
  }

  ngOnInit() {
 
  }

  close() {
    this.dialogRef.close();
  }

  fetch() {
    this._service.getDetailPermohonan(this.model.PermohonanId)
      .subscribe(result => {
        this.item = result;
        this.file = result.FilePencabutan;
        console.log(this.file);
        if(result.FilePencabutan ==null) {this.disabledownload =true} else{this.disabledownload =false}
        console.log(this.disabledownload);
       
      });

      this._service.getDetailPencabutan(this.model.PermohonanId).subscribe(result => {
        this.filepath = result.path;
      });
  }
}
