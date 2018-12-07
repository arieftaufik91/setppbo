import { Injectable } from '@angular/core';
import { RefTtd } from '../models/ref-ttd';
import { Kota } from '../models/permintaan-bantahan/permintaan-bantahan';

@Injectable()
export class SharedDataService {
  private sharedData: string; // share permohonanid
  private tipePermohonan: number; // 1: Banding; 2: Gugatan
  private downloadBaseUrl: string; // base url untuk API
  private refTtd: RefTtd[];
  private provinsi: any;
  private acaraCepat: boolean;

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

  setProvinsi(prov: any){
    this.provinsi = prov;
  }
  getProvinsi(){
    return this.provinsi;
  }

  setAC(AC: boolean){
    this.acaraCepat = AC;
  }
  isAC(){
    return this.acaraCepat;
  }
}
