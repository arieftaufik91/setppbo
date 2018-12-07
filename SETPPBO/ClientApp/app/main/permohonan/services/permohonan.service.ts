import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Permohonan } from "../models/permohonan";

@Injectable()
export class PermohonanService {
    apiUrl: string = "api/Permohonan";
    apiBaseUrl: string = 'api/AdministrasiBandingGugatan';
  constructor(private http: Http) { }

  getAll(): Observable<Permohonan[]> {
      return this.http
          .get(this.apiUrl)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
  getByPaging(data: any): Observable<any> {
    return this.http
        .post(this.apiUrl + `/Paging`, data)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
}
    // fungsi get base URL untuk download
    getBaseUrl(): Observable<any> {
        return this.http
            .get(this.apiBaseUrl + `/GetBaseURL`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
  getValidasi(data: any): Observable<any> {
      return this.http
          .post(this.apiUrl + `/ValidasiPermohonan`, data)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<Permohonan> {
      return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }

  getKelengkapanById(id: string = ""): Observable<Permohonan> {
      return this.http.get(this.apiUrl + `/PermohonanKelengkapan/${id}`).map(response => response.json());
  }

  cekSkpKepById(id: string = ""): Observable<boolean> {
      return this.http.get(this.apiUrl + `/CekKepSkp/${id}`).map(response => response.json());
  }

  add(item: Permohonan): Observable<any> {
      return this.http
          .post(this.apiUrl, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error));
  }

  update(item: Permohonan): Observable<Permohonan> {
      return this.http
          .put(this.apiUrl + `/Update/${item.PermohonanId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

    Uploads(id: string, item: any): Observable<Permohonan> {
        return this.http
            .put(this.apiUrl + `/Uploads/${id}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

  updatePermohonan(item: Permohonan): Observable<Permohonan> {
      return this.http
          .put(this.apiUrl + `/UpdatePermohonan/${item.PermohonanId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  updateKelengkapan(item: Permohonan): Observable<Permohonan> {
      return this.http
          .put(this.apiUrl + `/UpdateKelengkapan/${item.PermohonanId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  updateJenisPemeriksaan(item: Permohonan): Observable<Permohonan> {
        return this.http
            .put(this.apiUrl + `/UpdateJenisPemeriksaan/${item.PermohonanId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
  }

  updatePembagianBerkas(item: Permohonan): Observable<Permohonan> {
      return this.http
          .put(this.apiUrl + `/UpdatePembagianBerkas/${item.PermohonanId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
  delete(item: Permohonan): Observable<Permohonan> {
      return this.http
          .delete(this.apiUrl + `/${item.PermohonanId}`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
}
