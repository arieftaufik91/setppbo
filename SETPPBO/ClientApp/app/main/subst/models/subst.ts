export interface Subst {
    PermohonanId: string;

    //tampilan list
    NoSuratPermohonan: string;
    TglSuratPermohonan: Date;
    PemohonId: string; 
    TextPemohonName: string; 
    RefJenisPermohonanId: number;
    TextRefJenisPermohonanUr: string;

    //input   
    NoSengketa: string; 
    NoSubSt: string;
    TglSubSt: Date;
    TglTerimaSubSt: Date;
    TextRefCaraKirimSubStUr: string;  
    RefCaraKirimSubStId: number;
    TglKirimSubSt: Date;
    PerekamSubStId: number;      
    NamaPengirimSubSt: string;
    AlamatPengirimSubSt:string;
    KotaPengirimSubSt: string;
    KodePosPengirimSubSt: string;
    TglTerimaAbgSubSt: Date;
    FilePdfSubSt: string;
    FileDocSubSt: string;
    RefStatusId: number;
    TahunMasuk: number;

    NamaTermohon: string,
    OrganisasiId: number,
    NamaUpTermohon: string,
    AlamatTermohon: string,
    KotaTermohon: string,
    
}


