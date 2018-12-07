import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { DashboardList } from '../../dashboard/models/dashboard-list';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ChartData } from '../models/chartData';

@Injectable()
export class DistribusiService {

  apiUrl: string = "Api/Distribusi";
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  EXCEL_EXTENSION = '.xlsx';

    constructor(private http: Http) { }

    getStatistikBerkas(): Observable<ChartData> {
        return this.http
            .get(this.apiUrl + `/Dashboard`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getBerkasSiapSidang(): Observable<any[]> {
        return this.http
            .get(this.apiUrl + `/BerkasSiapSidang`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getBerkasSiapSidangServerSide(data: any): Observable<any> {
        return this.http
            .post(this.apiUrl + `/BerkasSiapSidangServerSide`, data)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getBerkasSudahDistribusi(): Observable<any[]> {
        return this.http
            .get(this.apiUrl + `/Rekap`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getBerkasSudahDistribusiServerSide(data: any): Observable<any> {
        return this.http
            .post(this.apiUrl + `/RekapServerSide`, data)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getDaftarCetakDistribusi(ids: string[]): Observable<any[]> {
        return this.http
            .post(this.apiUrl + `/DaftarCetak`, ids)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    prosesDistribusi(listPermohonan: any[]): Observable<any> {
        return this.http
            .post(this.apiUrl, listPermohonan)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    prosesRedistribusi(listPermohonan: any[]): Observable<any> {
        return this.http
            .post(this.apiUrl + `/Ulang`, listPermohonan)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getDetailBerkas(id: string): Observable<any> {
        return this.http
            .get(this.apiUrl + `/Detail` + `/${id}`)
            .map(response => response.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    getListMajelis(filterOn: boolean, permohonan: any): Observable<any[]> {
        return this.http
          .put(`/Api/RefMajelis/Filter` + `/${filterOn}`, permohonan)
          .map(response => response.json())
          .catch((error: any) => Observable.throw(error.json()));
    }

    getListAlasan(): Observable<any> {
        return this.http
            .get(`/Api/RefAlasan/Active`) 
            .map(response => response.json())
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
