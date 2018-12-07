import { Injectable } from '@angular/core';
import { BaseCrudService } from '../../../../shared/services/base-crud-service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataPenyampaian } from '../../models/data-penyampaian';
import { PenyampaianSalinanBantahan } from '../../models/penyampaian-salinan-bantahan';

@Injectable()
export class PenyampaianSalinanBantahanService extends BaseCrudService{
  apiUrl: string = 'api/AdministrasiBandingGugatan/PenyampaianSalinan';
	constructor(http: Http) {
		super('api/AdministrasiBandingGugatan/PenyampaianSalinan', http);
	}
	// overload base crud service
	update(item: DataPenyampaian): Observable<DataPenyampaian> {
    return this.http
      .put(this.apiUrl +`/UpdateSalinanBantahan/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
	}
	
	// fungsi get latest nomer permintaan bantahan di ABG
	getLatestPenyampaianSalinan(tipe: number): Observable<any> {
		return this.http
		  .get(this.apiUrl + `/GetLatestPenyampaianSalinanAbg/${tipe}`)
		  .map((response: Response) => response.json())
		  .catch((error: any) => Observable.throw(error.json()));
	}

	updateDataTermohon(item: PenyampaianSalinanBantahan): Observable<DataPenyampaian> {
    return this.http
      .put(this.apiUrl +`/UpdateDataTermohonAbg/${item.PermohonanId}`, item)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
	}
}
