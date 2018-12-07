import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Refcarakirimpermohonan } from '../models/refcarakirimpermohonan';

@Injectable()
export class RefcarakirimpermohonanService {
  apiUrl: string = "api/RefCaraKirim";
  constructor(private http: Http) { }

  getAll(): Observable<Refcarakirimpermohonan[]> {
      return this.http
          .get(this.apiUrl)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  getAllDaftar(): Observable<Refcarakirimpermohonan[]> {
    return this.http
        .get(this.apiUrl + "/DaftarCaraKirim")
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
}

  getById(id: string = ""): Observable<Refcarakirimpermohonan> {
      return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }

  add(item: Refcarakirimpermohonan): Observable<any> {
    return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  update(item: Refcarakirimpermohonan): Observable<Refcarakirimpermohonan> {
    return this.http
      .put(this.apiUrl + `/${item.RefCaraKirimId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  delete(item: number): Observable<Refcarakirimpermohonan> {
    return this.http
        .delete(this.apiUrl + `/${item}`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
}