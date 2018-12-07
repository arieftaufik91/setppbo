import { Component, OnInit } from '@angular/core';
import { DistribusiService } from '../../services/distribusi.service';

@Component({
  selector: 'app-distribusi',
  templateUrl: './distribusi.component.html',
  styleUrls: ['./distribusi.component.css'],
  providers: [DistribusiService]
})
export class DistribusiComponent implements OnInit {

  chartOptions = {
    responsive: true,
    legend: {position: 'bottom'},
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
  };

  chartLabelsMajelisPajak: string[];
  chartDataMajelisPajak: any[];

  chartLabelsMajelisBeaCukai: string[];
  chartDataMajelisBeaCukai: any[];

  chartLabelsHakimTunggal: string[];
  chartDataHakimTunggal: any[];

  constructor(
    private _service: DistribusiService
  ) {
    
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this._service.getStatistikBerkas().subscribe(result => {
      this.chartLabelsMajelisPajak = result.Pajak.labels;
      this.chartDataMajelisPajak = [
        {data: result.Pajak.beban, label: 'Beban Non PPh'},
        {data: result.Pajak.bebanPPh, label: 'Beban PPh'}
      ];
      this.chartLabelsMajelisBeaCukai = result.BeaCukai.labels;
      this.chartDataMajelisBeaCukai = [
        {data: result.BeaCukai.beban, label: 'Beban Non PPh'},
        {data: result.BeaCukai.bebanPPh, label: 'Beban PPh'}
      ];
      this.chartLabelsHakimTunggal = result.HakimTunggal.labels;
      this.chartDataHakimTunggal = [
        {data: result.HakimTunggal.beban, label: 'Beban Non PPh'},
        {data: result.HakimTunggal.bebanPPh, label: 'Beban PPh'}
      ];
    });
  }
}
