


import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Refjenispajak } from '../models/refjenispajak';

@Injectable()
export class RefjenispajakService {
  apiUrl: string = "api/RefJenisPajak";
  constructor(private http: Http) { }

  getAll(): Observable<Refjenispajak[]> {
      return this.http
          .get(this.apiUrl)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<Refjenispajak> {
      return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }
}

