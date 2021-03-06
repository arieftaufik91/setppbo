export interface RefPermohonan {
    PermohonanId:number;
    RefJenisPermohonanId: number;
    RefJenisPermohonanUr: string;
    PemohonId: number;
    PemohonName: string;
    PemohonNPWP: string;
    NoSuratPermohonan:string;
    TglSuratPermohonan:Date;
    RefJenisPajakId: number;
    RefJenisPajakUr: string;
    NoKep: string;
    TglKep:Date;
    TglTerimaKep:Date;
    NoSkp:string;
    TglSkp:Date;
    TglTerimaPermohonan:Date;
    TglKirimPermohonan:Date;
    RefCaraKirimPermohonanId: number;
    RefCaraKirimPermohonanUr: string;
    TglPos: Date;
    Npwp: string;
    NoSengketa: string;
    NoPendaftaran: string;
    MasaPajakAwalBulan: number;
    MasaPajakAkhirBulan: number;
    MasaPajakAwalTahun: number;
    RefStatusId: number;
    RefJenisPemeriksaanId: number;
    RefPembagianBerkasId: number;
    Sdtk: number;
    FilePdfSuratPermohonan: string;
    FileDocSuratPermohonan: string;
    FilePdfObjekSengketa: string;
    FilePdfBuktiBayar: string;
    FilePdfSkk: string;
    FilePdfSkp: string;
    isFilePdfSuratPermohonan: boolean;
    isFileDocSuratPermohonan: boolean;
    isFilePdfObjekSengketa: boolean;
    isFilePdfBuktiBayar: boolean;
    isFilePdfSkk: boolean;
    isFilePdfSkp: boolean;
    AktaPerusahaan: string;
    Checklist1: number;
    Checklist2: number;
    Checklist3: number;
    Checklist4: number;
    SyaratFormal: number;
    
}
