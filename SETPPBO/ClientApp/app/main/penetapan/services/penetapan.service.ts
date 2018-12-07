import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Penetapan } from "../models/penetapan";
import { Refkota } from '../models/refkota'
import { Nomortap } from '../models/nomortap'

@Injectable()
export class PenetapanService {
  apiUrl: string = "api/Penetapan";
  apiUrlPenetapan:string ="/DaftarPenetapan/";
  apiUrlPenetapanPencabutan:string = "/DaftarPenetapanPencabutan/"
  apiUrlSengketa:string ="/DaftarSengketa";
  apiUrlSengketaPencabutan:string = "/DaftarSengketaPencabutan";
  apiUrlSengketaEdit:string ="/DaftarSengketaEdit";
  apiUrlAdd:string = "/AddPenetapan";
  apiUrlAddCabut:string = "/AddPenetapanPencabutan";
  apiUrlDelete:string = "/DeletePenetapan";
  apuUrlPenetapan :number = 1
  apiUrlConfig = "api/RefConfig/10";
  
  constructor(private http: Http) { }

getPenetapan():Observable<Penetapan[]>{
  return this.http.get(this.apiUrl + this.apiUrlPenetapan + this.apuUrlPenetapan).map(response => response.json());
}

getPenetapanAC():Observable<Penetapan[]>{
  return this.http.get(this.apiUrl + "/DaftarPenetapanAC/" + this.apuUrlPenetapan).map(response => response.json());
}

getDaftarBerkas():Observable<any[]>{
  return this.http.get(this.apiUrl + this.apiUrlSengketa).map(response => response.json());
}
getDaftarBerkasAC():Observable<any[]>{
  return this.http.get(this.apiUrl + "/DaftarSengketaAC").map(response => response.json());
}

getUrlCetak():Observable<any>{
  return this.http.get(this.apiUrlConfig).map(response => response.json());
}

getKotaPenetapan():Observable<any[]>{
  return this.http.get(this.apiUrl + "/DaftarKotaPenetapan").map(response=> response.json());
}

getNomorTerakhir():Observable<string>{
  return this.http.get(this.apiUrl + "/GetNomorPenetapan").map(response=> response.json());
}

getBaseUrl():Observable<string>{
  return this.http.get(this.apiUrl + "/BaseUrl").map(response=> response.json());
}

getPenetapanEdit(id: string = ""): Observable<Penetapan> {
  return this.http.get(this.apiUrl + `/DaftarPenetapanEdit/${id}`)
  .map(response => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}
getDaftarBerkasEdit(id: string = ""):Observable<any[]>{
  return this.http.get(this.apiUrl + `/DaftarSengketaEdit/${id}`).map(response => response.json());
}

getDaftarBerkasEditAC(id: string = ""):Observable<any[]>{
  return this.http.get(this.apiUrl + `/DaftarSengketaEditAC/${id}`).map(response => response.json());
}
getAll(): Observable<Penetapan[]> {
    return this.http
        .get(this.apiUrl)
        .map((response: Response) => response.json())
        .catch((error: any) => Observable.throw(error.json()));
}  
getById(id: string = ""): Observable<Penetapan> {
  return this.http.get(this.apiUrl + `/GetPenetapanById/${id}`)
  .map(response => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}

add(item: Penetapan): Observable<any> {
  return this.http
      .post(this.apiUrl + this.apiUrlAdd, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
}

addPenetapan(item: Penetapan): Observable<any> {
  return this.http
      .post(this.apiUrl + this.apiUrlAdd, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
}

update(id:string,item: Penetapan): Observable<Penetapan> {
  return this.http
      .put(this.apiUrl + `/UpdatePenetapan/${id}`, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error.json()));
}

updatedetele(id:string):Observable<any>{
  return this.http
  .delete(this.apiUrl + `/UpdatePenetapanDelete/${id}`)
  .map((response: Response) => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}

delete(id:string): Observable<Penetapan> {
  return this.http
      .delete(this.apiUrl + this.apiUrlDelete + `/${id}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}

cetak(id: string): Observable<any>{
  return this.http
  .get(this.apiUrl + `/CetakPenetapan` + `/${id}`)
  .map((response: Response) => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}

getJenisSengketa(id: string): Observable<any>{
  return this.http
  .get(this.apiUrl + `/JenisSengketa` + `/${id}`)
  .map((response: Response) => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}

//Pencabutan

getPenetapanPencabutan():Observable<Penetapan[]>{
  return this.http.get(this.apiUrl + this.apiUrlPenetapanPencabutan + this.apuUrlPenetapan).map(response => response.json());
}

gerDaftarBerkasPencabutan():Observable<any[]>{
  return this.http.get(this.apiUrl + this.apiUrlSengketaPencabutan).map(response => response.json());
}

addCabut(item: Penetapan): Observable<Penetapan[]> {
  return this.http
      .post(this.apiUrl + this.apiUrlAddCabut, item)
      .map((resp: Response) => resp.json())
      .catch((error: any) => Observable.throw(error));
}

getNomorCabutTerakhir():Observable<string>{
  return this.http.get(this.apiUrl + "/GetNomorPenetapanPencabutan").map(response=> response.json());
}

getDaftarBerkasEditCabut(id: string = ""):Observable<any[]>{
  return this.http.get(this.apiUrl + `/DaftarSengketaEditCabut/${id}`).map(response => response.json());
}

getDaftarBerkasDeleteCabut(id: string = ""):Observable<any[]>{
  return this.http.get(this.apiUrl + `/DaftarSengketaDeleteCabut/${id}`).map(response => response.json());
}

updateSengketaCabutDelete(id:string,item: Penetapan):Observable<any>{
  return this.http
  .delete(this.apiUrl + `/UpdatePenetapanPencabutanDelete/${id}`)
  .map((response: Response) => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}

getBaseUrlCabut():Observable<string>{
  return this.http.get(this.apiUrl + "/BaseUrlCabut").map(response=> response.json());
}

getTermohon(id: string = ""):Observable<any[]>{
  return this.http.get(this.apiUrl + `/getTermohon/${id}`).map(response=> response.json());
}

deletePencabutan(id:string): Observable<Penetapan> {
  return this.http
      .delete(this.apiUrl + `/DeletePenetapanPencabutan/${id}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
}

updatedeletecabut(id:string):Observable<any>{
  return this.http
  .delete(this.apiUrl + `/UpdatePenetapanPencabutanDelete/${id}`)
  .map((response: Response) => response.json())
  .catch((error: any) => Observable.throw(error.json()));
}
}