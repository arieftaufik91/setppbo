import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { BaseCrudService } from "../../../../shared/services/base-crud-service";
import { PermintaanBantahan } from "../../models/permintaan-bantahan/permintaan-bantahan";
import { DataPemohon } from '../../models/data-pemohon';

@Injectable()
export class PermintaanBantahanService extends BaseCrudService{
	urlApi: string = 'api/AdministrasiBandingGugatan/PermintaanBantahan';
	constructor(http: Http) {
		super('api/AdministrasiBandingGugatan/PermintaanBantahan', http);
	}

	// fungsi get latest nomer permintaan bantahan di ABG
	getLatestNoPermintaanBantahan(tipe: number): Observable<any> {
		return this.http
		  .get(this.urlApi + `/GetLatestPermintaanBantahanAbg/${tipe}`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	 // fungsi update Data Pemohon pada Permintaan Bantahan
	 updateDataPemohon(item: DataPemohon): Observable<DataPemohon>{
		return this.http
		  .put(this.urlApi +`/UpdateDataPemohonAbg/${item.PemohonId}`, item)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	  }

	  updateSubSt(item: PermintaanBantahan): Observable<DataPemohon>{
		return this.http
		  .put(this.urlApi +`/UpdateDataSubSt/${item.PermohonanId}`, item)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	  }
}
