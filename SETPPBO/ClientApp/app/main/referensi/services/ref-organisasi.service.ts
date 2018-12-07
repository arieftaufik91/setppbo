import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefOrganisasi } from '../models/ref-organisasi';

@Injectable()
export class RefOrganisasiService {

    apiUrl: string = "api/kota/AllOrganisasi";

    constructor(private http: Http) { }


    getAll(): Observable<RefOrganisasi[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}
