import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefJenisPenomoran } from "../models/ref-jenis-penomoran";

@Injectable()
export class RefJenisPenomoranService {

  apiUrl: string = "api/RefJenisPenomoran";

  constructor(private http: Http) { }

  getAll(): Observable<RefJenisPenomoran[]> {
    return this.http
        .get(this.apiUrl)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }

  add(item: RefJenisPenomoran): Observable<any> {
    return this.http
        .post(this.apiUrl, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error));
  }

  update(item: RefJenisPenomoran): Observable<RefJenisPenomoran> {
      return this.http
          .put(this.apiUrl + `/${item.RefJenisPenomoranId}`, item)
          .map((resp: Response) => resp.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  delete(item: number): Observable<RefJenisPenomoran> {
      return this.http
          .delete(this.apiUrl + `/${item}`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
}
