import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TandaTerimaSubSt } from '../models/tanda-terima-sub-st';
import { PermintaanSubSt } from '../models/permintaan-sub-st';
import { DataPermohonan } from '../models/data-permohonan';
import { DataPemohon } from '../models/data-pemohon';
import { DataTandaTerimaPermintaan } from '../models/data-tanda-terima-permintaan';

@Injectable()
export class TandaTerimaPermintaanService {

  apiUrl: string = "api/AdministrasiBandingGugatan";

  constructor(private http: Http) { }

  /* getAll(): Observable<Permohonan[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  } */

  getAll(jenisPermohonan: number): Observable<any> {
    return this.http
      .get(this.apiUrl + `/${jenisPermohonan}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getById(id: string = ""): Observable<DataTandaTerimaPermintaan> {
    return this.http
      .get(this.apiUrl + `/DaftarTandaTerimaSubStById/${id}`)
      .map(response => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  updateTandaTerima(item: TandaTerimaSubSt): Observable<TandaTerimaSubSt> {
    return this.http
      .put(this.apiUrl +`/UpdateTandaTerimaAbg/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  updatePermintaan(item: PermintaanSubSt): Observable<PermintaanSubSt> {
    return this.http
      .put(this.apiUrl +`/UpdatePermintaanAbg/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // fungsi update Data Permohonan pada Tanda Terima & Permintaan Sub/St
  updateDataPermohonan(item: DataPermohonan): Observable<DataPermohonan> {
    return this.http
      .put(this.apiUrl +`/UpdateDataPermohonanAbg/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // fungsi update Data Pemohon pada Tanda Terima & Permintaan Sub/St
  updateDataPemohon(item: DataPemohon): Observable<DataPemohon>{
    return this.http
      .put(this.apiUrl +`/UpdateDataPemohonAbg/${item.PemohonId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // fungsi get latest nomer tanda terima sub st
  getLatestNoTandaTerima(tipe: number): Observable<any> {
    return this.http
      .get(this.apiUrl + `/GetLatestTandaTerimaAbg/${tipe}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  // fungsi get latest nomer permintaan sub st
  getLatestNoPermintaan(tipe: number): Observable<any> {
    return this.http
      .get(this.apiUrl + `/GetLatestPermintaanAbg/${tipe}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}
