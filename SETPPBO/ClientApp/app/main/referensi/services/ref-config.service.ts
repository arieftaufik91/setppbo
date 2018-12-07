import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefConfig } from '../models/ref-config';

@Injectable()
export class RefConfigService {

  apiUrl: string = "api/RefConfig";

  constructor(private http: Http) { }

  getAll(): Observable<RefConfig[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: number): Observable<RefConfig> {
    return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }

  add(item: RefConfig): Observable<any> {
    return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  update(item: RefConfig): Observable<RefConfig> {
    return this.http
      .put(this.apiUrl + `/${item.RefConfigId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

}
