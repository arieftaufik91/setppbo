import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefKodeTermohon } from '../models/ref-kode-termohon';

@Injectable()
export class RefKodeTermohonService {

    apiUrl: string = "api/RefKodeTermohon";
    
    constructor(private http: Http) { }

    getAll(): Observable<RefKodeTermohon[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    add(item: RefKodeTermohon): Observable<any> {
        return this.http
            .post(this.apiUrl, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error));
    }

    update(item: RefKodeTermohon): Observable<RefKodeTermohon> {
        return this.http
            .put(this.apiUrl + `/${item.OrganisasiId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

}
