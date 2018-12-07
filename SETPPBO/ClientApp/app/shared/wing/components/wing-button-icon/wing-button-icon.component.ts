import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wing-button-icon',
  templateUrl: './wing-button-icon.component.html',
  styleUrls: ['./wing-button-icon.component.css']
})
export class WingButtonIconComponent implements OnInit {

  @Input() icon: String;
  constructor() { }

  ngOnInit() {
  }

}
