import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CommonService {
  constructor(public http: HttpClient) { }

  getAll(apiUrl: string): Observable<any[]> {
    return this.http.get<any[]>(apiUrl);
  }

  getById(apiUrl: string , id: string = ''): Observable<any> {
    return this.http.get<any>(apiUrl + `/${id}`);
  }

  post(apiUrl: string , item: any): Observable<any> {
    return this.http.post(apiUrl, item);
  }

  update(apiUrl: string , id: string = '', item: any): Observable<any> {
    return this.http.put<any>(apiUrl + `/${id}`, item);
  }

  delete(apiUrl: string, id: string = ''): Observable<any> {
    return this.http.delete<any>(apiUrl + `/${id}`);
  }
}
