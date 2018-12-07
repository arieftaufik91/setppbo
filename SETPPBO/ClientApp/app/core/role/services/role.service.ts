import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, Response } from "@angular/http";
import { RoleClass, IRole } from "../../user/models/role";

@Injectable()
export class RoleService {
  constructor(private http: Http) {}

  getAll(): Observable<any[]> {
    const url = "api/Role";

    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  postRole(role: RoleClass): Observable<any> {
    const url = "api/Role";

    return this.http
      .post(url, role)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  putRole(role: IRole): Observable<any> {
      const url = 'api/Role';

      return this.http.put(url, role).map((resp: Response) => resp.json()).catch((error: any) => Observable.throw(error.json()));
  }

  deleteRole(role: RoleClass): Observable<any> {
    const url = `api/Role/${role.RoleId}`;

    return this.http
      .delete(url)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<any> {
    const url = `api/Role/${id}`;
    return this.http.get(url).map(response => response.json());
  }
}