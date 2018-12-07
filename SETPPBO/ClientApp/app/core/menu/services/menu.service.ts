import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { IMenuItemModel } from "../../../shared/models/menu-item";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Http, Response } from "@angular/http";
import { IResultModel } from "../../../shared/models/result-model";

@Injectable()
export class MenuService {
  constructor(private http: Http) {}

  getMenus(): Observable<IMenuItemModel[]> {
    const url = "api/Menu/";

    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getAllMenus(): Observable<IMenuItemModel[]> {
    const url = "api/Menu/-1";
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getSysMenuById(id: number): Observable<IMenuItemModel> {
    const url = "api/Menu/" + id;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  putSysMenu(sMenu: IMenuItemModel): Observable<IResultModel> {
    const url = "api/Menu/" + sMenu.MenuId;
    return this.http
      .put(url, sMenu)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  postSysMenu(sMenu: IMenuItemModel): Observable<IResultModel> {
    const url = "api/Menu";
    return this.http
      .post(url, sMenu)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  deleteSysMenu(sMenu: IMenuItemModel): Observable<IMenuItemModel> {
      const url = "api/Menu/" + sMenu.MenuId;
      return this.http.delete(url).map((response: Response) => response.json()).catch((error: any) => Observable.throw(error.json()));
  }
}
