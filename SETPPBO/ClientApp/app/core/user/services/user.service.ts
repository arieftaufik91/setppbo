
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { User } from "../models/user";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {

    constructor(private http: Http) { }

    getUsers(): Observable<User[]> {
        const url = `api/UserRole`;
        
        return this.http.get(url)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getUserByPegawaiId(id: string=''): Observable<User> {
        const url = `api/UserRole/${id}`;
        return this.http.get(url)
            .map(response => response.json() as User);
    }

    postUserRoles(user: User): Observable<User> {
        const url = `api/UserRole`;
        return this.http.post(url, user)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    postUserSuspend(user: User): Observable<User> {
        const url = `api/UserRole`;
        return this.http
            .post(url + `/Suspend`, user)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error));
    }
}