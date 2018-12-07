import { Injectable } from '@angular/core';
import { Permohonan } from '../../permohonan/models/permohonan';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable()
export class BerkasSiapSidangService {
  apiUrl: string = "Api/distribusi/berkasSiapSidang";
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  EXCEL_EXTENSION = '.xlsx';

  constructor(private http: Http) { }

  getBerkasSiapSidang(): Observable<any[]>{
    return this.http
    .get(this.apiUrl)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }

  getDaftarSiapSidang(ids: string[]): Observable<any[]> {
    return this.http
    .post(this.apiUrl + '/DaftarSiapSidang/DaftarCetak', ids)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
}

private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + this.EXCEL_EXTENSION);
}
}
