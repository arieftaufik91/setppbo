import { Injectable } from '@angular/core';
import { BaseCrudService } from "../../../../shared/services/base-crud-service";
import { Http } from "@angular/http";

@Injectable()
export class ProsesSidangService extends BaseCrudService{
  apiUrl: string = "api/Sengketa/ProsesSidang";
  constructor(http: Http) {
    super('api/Sengketa/ProsesSidang', http);
   }
}
