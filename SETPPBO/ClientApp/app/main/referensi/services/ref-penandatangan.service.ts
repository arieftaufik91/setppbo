import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RefPenandatangan } from '../models/ref-penandatangan';

@Injectable()
export class RefPenandatanganService {

  apiUrl: string = "api/RefPenandatangan";

  constructor(private http: Http) { }

  getAll(): Observable<RefPenandatangan[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: number): Observable<RefPenandatangan> {
    return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }

  update(item: RefPenandatangan): Observable<RefPenandatangan> {
    return this.http
      .put(this.apiUrl + `/${item.RefConfigId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getNamaByNip(nip: string): Observable<string> {
    return this.http.get(this.apiUrl + `/GetNamaByNIP/${nip}`).map(response => response.json());
  }

}
