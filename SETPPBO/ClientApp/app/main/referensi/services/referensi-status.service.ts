import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefStatus } from "../models/referensi-status"


@Injectable()
export class ReferensiStatusService {
    apiUrl: string = "api/RefStatus";
  constructor(private http: Http) { }

  getAll(): Observable<RefStatus[]> {
      return this.http
          .get(this.apiUrl)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
  }
}
