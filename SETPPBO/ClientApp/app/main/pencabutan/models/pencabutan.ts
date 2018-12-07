export interface Pencabutan {
    NoKep:string;
    PermohonanId: string;
    PemohonId: string;
    NoSengketa: string;
    NoSuratPermohonan: string;
    TglSuratPermohonan: Date;
    TglTerimaPermohonan: Date;
    Nama: string;
    NoSuratPencabutan: string;
    TglSuratPencabutan: Date;
    TglTerimaPencabutan: Date;
    TglKirimPencabutan: Date;
    RefCaraKirimPencabutanId: number;
    FilePencabutan: string;
    NPWP: string;
    //ValidatorPencabutanId: number;
    TglValidasiPencabutan: Date;
    NoPendaftaran: string;
    Uraian:string;
}
