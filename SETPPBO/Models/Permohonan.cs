using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SETPPBO.Models
{
    public partial class Permohonan
    {
        public Permohonan()
        {
            DataTambahan = new HashSet<DataTambahan>();
            Kelengkapan = new HashSet<Kelengkapan>();
        }

        public string PermohonanId { get; set; }
        public int? RefJenisPermohonanId { get; set; }
        public string PemohonId { get; set; }
        public int? PegawaiId { get; set; }
        public string NoSuratPermohonan { get; set; }
        public DateTime? TglSuratPermohonan { get; set; }
        public int? RefJenisPajakId { get; set; }
        public string NoKep { get; set; }
        public DateTime? TglKep { get; set; }
        public DateTime? TglTerimaKep { get; set; }
        public string NoSkp { get; set; }
        public DateTime? TglSkp { get; set; }
        public string FilePdfSkp { get; set; }
        public DateTime? TglTerimaPermohonan { get; set; }
        public DateTime? TglKirimPermohonan { get; set; }
        public int? RefCaraKirimPermohonanId { get; set; }
        public DateTime? TglPos { get; set; }
        public string Npwp { get; set; }
        public string FileDocSuratPermohonan { get; set; }
        public string FilePdfSuratPermohonan { get; set; }
        public string NoSubSt { get; set; }
        public DateTime? TglSubSt { get; set; }
        public DateTime? TglTerimaSubSt { get; set; }
        public DateTime? TglKirimSubSt { get; set; }
        public int? RefCaraKirimSubStId { get; set; }
        public int? RefPengirimSubStId { get; set; }
        public string NamaPengirimSubSt { get; set; }
        public string AlamatPengirimSubSt { get; set; }
        public string KotaPengirimSubSt { get; set; }
        public string KodePosPengirimSubSt { get; set; }
        public DateTime? TglTerimaAbgSubSt { get; set; }
        public string FilePdfSubSt { get; set; }
        public string FileDocSubSt { get; set; }
        public int? PerekamSubStId { get; set; }
        public string NoSuratBantahan { get; set; }
        public DateTime? TglSuratBantahan { get; set; }
        public DateTime? TglTerimaBantahan { get; set; }
        public DateTime? TglKirimBantahan { get; set; }
        public int? RefCaraKirimBantahanId { get; set; }
        public DateTime? TglTerimaAbgBantahan { get; set; }
        public string FilePdfBantahan { get; set; }
        public string FileDocBantahan { get; set; }
        public int? PerekamBantahanId { get; set; }
        public string NoSuratPencabutan { get; set; }
        public DateTime? TglSuratPencabutan { get; set; }
        public DateTime? TglTerimaPencabutan { get; set; }
        public DateTime? TglKirimPencabutan { get; set; }
        public int? RefCaraKirimPencabutanId { get; set; }
        public string FilePencabutan { get; set; }
        public int? PerekamPencabutanId { get; set; }
        public int? ValidatorPermohonanId { get; set; }
        public DateTime? TglValidasiPermohonan { get; set; }
        public DateTime? TglTerimaAbgPermohonan { get; set; }
        public int? ValidatorSubStId { get; set; }
        public DateTime? TglValidasiSubSt { get; set; }
        public int? ValidatorBantahanId { get; set; }
        public DateTime? TglValidasiBantahan { get; set; }
        public int? ValidatorPencabutanId { get; set; }
        public DateTime? TglValidasiPencabutan { get; set; }
        public int? RefStatusId { get; set; }
        public string NoSengketa { get; set; }
        public string NoPendaftaran { get; set; }
        public int? RefJenisPemeriksaanId { get; set; }
        public string NoObjekSengketa { get; set; }
        public DateTime? TglObjekSengketa { get; set; }
        public string FilePdfObjekSengketa { get; set; }
        public int? RefPembagianBerkasId { get; set; }
        public int? PemeriksaId { get; set; }
        public DateTime? TglPemeriksaan { get; set; }
        public int? SyaratFormal { get; set; }
        public string NoTandaTerimaSubSt { get; set; }
        public DateTime? TglTandaTerimaSubSt { get; set; }
        public int? RefJenisKetetapanId { get; set; }
        public int? RefTtdTandaTerimaId { get; set; }
        public string NoSuratPermintaanSubSt { get; set; }
        public DateTime? TglSuratPermintaanSubSt { get; set; }
        public int? RefTermohonId { get; set; }
        public string NamaTermohon { get; set; }
        public int? RefUpTermohonId { get; set; }
        public string NamaUpTermohon { get; set; }
        public string AlamatTermohon { get; set; }
        public int? RefKotaTermohonId { get; set; }
        public string KotaTermohon { get; set; }
        public int? RefTtdPermintaanSubStId { get; set; }
        public DateTime? TglTandaTerimaPermintaan { get; set; }
        public int? PerekamTandaTerimaPermintaanId { get; set; }
        public string NoSuratPermintaanBantahan { get; set; }
        public DateTime? TglSuratPermintaanBantahan { get; set; }
        public int? RefTtdPermintaanBantahanId { get; set; }
        public int? PerekamPermintaanBantahanId { get; set; }
        public DateTime? TglRekamPermintaanBantahan { get; set; }
        public string NoSuratPermintaanSalinan { get; set; }
        public DateTime? TglSuratPermintaanSalinan { get; set; }
        public int? RefTtdPermintaanSalinanId { get; set; }
        public int? PerekamPermintaanSalinanId { get; set; }
        public DateTime? TglRekamPermintaanSalinan { get; set; }
        public DateTime? TglJatuhTempoSiapSidang { get; set; }
        public int? RefMajelisHistoriId { get; set; }
        public int? RefMajelisBebanId { get; set; }
        public int? RefMajelisPenunjukanId { get; set; }
        public string KeteranganPenunjukan { get; set; }
        public string NoDistribusiBerkas { get; set; }
        public DateTime? TglDistribusiBerkas { get; set; }
        public string NoPenetapan { get; set; }
        public DateTime? TglPenetapan { get; set; }
        public int? TempatSidang { get; set; }
        public int? MasaPajakAkhirTahun { get; set; }
        public int? MasaPajakAkhirBulan { get; set; }
        public int? MasaPajakAwalTahun { get; set; }
        public int? MasaPajakAwalBulan { get; set; }
        public byte? Sdtk { get; set; }
        public string FilePdfBuktiBayar { get; set; }
        public string FilePdfSkk { get; set; }
        public string AktaPerusahaan { get; set; }
        public int? Checklist1 { get; set; }
        public int? Checklist2 { get; set; }
        public int? Checklist3 { get; set; }
        public int? Checklist4 { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public string NoPenetapanAc { get; set; }
        public DateTime? TglPenetapanAc { get; set; }
        public string NoPenetapanPencabutan { get; set; }
        public DateTime? TglPenetapanPencabutan { get; set; }
        public int? RefMajelisPenunjukanIdac { get; set; }

        public Pemohon Pemohon { get; set; }
        public RefCaraKirim RefCaraKirimBantahan { get; set; }
        public RefCaraKirim RefCaraKirimPencabutan { get; set; }
        public RefCaraKirim RefCaraKirimPermohonan { get; set; }
        public RefCaraKirim RefCaraKirimSubSt { get; set; }
        public RefJenisKetetapan RefJenisKetetapan { get; set; }
        public RefJenisPajak RefJenisPajak { get; set; }
        public RefJenisPemeriksaan RefJenisPemeriksaan { get; set; }
        public RefJenisPermohonan RefJenisPermohonan { get; set; }
        public RefStatus RefStatus { get; set; }
        public ICollection<DataTambahan> DataTambahan { get; set; }
        public ICollection<Kelengkapan> Kelengkapan { get; set; }

        [NotMapped]
        public IFormFile _FilePdfSuratPermohonan { get; set; }
        [NotMapped]
        public IFormFile _FileDocSuratPermohonan { get; set; }
        [NotMapped]
        public IFormFile _FilePdfObjekSengketa { get; set; }
        [NotMapped]
        public IFormFile _FilePdfBuktiBayar { get; set; }
        [NotMapped]
        public IFormFile _FilePdfSkk { get; set; }
        [NotMapped]
        public IFormFile _FilePdfSkp { get; set; }
    }
}
