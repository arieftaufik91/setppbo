import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Kelengkapan } from '../models/kelengkapan';

@Injectable()
export class KelengkapanService {

    apiUrl: string = "api/Kelengkapan";
    constructor(private http: Http) { }

    getAll(PemohonId: string = ""): Observable<Kelengkapan[]> {
        return this.http
            .get(this.apiUrl + `/Pemohon/${PemohonId}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}
