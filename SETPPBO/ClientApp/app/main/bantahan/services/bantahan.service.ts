import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Bantahan } from '../models/bantahan';

@Injectable()
export class BantahanService {
apiUrl: string="api/Bantahan";
apiBaseUrl: string = 'api/AdministrasiBandingGugatan';
constructor(private http : Http) { }

// get daftar permohonan untuk Perekaman Bantahan
getDaftarBantahan(): Observable<Bantahan[]> {
  return this.http
      .get(this.apiUrl+'/DaftarBantahan')
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}

// get daftar permohonan untuk Validasi Bantahan
getAllDaftarBantahanValidasi(): Observable<Bantahan[]> {
  return this.http
      .get(this.apiUrl + '/DaftarBantahanValidasi')
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}

deleteBantahan(id: any, item: Bantahan): Observable<Bantahan> {
  return this.http
      .put(this.apiUrl + `/DeleteBantahan` + `/${id}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json())); 
}

getById(id: string = ""): Observable<Bantahan> {
  return this.http.get(this.apiUrl + `/${id}`).map(response => response.json());
}

addBantahan(item: Bantahan): Observable<Bantahan> {
  return this.http
    .put(this.apiUrl +`/UpdateBantahan/${item.PermohonanId}`, item)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
}

// get detail bantahan (untuk melihat detail permohonan)
getDetailBantahan(id: string): Observable<any> {
  return this.http
    .get(this.apiUrl + `/DetailPermohonan` + `/${id}`)
    .map(response => response.json());
    
}
kirim(item: Bantahan): Observable<Bantahan> {
  return this.http
    .put(this.apiUrl +`/kirimbantahan/${item.PermohonanId}`, item)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
} 
update(item: Bantahan): Observable<Bantahan> {
  return this.http
      .put(this.apiUrl + `/${item.PermohonanId}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
}

getBaseUrl(): Observable<any> {
  return this.http
      .get(this.apiBaseUrl + `/GetBaseURL`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}
validasiBantahan(id: any, item: Bantahan): Observable<Bantahan> {
  return this.http
      .put(this.apiUrl + `/Validasi` + `/${id}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
}

}