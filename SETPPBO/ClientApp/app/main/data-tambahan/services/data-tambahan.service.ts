import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import { DataTambahanPermohonan } from "../models/data-tamabahan-permohonan";
import { DataTambahanSuratPengantar } from "../models/data-tambahan-surat-pengantar";
import { DataTambahanEntry } from '../models/data-tambahan-entry';
import { DataTambahanEntry2 } from '../models/data-tambahan-entry2';
import { DataTambahanTT} from '../models/data-tambahan-tt';
import { retry } from 'rxjs/operator/retry';
@Injectable()
export class DataTambahanService {
    apiUrl: string = "api/DataTambahan";
    apiUrlTT:string = 'api/datatambahan/cetak';
    apiUrlCetak : string = "api/datatambahan/cetak";
  constructor(private http: Http) { }
  getAll(): Observable<DataTambahanPermohonan[]> {
    return this.http
        .get(this.apiUrl + '/Permohonan')
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }

  getByPaging(data: any): Observable<any> {
    return this.http
        .post(this.apiUrl + `/Paging`, data)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
 }

  getDataTambahan(id: string): Observable<DataTambahanSuratPengantar[]> {
  return this.http
      .get(this.apiUrl + `/${id}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }  

  add(item: DataTambahanEntry): Observable<any> {
  return this.http
      .post(this.apiUrl, item)
     .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
  }

  getPermohonanId(id: string): Observable<DataTambahanSuratPengantar> {
    return this.http
        .get(this.apiUrl + `/${id}`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
    } 
    
    getDetailDataTambahan(suratPengantarId: string): Observable<any> {
        return this.http
            .get(this.apiUrl + '/Detail' + `/${suratPengantarId}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
    
    /*downloadFile(fileName: string, filePath: string): Observable<any> {
        return this.http
            .put("/api/DownloadFile" + `/${fileName}`, filePath)
            .catch((error: any) => Observable.throw(error.json()));
    }

    downloadFile(fileName: string, filePath: string) {
        let options = new RequestOptions({responseType: ResponseContentType.Blob });
        return this.http
            .put("/api/DownloadFile" + `/${fileName}`, filePath, options)
            .subscribe(response => {
            });
    }*/
  
    gettandaterima(id: string): Observable<DataTambahanTT> {
        return this.http
            .get(this.apiUrlTT  + `/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }  

    getcetak(id:string):Observable<any>{
        return this.http
                .get(this.apiUrlCetak + `/${id}`)
                
                .catch((error: any) => Observable.throw(error.json()));
    }

    getcetak1(){
        return this.http.post(this.apiUrlCetak,  {responseType: 'blob'})
        .map(response => (<Response>response).blob())
     
      }


      getAllDataTambahanForValidasi(): Observable<any[]> {
        return this.http
            .get(this.apiUrl + '/DaftarDataTambahanForValidasi')
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
      }

      addDataTambahan(item:DataTambahanEntry2): Observable<DataTambahanEntry2> {
        return this.http
          .put(this.apiUrl +`/UpdateDataTambahan/${item.SuratPengantarId}`, item)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
      }

      delete(item:string): Observable<any> {
        return this.http
            .delete(this.apiUrl + `/${item}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
      }
        
       
     

    
}
