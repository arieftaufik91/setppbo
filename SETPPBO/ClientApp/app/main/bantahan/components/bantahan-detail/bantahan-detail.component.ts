import { Component, OnInit, Inject } from '@angular/core';
import { BantahanService } from '../../services/bantahan.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { Bantahan } from '../../models/bantahan';

@Component({
  selector: 'app-bantahan-detail',
  templateUrl: './bantahan-detail.component.html',
  styleUrls: ['./bantahan-detail.component.css'],
  providers:[BantahanService]
})
export class BantahanDetailComponent implements OnInit {
PermohonanId: any;
item : any;
model : Bantahan;
urlDownload: string;

  constructor(
    public dialogRef: MatDialogRef<BantahanDetailComponent>,
    private bantahan: BantahanService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Bantahan,
  ) /*{ 
    this.model = data;
    this.fetch();
  }*/{}

  ngOnInit() {
    if (this.data != null) {
      this.item = this.data;
  } else {
      this.item = {} as Bantahan;
  }
}

 /* }
    close() {
      this.dialogRef.close();
  }*/

  downloadDocFile() {
    this.bantahan.getBaseUrl().subscribe(result => {
      this.urlDownload = result;
      this.urlDownload = this.urlDownload + "/api/DownloadBantahan/doc/Bantahan/"  + this.data.PermohonanId
    });

    setTimeout(() => {
      window.open(this.urlDownload);
    }, 250);
    
  }

  downloadPdfFile() {
    this.bantahan.getBaseUrl().subscribe(result => {
      this.urlDownload = result;
      this.urlDownload = this.urlDownload + "/api/DownloadBantahan/pdf/Bantahan/"  + this.data.PermohonanId
    });

    setTimeout(() => {
      window.open(this.urlDownload);
    }, 250);
    
  }

  onNoClick() {
    this.dialogRef.close();
}
  /*fetch() {
    this._service.getDetailBantahan(this.model.PermohonanId).subscribe(result =>{
      this.item = result;
    });
  }*/
  }
