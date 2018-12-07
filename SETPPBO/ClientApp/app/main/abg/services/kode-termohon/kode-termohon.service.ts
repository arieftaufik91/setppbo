import { Injectable } from '@angular/core';
import { KodeTermohon } from '../../models/kode-termohon/kode-termohon';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class KodeTermohonService {

  apiUrl: string = "api/KodeTermohon"
  constructor(private http: Http) { }

  getAll(): Observable<KodeTermohon[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}
