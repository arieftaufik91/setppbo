import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from "@angular/http";
import { Dashboard } from '../models/dashboard';
import { DashboardList } from '../models/dashboard-list';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DashboardService {

    apiUrl: string = "api/dashboard";

    constructor(private http: Http) { }

    getDaftarBerkasMasuk(): Observable<DashboardList[]> {
        return this.http
          .get(this.apiUrl + `/DaftarBerkasMasuk`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
    }

    getDaftarBerkasBelumSiapSidang(): Observable<DashboardList[]> {
        return this.http
          .get(this.apiUrl + `/DaftarBerkasBelumSiapSidang`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
    }

    getDaftarBerkasSudahDistribusi(): Observable<DashboardList[]> {
        return this.http
          .get(this.apiUrl + `/DaftarBerkasSudahDistribusi`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
    }

    getDaftarBerkasSudahPenetapan(): Observable<DashboardList[]> {
        return this.http
          .get(this.apiUrl + `/DaftarBerkasSudahPenetapan`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
    }

}
