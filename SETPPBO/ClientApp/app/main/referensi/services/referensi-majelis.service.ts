import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ReferensiMajelis } from "../models/referensi-majelis";

@Injectable()
export class ReferensimajelisService {
  apiUrl: string = 'api/RefMajelis';
  constructor(private http: Http) { }

  getAll(): Observable<ReferensiMajelis[]> {
    return this.http
    .get(this.apiUrl)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
  getById(id: string = ""): Observable<ReferensiMajelis> {
    return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }
  
  add(item: ReferensiMajelis): Observable<any> {
    return this.http
        .post(this.apiUrl, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error));
  }
  
  update(item: ReferensiMajelis): Observable<ReferensiMajelis> {
    return this.http
        .put(this.apiUrl + `/${item.RefMajelisId}`, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
  
  delete(item:ReferensiMajelis): Observable<ReferensiMajelis> {
    return this.http
        .delete(this.apiUrl + `/${item}`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
}