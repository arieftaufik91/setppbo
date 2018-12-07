export interface DataPermohonan {
    // data yang bisa di edit
    PermohonanId: string;
    NoSuratPermohonan: string;
    TglSuratPermohonan: Date;
    NoKep: string;
    TglKep: Date;
    RefJenisPajakId: number;
    MasaPajakAwalTahun: number;
    MasaPajakAwalBulan: number;
    MasaPajakAkhirBulan: number;
    NoSkp: string;
    TglSkp: Date;
}
