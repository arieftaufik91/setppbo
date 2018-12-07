import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { DaftarSengketa } from '../models/daftarSengketa';

@Injectable()
export class BerkasSidangService {
  apiUrl: string = "api/Sengketa/DaftarSengketa";
  constructor(private http: Http) { }

  getAllDaftarSengketa(): Observable<DaftarSengketa[]> {
    return this.http
        .get(this.apiUrl)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
}
}
