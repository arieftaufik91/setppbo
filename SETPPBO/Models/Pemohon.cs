using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class Pemohon
    {
        public Pemohon()
        {
            PemohonMajelis = new HashSet<PemohonMajelis>();
            Permohonan = new HashSet<Permohonan>();
        }

        public string PemohonId { get; set; }
        public string Nama { get; set; }
        public string Password { get; set; }
        public string KodeVerifikasi { get; set; }
        public DateTime? TglKodeVerifikasi { get; set; }
        public string Npwp { get; set; }
        public string NpwpfileId { get; set; }
        public string ContactPerson { get; set; }
        public string Alamat { get; set; }
        public int? RefKotaId { get; set; }
        public string Kota { get; set; }
        public string KodePos { get; set; }
        public string AlamatKoresponden { get; set; }
        public int? RefKotaKorespondenId { get; set; }
        public string KotaKoresponden { get; set; }
        public string KodePosKoresponden { get; set; }
        public string Email { get; set; }
        public bool? Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public int? TotalBerkas { get; set; }

        public ICollection<PemohonMajelis> PemohonMajelis { get; set; }
        public ICollection<Permohonan> Permohonan { get; set; }
    }
}
