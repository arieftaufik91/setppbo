import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuditUser } from "../models/audit-user";
import { AuditUserList } from '../models/audit-user-list';

@Injectable()
export class AuditUserService {
    apiUrl: string = "api/Audit/User";
    constructor(private http: Http) { }

    getAll(): Observable<AuditUserList[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getById(id: string = ""): Observable<AuditUser[]> {
        return this.http
            .get(this.apiUrl + `/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}