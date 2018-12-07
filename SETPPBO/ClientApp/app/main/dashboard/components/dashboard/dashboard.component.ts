import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  jumlahBerkasBelumSiapSidang: number = 0;
  jumlahBerkasMasuk: number = 0;
  jumlahBerkasSudahDistribusi: number = 0;
  jumlahBerkasSudahPenetapan: number = 0;

  constructor() { }

  ngOnInit() {
  }

  changeJumlahBerkasBelumSiapSidang(counter: number) {
    this.jumlahBerkasBelumSiapSidang = counter;
  }

  changeJumlahBerkasMasuk(counter: number) {
    this.jumlahBerkasMasuk = counter;
  }

  changeJumlahBerkasSudahDistribusi(counter: number) {
    this.jumlahBerkasSudahDistribusi = counter;
  }

  changeJumlahBerkasSudahPenetapan(counter: number) {
    this.jumlahBerkasSudahPenetapan = counter;
  }

  scroll(id: string) {
      var target = document.getElementById(id)
      if (target) {
          target.scrollIntoView({
              block: "start", 
              inline: "start"
          });
      }
  }

}
