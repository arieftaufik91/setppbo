import { Http, Response } from "@angular/http/src";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class BaseCrudService {
    apiUrl: string;
    http: Http;
    constructor(apiUrl: string, http: Http) { 
        this.apiUrl = apiUrl;
        this.http = http;
    }

    getAll(): Observable<any> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getById(id: string = ""): Observable<any> {
        return this.http
            .get(this.apiUrl + `/${id}`)
            .map(response => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    create(item: any): Observable<any> {
        return this.http
            .post(this.apiUrl, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    update(item: any, id: string): Observable<any> {
        return this.http
            .put(this.apiUrl + `/${id}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    delete(id: string): Observable<any> {
        return this.http
            .delete(this.apiUrl + `/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}