import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefAlasan } from "../models/ref-alasan";

@Injectable()
export class RefAlasanService {

  apiUrl: string = "api/RefAlasan";
  constructor(private http: Http) { }

  getAll(): Observable<RefAlasan[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<RefAlasan> {
    return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }

  add(item: RefAlasan): Observable<any> {
    return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  update(item: RefAlasan): Observable<RefAlasan> {
    return this.http
      .put(this.apiUrl + `/${item.RefAlasanId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  delete(item: number): Observable<RefAlasan> {
    return this.http
      .delete(this.apiUrl + `/${item}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}
