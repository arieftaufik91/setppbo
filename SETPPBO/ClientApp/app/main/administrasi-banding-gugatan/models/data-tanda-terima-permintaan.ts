export interface DataTandaTerimaPermintaan {
    //list
    PermohonanId: string;
    PemohonId: string;
    Nama: string;
    NoSubSt: string;
    NoSuratPermintaanBantahan: string;
    NoSuratBantahan: string;
    NoSuratPermintaanSalinan: string;
    RefStatusId: number;

    //form
    NoSengketa: string;
    RefJenisKetetapanId: number;
    NoTandaTerimaSubSt: string;
    TglTandaTerimaSubSt: Date;
    NoSuratPermintaanSubSt: string;
    TglSuratPermintaanSubSt: Date;
    TglTerimaAbgPermohonan: Date;
    RefTermohonId: number;
    NamaTermohon: string;
    RefUpTermohonId: number;
    NamaUpTermohon: string;
    AlamatTermohon: string;
    KotaTermohon: string;
    RefTtdTandaTerimaId: number;
    RefTtdPermintaanSubStId: number;
    
    // form edit permohonan
    NPWP: string;
    AlamatPemohon: string;
    RefKotaId: number;
    KotaPemohon: string;
    KodePos: string;
    AlamatKoresponden: string;
    RefKotaKorespondenId: number;
    KotaKoresponden: string;
    KodePosKoresponden: number;
    NoSuratPermohonan: string;
    TglSuratPermohonan: Date;
    NoKep: string;
    TglKep: Date;
    JenisPajakId: number;
    JenisPajak: string;
    MasaPajakAwalTahun: number;
    MasaPajakAwalBulan: number;
    MasaPajakAkhirTahun: number;
    MasaPajakAkhirBulan: number;
    NoSkp: string;
    TglSkp: Date;
}
