import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Refjenisnormawaktus } from "../models/referensi-jenisNormaWaktu";

@Injectable()
export class RefjenisnormawaktuService {

  apiUrl: string = "api/RefJenisNormaWaktu";
  constructor(private http: Http) { }

getAll(): Observable<Refjenisnormawaktus[]> {
    return this.http
        .get(this.apiUrl)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
}  
getById(id: string = ""): Observable<Refjenisnormawaktus> {
  return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
}

add(item: Refjenisnormawaktus): Observable<any> {
  return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
}

update(item: Refjenisnormawaktus): Observable<Refjenisnormawaktus> {
  return this.http
      .put(this.apiUrl + `/${item.RefJenisNormaWaktuID}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
}

delete(item:number): Observable<Refjenisnormawaktus> {
  return this.http
      .delete(this.apiUrl + `/${item}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}

}