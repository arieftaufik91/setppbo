import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";


@Component({
  selector: 'wing-button-crud',
  templateUrl: './wing-button-crud.component.html',
  styleUrls: ['./wing-button-crud.component.css'],
  animations: [
    trigger("myState", [
      state(
        "inactive",
        style({
          transform: "translate3d(0,0,0)",
          left: "-10px",
          opacity: 0,
          display: "none",
        })
      ),
      state(
        "active",
        style({
          transform: "translate3d(10px,0,0)",
          opacity: 1,
          display: "block",
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
          transform: "rotate(0deg)"
        })
      ),
      state(
        "active",
        style({
          transform: "rotate(360deg)"
        })
      ),
      transition("inactive => active", animate("600ms ease-in")),
      transition("active => inactive", animate("600ms ease-out"))
    ])
  ]
})
export class WingButtonCrudComponent implements OnInit {
  
  // @Input() buttonAddtional1: string;
  // @Input() buttonAddtional2: string;
  // @Input() buttonAddtional3: string;
  
  @Input() state            : string            = "active";
  @Input() backLink         : string            = "";

  @Input() buttonAdd        : any               = {visible: true, icon: "add", tooltip: "Tambah"};
  @Input() buttonEdit       : any               = {visible: true, icon: "mode_edit", tooltip: "Ubah"};
  @Input() buttonDelete     : any               = {visible: true, icon: "delete", tooltip: "Hapus"};
  @Input() buttonView       : any               = {visible: true, icon: "remove_red_eye", tooltip: "Lihat"};
  
  @Input() buttonAdditional1: any               = {visible: false, icon: "home", tooltip: "Beranda"};
  @Input() buttonAdditional2: any               = {visible: false, icon: "home", tooltip: "Beranda"};
  @Input() buttonAdditional3: any               = {visible: false, icon: "home", tooltip: "Beranda"};

  
  @Output() clickAdd        : EventEmitter<any> = new EventEmitter();
  @Output() clickEdit       : EventEmitter<any> = new EventEmitter();
  @Output() clickDelete     : EventEmitter<any> = new EventEmitter();
  @Output() clickView       : EventEmitter<any> = new EventEmitter();
  @Output() clickAdditional1: EventEmitter<any> = new EventEmitter();
  @Output() clickAdditional2: EventEmitter<any> = new EventEmitter();
  @Output() clickAdditional3: EventEmitter<any> = new EventEmitter();

  constructor() { }
  
  ngOnInit() {
    if(this.state != "active") this.state = "inactive";
  }

  onAddClick(event: any) { this.clickAdd.emit(event); }
  onEditClick(event: any) { this.clickEdit.emit(event); }
  onDeleteClick(event: any) { this.clickDelete.emit(event); }
  onViewClick(event: any) { this.clickView.emit(event); }
  onAdditional1Click(event: any) { this.clickAdditional1.emit(event); }
  onAdditional2Click(event: any) { this.clickAdditional2.emit(event); }
  onAdditional3Click(event: any) { this.clickAdditional3.emit(event); }

}
