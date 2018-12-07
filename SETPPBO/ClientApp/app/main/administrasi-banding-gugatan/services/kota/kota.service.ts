import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { BaseCrudService } from '../../../../shared/services/base-crud-service';


@Injectable()
export class KotaService extends BaseCrudService {

	urlApi: string = 'api/Kota';
	constructor(http: Http) {
		super('api/Kota', http);
	}

	getAllProvinsi(): Observable<any> {
        return this.http
            .get(this.apiUrl+'/GetProvinsi')
            .map((response: Response) => response.json());
    }

}  
  