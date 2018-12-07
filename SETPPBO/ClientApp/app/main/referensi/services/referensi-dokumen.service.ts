import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ReferensiDokumen } from "../models/referensi-dokumen";

@Injectable()
export class ReferensiDokumenService {

  constructor(
    private http: Http
  ) { }
    
  //apireferensidokumen
  url = '/api/RefDokumen';

  getAll(): Observable<any> {
    return this.http
    .get(this.url)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
  getById(id: string = ""): Observable<ReferensiDokumen> {
    return this.http.get(this.url + `/${id}`).map(response => response.json());
  }
  
  add(item: ReferensiDokumen): Observable<any> {
    return this.http
        .post(this.url, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error));
  }
  
  update(item: ReferensiDokumen): Observable<ReferensiDokumen> {
    return this.http
        .put(this.url + `/${item.RefDokumenId}`, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
  
  delete(item:number): Observable<ReferensiDokumen> {
    return this.http
        .delete(this.url + `/${item}`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
}
