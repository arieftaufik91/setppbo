import { Data } from "../../distribusi/models/chartData";

export interface Bantahan {
    NoSuratPermohonan: String;
    NoSengketa: String;
    NoSubSt: String;
    TglSubSt: Date;
    NoSuratBantahan: String;
    TglSuratBantahan: Date;
    PermohonanId: string;
    FilePdfBantahan : string;
    FileDocBantahan : string;
    RefCaraKirimBantahanId: number;
    UraianCaraKirimBantahan: string;
    TextRefJenisPermohonanUr : string;
    TglTerimaAbgBantahan: Date;
    TglTerimaBantahan: Date;
    ValidatorBantahanId: Number;
    TglValidasiBantahan: Date;
    TahunMasuk : Date;
    PemohonId :string;
    TglKirimBantahan :Date;
}
