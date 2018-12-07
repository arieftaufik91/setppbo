import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { PenetapanAddComponent } from '../penetapan-add/penetapan-add.component';
import { Penetapan } from '../../models/penetapan';
import { PenetapanService } from '../../services/penetapan.service'
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PuiSnackbarService } from '../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service';
import { PuiConfirmDialogService } from '../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Permohonan } from '../../../permohonan/models/permohonan'
import { write } from 'cfb/types';
import { ReferensiTemplateService } from '../../../referensi/services/referensi-template.service';

@Component({
  selector: 'app-penetapan-add-detail',
  templateUrl: './penetapan-add-detail.component.html',
  styleUrls: ['./penetapan-add-detail.component.css'],
  providers: [PenetapanService, ReferensiTemplateService]
})
export class PenetapanAddDetailComponent implements AfterViewInit {
  nomorstring:string;
  penetapan:Penetapan = new Penetapan();
  formModel: Penetapan;
  penetapans: Penetapan[];
  items: Permohonan[];
  tempItems: Permohonan[];
  item: Permohonan;
  nomornumber:number;
  daftarSengketa: any[] = [];
  LIMITS = [
    { key: '5', value: 5},
    { key: '10', value: 10},
    { key: '50', value: 50},
    { key: '100', value: 100}
  ];
  isEdit = false;
  noPenetapan: string;
  nomorPenetapan:string;
  @ViewChild(PenetapanAddComponent) child:any;

  rows: any[];
  tempRows: any[];
  selected: any[] = [];
  selectedkota = new FormControl("");
  @ViewChild(DatatableComponent) table: DatatableComponent;  

  constructor(
    private router: Router,
    private _service: PenetapanService,
    private snackbar: PuiSnackbarService,
    private _refTemplateService: ReferensiTemplateService,
    private dialogsService: PuiConfirmDialogService) { }
 
  message:string;

  ngOnInit() {
    // this.noPenetapan = this.selected[0].NoPenetapan;
    // console.log(this.noPenetapan);
    // this.noPenetapan= this.noPenetapan.replace(new RegExp("/", 'g'), ".");
    // this._service.getById(this.noPenetapan).subscribe(result =>{
    //   this.formModel = result;
    // })
    if (this.formModel != null) {
      this.isEdit = true;
      this.selectedkota = new FormControl(this.formModel.kotaId);
      this.formModel = this.formModel; // asumsi yang dilempar oleh data adalah object Quote
      this.child.formGroup.setValue({
        NoPenetapan: this.formModel.NoPenetapan,
        TglPenetapan: this.formModel.TglPenetapan,
      });
    }
    else{
        this.formModel = new Penetapan();
      }
    
  }

  onOkClick(){
      this.dialogsService
        .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Melakukan Penetapan?")
        .subscribe(accept => {
          if (accept) {
            
            this._service.getNomorTerakhir().subscribe(result => {
                this.nomorPenetapan = result;

                if(this.nomorPenetapan != null){
                  
                  for(let x of this.selected){
                    this.penetapan.PermohonanId = x.PermohonanId;
                     this.penetapan.NoPenetapan = this.nomorPenetapan;
                    this.penetapan.TglPenetapan = this.child.formGroup.controls['TglPenetapan'].value;
                    this.penetapan.TempatSidang = this.child.selectedkotamodel;
                    this.penetapan.PejabatPenandatangan = this.child.formGroup.controls['PejabatPenandatangan'].value;
                    this.penetapan.PosisiPejabatPenandatangan = this.child.formGroup.controls['PosisiPejabatPenandatangan'].value;
                      this._service.add(this.penetapan).subscribe(
                      result => {
                    
                      },
                      error => {},
                      () => {}
                      );
                    }
                  }
                  this.snackbar.showSnackBar("success", "Penetapan Berkas Berhasil!");
                  this.selected = [];
                  this.router.navigate(['/penetapan']);
                  this.prepareTableContent();
            });

            this._refTemplateService.checkTemplate(9).subscribe(result =>{
              if(!result){
                console.log("Gagal Upload");
              }else{
                console.log("Sukses");
              }
            });
        
            
           
       
        }
      });
    }

    onNoClick(){
      this.router.navigate(['/penetapan']);
    }
  
  
  ngAfterViewInit() {
    this.prepareTableContent();
  }

  prepareTableContent() {
    this._service.getDaftarBerkas().subscribe(result => {
    this.items = result;
    this.tempItems = [...result];
    this.daftarSengketa = [];
    this.rows = result;
    this.tempRows = [...result];

});
  }

  selectAll() {
    this.selected = [...this.rows]
  }

  deselectAll() {
    this.selected = []
  }

  submitDocument() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Apakah Anda Yakin Untuk Melakukan Penetapan?")
      .subscribe(accept => {
        if (accept) {
 //         this._service.prosesDistribusi(this.selected).subscribe(
  //          result => {
  //            this.prepareTableContent();
  //            this.snackbar.showSnackBar("success", "Distribusi Berkas Berhasil!");
  //            this.selected = [];
  //          },
  //          error => {},
 //           () => {}
//          );
        }
      });
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
    const temp = this.filterByValue(this.tempRows, val);

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onDeleteClick() {
    // konfirmasi
    this.dialogsService
      .confirm("Konfirmasi", "Yakin mau menghapus Penetapan?")
      .subscribe(accept => {
        if (accept) {
          console.log(this.selected[0].NoPenetapan);
          let item = this.selected[0];
          this._service.delete(this.selected[0].NoPenetapan).subscribe(
            result => {
              this.prepareTableContent();
              this.snackbar.showSnackBar("success", "Hapus Penetapan berhasil!");
            },
            error => {},
            () => {}
          );
        }
      });
  }

  limit: number =this.LIMITS[0].value;
    rowLimits: Array<any> = this.LIMITS;

    changeRowLimits(event: any) {
      this.limit = event.target.value;
    }

}
