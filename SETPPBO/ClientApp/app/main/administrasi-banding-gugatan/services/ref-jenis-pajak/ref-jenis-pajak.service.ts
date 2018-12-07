import { Injectable } from '@angular/core';
import { BaseCrudService } from "../../../../shared/services/base-crud-service";
import { Http } from "@angular/http";

@Injectable()
export class RefJenisPajakService extends BaseCrudService{
  urlApi: string = 'api/RefJenisPajak';
  constructor(http: Http) {
    super('api/RefJenisPajak', http);
   }
}
