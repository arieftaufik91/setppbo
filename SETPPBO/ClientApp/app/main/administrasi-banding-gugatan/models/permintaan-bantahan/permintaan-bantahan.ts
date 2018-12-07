export class PermintaanBantahan {
    PermohonanId: string;
    NoSengketa: string;
    NoSuratPermintaanBantahan: string;
    TglSuratPermintaanBantahan: Date;
    RefTtdPermintaanBantahanId: number;
    RefStatusID: number;
    // PemohonId: string;

    NoSubSt: string;
    TglSubSt: Date;
    NoSuratPermohonan: string;
    TglSuratPermohonan: Date;

    Pemohon: Pemohon = new Pemohon;
}

export class Pemohon {
    PemohonId: string;
    Nama: string;
    Alamat: string;
    RefKotaId: number;
    Kota: string;
    KodePos: string;
}

export class Kota {  
    $id: number;  
    IDRefKota: number;
    NamaKota: string;
    IDRefProvinsi: number;
}

export class Provinsi {
    $id: number;
    IDRefProvinsi: number;
    NamaProvinsi: string;
}