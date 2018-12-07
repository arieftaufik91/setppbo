import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LayoutNavService {

  constructor(private http: Http) {
    let obj;
    this.getJSON().subscribe(data => obj = data, error => console.log(error));
  }

  public getJSON(): Observable<any> {
    return this.http.get('.app/core/layout/data/layout-nav.json')
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

}
