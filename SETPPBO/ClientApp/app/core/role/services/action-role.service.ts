import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { IRoleAction } from "../../../shared/models/action-model";

@Injectable()
export class ActionRoleService {
  constructor(private http: Http) {}

  getAll(): Observable<any[]> {
    const url = "api/ActionRole";
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  post(aRole: IRoleAction): Observable<any> {
    const url = "api/ActionRole";
    return this.http
      .post(url, aRole)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getSystemController(): Observable<any[]> {
    const url = "api/ActionRole";
    return this.http
      .get(url + "/1")
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}
