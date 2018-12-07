import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ReferensiJenisPajak } from "../models/referensi-jenis-pajak";
import { Injectable } from '@angular/core';


@Injectable()
export class ReferensiJenisPajakService {

  apiUrl        : string        = "api/RefJenisPajak";
  apiJenisKasus : string        = "api/RefJenisKasus";
  constructor(private http: Http) { }

  getAll(): Observable<ReferensiJenisPajak[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<ReferensiJenisPajak> {
    return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }

  add(item: ReferensiJenisPajak): Observable<any> {
    return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  update(item: ReferensiJenisPajak): Observable<ReferensiJenisPajak> {
    return this.http
      .put(this.apiUrl + `/${item.RefJenisPajakId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  delete(item: number): Observable<ReferensiJenisPajak> {
    return this.http
      .delete(this.apiUrl + `/${item}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getJenisKasus(): Observable<ReferensiJenisPajak[]> {
    return this.http
      .get(this.apiJenisKasus)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}



