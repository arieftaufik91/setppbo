import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TandaTerimaSubst } from '../../../models/tanda-terima-subst/tanda-terima-subst';
import { TandaTerimaSubstService } from '../../../services/tanda-terima-subst/tanda-terima-subst.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MatDialog } from "@angular/material";
import { PuiSnackbarService } from "../../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";
import { PuiConfirmDialogService } from "../../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-tanda-terima-subst-list',
  templateUrl: './tanda-terima-subst-list.component.html',
  styleUrls: ['./tanda-terima-subst-list.component.css'],
  providers:  [TandaTerimaSubstService],
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
          transform: "translate3d(0px,0,0)",
          opacity: 1
        })
      ),
      transition("inactive => active", animate("300ms ease-in")),
      transition("active => inactive", animate("300ms ease-out"))
    ]),
    trigger("myRotation", [
      state(
        "inactive",
        style({
          // rotate left
          transform: "rotate(-90deg)"
        })
      ),
      state(
        "active",
        style({
          transform: "rotate(90deg)"
        })
      ),
      transition("inactive => active", animate("300ms ease-in")),
      transition("active => inactive", animate("300ms ease-out"))
    ])
  ]
})
export class TandaTerimaSubstListComponent implements OnInit {
  //default properties
  items: TandaTerimaSubst[];
  tempItems: TandaTerimaSubst[];
  item: TandaTerimaSubst;
  sharedData: TandaTerimaSubst;
  isVisible = false;
  // ngx-datatable properties
  columns: any[];
  selected: any[] = [];

  // animations properties
  state = "inactive";

  @Input() tipe: number = 1;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tandaterimasubstService: TandaTerimaSubstService,
    private dialog: MatDialog,
    private snackbar: PuiSnackbarService,
    private dialogsService: PuiConfirmDialogService,
    private _service: TandaTerimaSubstService,
    private _sharedService: SharedDataService
  ) { 
  }

  ngOnInit() {
    this.prepareTableContent();

    // set datatable.column
    // specify column
    this.columns = [ 
                    { prop: "NamaPemohon", name: "Pemohon" }, 
                    { prop: "NoTandaTerimaSubSt", name: "Tanda Terima" }, 
                    { prop: "NoSuratPermintaanSubSt", name: "Permintaan SUB/ST" },
                    { prop: "NoSubSt", name: "SUB/ST" },
                    { prop: "NoSuratPermintaanBantahan", name: "Permintaan Bantahan" },
                    { prop: "NoSuratBantahan", name: "Bantahan" },
                    { prop: "NoSuratPermintaanSalinan", name: "Salinan Bantahan" }
                  ];
  }

  /**
   * Function untuk menyiapkan isi tabel.
   * Ambil dari SampleService.
   */
  prepareTableContent() {
    //const id: number = this.route.snapshot.params['id'];
    console.log(this.tipe);
    this._service.getAll(this.tipe).subscribe(result => {
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
    // navigate to detail
    //this.router.navigate(['/sample', event.selected[0].QuoteId]);
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

  onAddClick(){
    this._sharedService.setData(this.selected[0]);
    this._sharedService.setTipe(this.tipe);
    console.log(this.selected[0].PemohonId);
    this.router.navigate(['/abg-form/']);
  }

}
