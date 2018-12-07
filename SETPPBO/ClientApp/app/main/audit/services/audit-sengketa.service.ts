import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuditSengketa } from "../models/audit-sengketa";
import { AuditSengketaList } from '../models/audit-sengketa-list';

@Injectable()
export class AuditSengketaService {
    apiUrl: string = "api/Audit/Sengketa";
    constructor(private http: Http) { }

    getAll(): Observable<AuditSengketaList[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getById(id: string = ""): Observable<AuditSengketa[]> {
        return this.http
            .get(this.apiUrl + `/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}
