import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Refjenispermohonan } from "../models/refjenispermohonan";

@Injectable()
export class RefjenispermohonanService {
  apiUrl: string = "api/RefJenisPermohonan";
  constructor(private http: Http) { }

  getAll(): Observable<Refjenispermohonan[]> {
      return this.http
          .get(this.apiUrl)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<Refjenispermohonan> {
      return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
  }
}
