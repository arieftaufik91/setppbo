import { Component, OnInit, Input } from '@angular/core';
//import { Pencabutan } from '../../models/pencabutan';

@Component({
  selector: 'app-tanda-terima-pencabutan',
  templateUrl: './tanda-terima-pencabutan.component.html',
  styleUrls: ['./tanda-terima-pencabutan.component.css']
})
export class TandaTerimaPencabutanComponent{

  @Input()
  //public data: Pencabutan = {} as Pencabutan;
  public todayDate: number = Date.now();
}
