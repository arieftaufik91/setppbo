import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RefHakim } from "../models/ref-hakim";

@Injectable()
export class RefHakimService {

    apiUrl: string = "api/RefHakim";
    apiRefUrl: string = "api/Ref";
    constructor(private http: Http) { }

    getAll(): Observable<RefHakim[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getById(id: string = ""): Observable<RefHakim> {
        return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
    }

    add(item: RefHakim): Observable<any> {
        return this.http
            .post(this.apiUrl, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error));
    }

    update(item: RefHakim): Observable<RefHakim> {
        return this.http
            .put(this.apiUrl + `/${item.RefHakimId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    delete(item: number): Observable<RefHakim> {
        return this.http
            .delete(this.apiUrl + `/${item}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getNamaByNip(id: string): Observable<string> {
        return this.http.get(this.apiRefUrl + `/GetPegawaiByNIP/${id}`).map(response => response.json());
    }

}
