import { Injectable } from '@angular/core';
import { Subst } from "../models/subst";
import { Http, Response, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import { retry } from 'rxjs/operator/retry';
import { RefPengirim } from '../models/refPengirim';

@Injectable()
export class SubstService {
    apiUrl: string = "api/SubSt";
    apiUrlCetak : string = "api/subst/cetaktt";
    apiUrlTT:string = 'api/subst/cetak';
    apiBaseUrl: string = 'api/AdministrasiBandingGugatan';
    constructor(private http: Http) { }

    getAll(): Observable<Subst[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getAllValidasi(): Observable<Subst[]> {
        return this.http
            .get(this.apiUrl + `/DaftarValidasi`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getById(id: string = ""): Observable<Subst> {
        return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
    }

    // fungsi get base URL untuk download
    getBaseUrl(): Observable<any> {
        return this.http
            .get(this.apiBaseUrl + `/GetBaseURL`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    addSubSt(id: any, item: Subst): Observable<Subst> {
        return this.http
            .put(this.apiUrl + `/AddSubSt` + `/${id}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json())); 
    }

    update(item: Subst): Observable<Subst> {
        return this.http
            .put(this.apiUrl + `/${item.PermohonanId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    updateSubSt(id: any, item: Subst): Observable<Subst> {
        return this.http
            .put(this.apiUrl + `/UpdateSubSt` + `/${id}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json())); 
    }

    deleteSubSt(id: any, item: Subst): Observable<Subst> {
        return this.http
            .put(this.apiUrl + `/DeleteSubst` + `/${id}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json())); 
    }

    validasiSubst(id: any, item: Subst): Observable<Subst> {
        return this.http
            .put(this.apiUrl + `/Validasi` + `/${id}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getDaftarPengirim(OrganisasiInduk: number): Observable<RefPengirim[]> {
        return this.http
            .get(this.apiUrl + `/PengirimSubst`+ `/${OrganisasiInduk}`)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

}
