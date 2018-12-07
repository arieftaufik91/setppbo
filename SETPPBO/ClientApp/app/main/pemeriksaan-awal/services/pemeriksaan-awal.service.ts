import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { PemeriksaanAwal } from '../../pemeriksaan-awal/models/pemeriksaan-awal';

@Injectable()
export class PemeriksaanAwalService {
  apiUrl: string = "api/Permohonan";
  constructor(private http: Http) { }

  getAll(data: any): Observable<any> {
      return this.http
          .post(this.apiUrl + `/PemeriksaanAwal`, data)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<PemeriksaanAwal> {
    return this.http
      .get(this.apiUrl + `/PemeriksaanAwal/${id}`)
      .map(response => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getKelengkapanById(id: string = ""): Observable<PemeriksaanAwal> {
      return this.http.get(this.apiUrl + `/PermohonanKelengkapan/${id}`).map(response => response.json());
  }

  updateJenisPemeriksaan(item: PemeriksaanAwal): Observable<PemeriksaanAwal> {
      return this.http
          .put(this.apiUrl + `/UpdateJenisPemeriksaan/${item.PermohonanId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  update(item: PemeriksaanAwal): Observable<PemeriksaanAwal> {
      return this.http
          .put(this.apiUrl + `/Update/${item.PermohonanId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
}
