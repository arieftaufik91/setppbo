export interface ChartData{
    Pajak: Data;
    BeaCukai: Data;
    HakimTunggal: Data;
}

export interface Data{
    labels: string[];
    beban: number[];
    bebanPPh: number[];
}
