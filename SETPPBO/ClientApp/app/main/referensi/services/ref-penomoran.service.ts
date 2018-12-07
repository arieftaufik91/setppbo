import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefPenomoran } from "../models/ref-penomoran";

@Injectable()
export class RefPenomoranService {
  apiUrl: string = "api/Penomoran";
  constructor(private http: Http) { }

  getAll(): Observable<RefPenomoran[]> {
    return this.http
        .get(this.apiUrl)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }

  add(item: RefPenomoran): Observable<any> {
    return this.http
        .post(this.apiUrl, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error));
  }

  update(item: RefPenomoran): Observable<RefPenomoran> {
      return this.http
          .put(this.apiUrl + `/${item.PenomoranId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  delete(item: number): Observable<RefPenomoran> {
      return this.http
          .delete(this.apiUrl + `/${item}`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
}
