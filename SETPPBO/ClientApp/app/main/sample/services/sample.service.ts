import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Quote } from "../models/quote";

@Injectable()
export class SampleService {
    apiUrl: string = "api/SampleData";
    constructor(private http: Http) { }

    getAll(): Observable<Quote[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getById(id: string = ""): Observable<Quote> {
        return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
    }

    add(item: Quote): Observable<any> {
        return this.http
            .post(this.apiUrl, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error));
    }

    update(item: Quote): Observable<Quote> {
        return this.http
            .put(this.apiUrl + `/${item.QuoteId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    delete(item: Quote): Observable<Quote> {
        return this.http
            .delete(this.apiUrl + `/${item.QuoteId}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}
