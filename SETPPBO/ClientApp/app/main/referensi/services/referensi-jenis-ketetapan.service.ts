import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReferensiJenisKetetapan } from '../models/referensi-jenis-ketetapan';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ReferensiJenisKetetapanService {
  apiUrl: string = 'api/RefJenisKetetapan';
  constructor(private http: Http) { }

getAll(): Observable<ReferensiJenisKetetapan[]> {
  return this.http
  .get(this.apiUrl)
  .map((response: Response) => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}
getById(id: string = ""): Observable<ReferensiJenisKetetapan> {
  return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
}

add(item: ReferensiJenisKetetapan): Observable<any> {
  return this.http
      .post(this.apiUrl, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
}

update(item: ReferensiJenisKetetapan): Observable<ReferensiJenisKetetapan> {
  return this.http
      .put(this.apiUrl + `/${item.RefJenisKetetapanId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
}

delete(item:ReferensiJenisKetetapan): Observable<ReferensiJenisKetetapan> {
  return this.http
      .delete(this.apiUrl + `/${item}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}
}