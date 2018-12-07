import { Component, OnInit, Renderer2 } from '@angular/core';
import { WingToolbarVariable } from './wing-toolbar.variable';
import { Transition, Rotation } from './wing-toolbar.animation';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'wing-toolbar',
  templateUrl: './wing-toolbar.component.html',
  styleUrls: ['./wing-toolbar.component.css'],
  animations: [Transition, Rotation]
})
export class WingToolbarComponent extends WingToolbarVariable implements OnInit {

  constructor() { super(); }

  ngOnInit() {
    if (this.state !== 'active') { this.state = 'inactive'; }
  }

  Add() { this._add.emit(); }
  Del(event: any) { this._del.emit(event); }
  Edit(event: any) { this._edit.emit(event); }
  View(event: any) { this._view.emit(event); }

  SearchShow(event: any) {
    if (this.searchShow) {
      this.searchShow = false;
      this.Search(event);
    } else {
      this.searchShow = true;
      setTimeout(() => {
        this.focus.nativeElement.focus();
      }, 0);
    }
  }

  Reset(event: any){
    this._reset.emit(event);
  }

  Search(event: any) {
    this._search.emit(event);
  }

  SearchByInput(event: any) {
    if (!this.byEnter) { this.Search(event); }
  }
}
