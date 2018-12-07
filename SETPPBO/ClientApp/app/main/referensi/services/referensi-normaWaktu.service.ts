

import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Refnormawaktu } from "../models/refnormawaktu";


@Injectable()
export class RefnormawaktuService {

  apiUrl: string = "api/RefNormaWaktu";
  constructor(private http: Http) { }

getAll(): Observable<Refnormawaktu[]> {
    return this.http
        .get(this.apiUrl)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
}  
getById(id: string = ""): Observable<Refnormawaktu> {
  return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
}

add(item: Refnormawaktu): Observable<any> {
  return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
}

update(item: Refnormawaktu): Observable<Refnormawaktu> {
  return this.http
      .put(this.apiUrl + `/${item.RefNormaWaktuID}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
}

delete(item:number): Observable<Refnormawaktu> {
  return this.http
      .delete(this.apiUrl + `/${item}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}

}
