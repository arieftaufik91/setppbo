import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ReferensiTemplate } from "../models/referensi-template";

@Injectable()
export class ReferensiTemplateService {

  constructor(
    private http: Http
  ) { }
    
  //apireferensitemplate
  url = 'api/RefTemplate';

  getAll(): Observable<any> {
    return this.http
    .get(this.url)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
  getById(id: string = ""): Observable<ReferensiTemplate> {
    return this.http.get(this.url + `/${id}`).map(response => response.json());
  }
  
  add(item: ReferensiTemplate): Observable<any> {
    return this.http
        .post(this.url, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error));
  }
  
  update(item: ReferensiTemplate,oldFileName: string): Observable<ReferensiTemplate> {
    return this.http
        .put(this.url + `/${item.RefTemplateId}/${oldFileName}`, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
  
  delete(item:number): Observable<ReferensiTemplate> {
    return this.http
        .delete(this.url + `/${item}`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }

  upload(item: any): Observable<any> {
    return this.http
        .post(this.url + `/Upload`, item)
        .map((resp: Response) => resp.json())
        .catch((error: any) => Observable.throw(error));
  }

  checkTemplate(id: number): Observable<boolean>{
    console.log(this.url + `/CheckTemplate/`+id);
    return this.http
      .get(this.url + `/CheckTemplate/`+id)
      .map((response: Response) => response.json())
      //.catch((error: any) => Observable.throw(error.json()));
  }
}
