import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { BaseCrudService } from "../../../../shared/services/base-crud-service";
import { DataPermohonan } from '../../models/data-permohonan';
import { DataTandaTerimaPermintaan } from '../../models/data-tanda-terima-permintaan';



@Injectable()
export class AdministrasiBandingGugatanService extends BaseCrudService{

	urlApi: string = 'api/AdministrasiBandingGugatan';
	constructor(http: Http) {
		super('api/AdministrasiBandingGugatan', http);
	}

	// fungsi get base URL untuk download
	getBaseUrl(): Observable<any> {
		return this.http
		  .get(this.urlApi + `/GetBaseURL`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	// fungsi get base URL untuk download
	getRefTtd(): Observable<any> {
		return this.http
		  .get(this.urlApi + `/GetRefTtd`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	// fungsi get provinsi
	getProvinsi(): Observable<any> {
		return this.http
		.get(this.urlApi + '/GetProvinsi')
		.map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	// fungsi get kota by id
	getKotaById(id: number): Observable<any> {
		return this.http
		  .get(this.apiUrl + `/GetKotaByID/${id}`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	// fungsi get provinsi by id
	getProvinsiById(id: number): Observable<any> {
		return this.http
		  .get(this.apiUrl + `/GetProvinsiByID/${id}`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	// fungsi get kota by provinsi
	getKotaByProvinsi(id: number): Observable<any> {
		return this.http
		  .get(this.apiUrl + `/GetKotaByProvinsiID/${id}`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	// fungsi update RefStatusId saat cetak
	updateStatus(item: DataTandaTerimaPermintaan): Observable<DataTandaTerimaPermintaan> {
		return this.http
		  .put(this.apiUrl +`/UpdateStatusCetak/${item.PermohonanId}`, item)
		  .map((response: Response) => response.json());
		  //.catch((error: any) => Observable.throw(error.json()));
	}

	//fungsi getTermohon
	getDataTermohon(): Observable<any> {
		return this.http
		.get(this.urlApi + '/GetDataTermohon')
		.map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}
}
