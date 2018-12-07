import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Pemohon } from '../models/pemohon';

@Injectable()
export class PemohonService {
    apiUrl: string = "api/Pemohon";
    apiRefUrl: string = "api/Ref";

    constructor(private http: Http) { }

    getAll(): Observable<Pemohon[]> {
        return this.http
            .get(this.apiUrl)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    //` get all need verification
    getAllVerification(): Observable<Pemohon[]> {
        return this.http
            .get(this.apiUrl + '/Verification')
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    //~ view detail by npwp
    getById(id: string): Observable<Pemohon> {
        return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
    }

    register(item: any): Observable<any> {
        return this.http
            .post(this.apiUrl + '/Register', item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error));
    }

    add(item: Pemohon): Observable<any> {
        return this.http
            .post(this.apiUrl, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error));
    }

    verify(item: Pemohon): Observable<Pemohon> {
        return this.http
            .put(this.apiUrl + '/Verify/' + `${item.PemohonId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    unverify(item: Pemohon): Observable<Pemohon> {
        return this.http
            .put(this.apiUrl + '/Unverify/' + `${item.PemohonId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    update(item: Pemohon): Observable<Pemohon> {
        return this.http
            .put(this.apiUrl + `/Update/${item.PemohonId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    sverify(item: Pemohon): Observable<string> {
        return this.http
            .put(this.apiUrl + `/SVerify/${item.PemohonId}`, item)
            .map((resp: Response) => resp.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    // delete(item: Pemohon): Observable<Pemohon> {
    //   return this.http
    //     .delete(this.apiUrl + `/${item.PemohonId}`)
    //     .map((response: Response) => response.json())
    //     .catch((error: any) => Observable.throw(error.json()));
    // }

    //~ check file: true => valid size 10MB, type, mime
    checkFile(fileToUpload: any) {
        //~ type
        let whiteListType = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "application/pdf"
        ];
        //~ if not found, return -1
        if (whiteListType.indexOf(fileToUpload.type) == -1) {
            return false;
        }

        //~ name
        let whiteListName = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "bmp",
            "pdf"
        ];

        let fileToUploadExt = fileToUpload.name.toLowerCase().split('.').pop();
        //~ if not found, return -1
        if (whiteListName.indexOf(fileToUploadExt) == -1) {
            return false;
        }

        //~ size
        let fileSize = 10 * 1024 * 1024;
        if (fileToUpload.size > fileSize) {
            return false;
        }
        return true;
    }

    //~ ref controller

    // fungsi get provinsi
    getProvinsi(): Observable<any> {
        return this.http
            .get(this.apiRefUrl + '/GetProvinsi')
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    // fungsi get kota by id
    getKotaById(id: number): Observable<any> {
        return this.http
            .get(this.apiRefUrl + `/GetKotaByID/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    // fungsi get kota by id
    GetKotaByName(k: string): Observable<any> {
        return this.http
            .get(this.apiRefUrl + `/GetKotaByName?k=${k}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    // fungsi get provinsi by id
    getProvinsiById(id: number): Observable<any> {
        return this.http
            .get(this.apiRefUrl + `/GetProvinsiByID/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    // fungsi get kota by provinsi
    getKotaByProvinsi(id: number): Observable<any> {
        return this.http
            .get(this.apiRefUrl + `/GetKotaByProvinsiID/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
}