using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefMajelis
    {
        public RefMajelis()
        {
            PemohonMajelis = new HashSet<PemohonMajelis>();
        }

        public int RefMajelisId { get; set; }
        public string Kode { get; set; }
        public string Majelis { get; set; }
        public string Harsinom { get; set; }
        public int HakimKetuaId { get; set; }
        public string NamaHakimKetua { get; set; }
        public string NiphakimKetua { get; set; }
        public int HakimAnggota1Id { get; set; }
        public string NamaHakimAnggota1 { get; set; }
        public string NiphakimAnggota1 { get; set; }
        public int HakimAnggota2Id { get; set; }
        public string NamaHakimAnggota2 { get; set; }
        public string NiphakimAnggota2 { get; set; }
        public int Spid { get; set; }
        public string NamaSp { get; set; }
        public string Nipsp { get; set; }
        public int? Psp1id { get; set; }
        public int? Psp2id { get; set; }
        public int RefJenisKasusId { get; set; }
        public int? TotalBerkas { get; set; }

        public RefJenisKasus RefJenisKasus { get; set; }
        public ICollection<PemohonMajelis> PemohonMajelis { get; set; }
    }
}
