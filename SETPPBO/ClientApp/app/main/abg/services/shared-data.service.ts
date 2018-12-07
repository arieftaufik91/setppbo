import { Injectable } from '@angular/core';
import { TandaTerimaSubst } from '../models/tanda-terima-subst/tanda-terima-subst';
import { RefTtd } from '../../administrasi-banding-gugatan/models/ref-ttd';

@Injectable()
export class SharedDataService {
  private sharedData: string; // share permohonanid
  private tipePermohonan: number; // 1: Banding; 2: Gugatan
  private downloadBaseUrl: string; // base url untuk API
  private refTtd: RefTtd[];

  constructor() { }

  setData(data:string){
    this.sharedData = data;
  }

  getData(){
    return this.sharedData;
  }

  setTipe(tipe: number){
    this.tipePermohonan = tipe;
  }

  getTipe(){
    return this.tipePermohonan;
  }

  setURL(url: string){
    this.downloadBaseUrl = url;
  }

  getURL(){
    return this.downloadBaseUrl;
  }

  setRefTtd(ref: RefTtd[]){
    this.refTtd = ref;
  }

  getRefTtd(){
    return this.refTtd;
  }
}
