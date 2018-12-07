import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'wing-search',
  templateUrl: './wing-search.component.html',
  styleUrls: ['./wing-search.component.css']
})
export class WingSearchComponent implements OnInit {
  
  @Output() search          : EventEmitter<any> = new EventEmitter();
  @Output() clickSearch     : EventEmitter<any> = new EventEmitter();

  @Input() clearText        : boolean           = false; // jika true ketika menekan tombol Close (X) text pada search input akan terhapus, jika false tidak akan hilang
  @Input() showSearch       : boolean           = false; //panggil variable ini jika ingin menampilkan/atau menyembunyikan search input pada control yang lain.
  @Input() public textSearch: string            = ""; //panggil variable ini jika mengosongkan text pada search box.
  @Input() placeHolder      : string            = "Cari"; // menggantik text pada placeholder

  subscriptionMedia         : Subscription;
  mediaClass                : MediaClass        = new MediaClass;

  
  constructor(
    public media: ObservableMedia,
  ) { 
    this.mediaClass.xs = this.media.isActive('xs');
    this.mediaClass.sm = this.media.isActive('sm');
    this.mediaClass.md = this.media.isActive('md');
    this.mediaClass.lg = this.media.isActive('lg');
  }

  ngOnInit() { 
    this.subscriptionMedia = this.media.subscribe((change: MediaChange) => {
      this.mediaClass.xs = change.mqAlias === 'xs';
      this.mediaClass.sm = change.mqAlias === 'sm';
      this.mediaClass.md = change.mqAlias === 'md';
      this.mediaClass.lg = change.mqAlias === 'lg';
    });
  }

  searchShow(event: any) {
    this.clickSearch.emit(event);
    this.showSearch = true;
  }

  searchHide(event: any) {
    this.showSearch = false;
    if(this.clearText) {
      this.textSearch = "";
      this.searchChange(event);
    }
  }

  searchChange(event: any) { 
    this.search.emit(event); 
  }
}

export class MediaClass {
  xs: boolean = false;
  sm: boolean = false;
  md: boolean = false;
  lg: boolean = false;
}
