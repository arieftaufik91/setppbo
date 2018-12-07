import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Pencabutan } from '../models/pencabutan';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReferensiTemplate } from '../../referensi/models/referensi-template';

@Injectable()
export class PencabutanService {
  apiUrl: string = "api/Pencabutan";

  constructor(private http: Http) { }

  // get daftar permohonan untuk Perekaman Pencabutan
  getAllDaftarPermohonan(): Observable<Pencabutan[]> {
    return this.http
        .get(this.apiUrl + '/DaftarPencabutan')
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }

  // get daftar permohonan untuk Validasi Pencabutan
  getAllDaftarPermohonanForValidasi(): Observable<Pencabutan[]> {
    return this.http
        .get(this.apiUrl + '/DaftarPencabutanForValidasi')
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }
  
  // get detail permohonan (berlaku untuk Perekaman Pencabutan dan Validasi Pencabutan)
  getDetailPermohonan(id: string): Observable<any> {
    return this.http
      .get(this.apiUrl + `/DetailPermohonan` + `/${id}`)
      .map(response => response.json());
  }

  // fungsi update Tabel Permohonan dengan mengupdate kolom pencabutan
  addPencabutan(item: Pencabutan): Observable<Pencabutan> {
    return this.http
      .put(this.apiUrl +`/UpdatePencabutan/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  cetak(item: Pencabutan): Observable<Pencabutan>{
    return this.http
      .post(this.apiUrl + `/CetakTandaTerima`, item)
      .map(response => response.json())
      .catch((error: any) => Observable.throw(error));
  }

  getTemplate(id: number): Observable<ReferensiTemplate>{
    return this.http
      .get(`api/RefTemplate` + `/${id}`)
      .map(response => response.json());
  }

  getDetailPencabutan(PermohonanId: string): Observable<any> {
    return this.http
        .get(this.apiUrl + '/Detail' + `/${PermohonanId}`)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
  }

  deletePencabutan(item: Pencabutan): Observable<Pencabutan> {
    return this.http
      .put(this.apiUrl +`/DeletePencabutan/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  
}
