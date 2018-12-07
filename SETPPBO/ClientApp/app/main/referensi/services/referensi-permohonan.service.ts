import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefPermohonan } from "../models/referensi-permohonan"

@Injectable()
export class ReferensiPermohonanService {
    apiUrl: string = "api/RefPermohonan";
  constructor(private http: Http) { }

  getAll(): Observable<RefPermohonan[]> {
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



 edit(item: any): Observable<any> {
    return this.http
      .put(this.apiUrl +`/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
   
}
