import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subst } from '../../models/subst';
import { SubstService } from '../../services/subst.service';

@Component({
  selector: 'app-subst-detail',
  templateUrl: './subst-detail.component.html',
  styleUrls: ['./subst-detail.component.css'],
  providers: [SubstService]
})
export class SubstDetailComponent implements OnInit {

  item: any;
  urlDownload: string;

  constructor( 
    public dialogRef: MatDialogRef<SubstDetailComponent>,
    private substservice: SubstService,
    @Inject(MAT_DIALOG_DATA) public data: Subst
  ){

  }

  ngOnInit() {
      if (this.data != null) {
          this.item = this.data;
      } else {
          this.item = {} as Subst;
      }
  }

  downloadDocFile() {
    this.substservice.getBaseUrl().subscribe(result => {
      this.urlDownload = result;
      this.urlDownload = this.urlDownload + "/api/DownloadSubst/doc/Subst/"  + this.data.PermohonanId
    });

    setTimeout(() => {
      window.open(this.urlDownload);
    }, 250);
    
  }

  downloadPdfFile() {
    this.substservice.getBaseUrl().subscribe(result => {
      this.urlDownload = result;
      this.urlDownload = this.urlDownload + "/api/DownloadSubst/pdf/Subst/"  + this.data.PermohonanId
    });

    setTimeout(() => {
      window.open(this.urlDownload);
    }, 250);
    
  }

  onNoClick() {
      this.dialogRef.close();
  }

}
