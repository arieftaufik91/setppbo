using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class DataTambahan
    {
        public string DataTambahanId { get; set; }
        public string PermohonanId { get; set; }
        public string Uraian { get; set; }
        public string FileId { get; set; }
        public bool? Valid { get; set; }
        public string Keterangan { get; set; }
        public int? ValidatorId { get; set; }
        public DateTime? TglValidasi { get; set; }
        public string SuratPengantarId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public Permohonan Permohonan { get; set; }
        public SuratPengantar SuratPengantar { get; set; }
    }

    public partial class DataTambahanEntry
    {
        public string PermohonanId { get; set; }
        public string NoSuratPengantar { get; set; }
        public DateTime TglSuratPengantar { get; set; }
        public DateTime? TglKirim { get; set; }
        public DateTime? TglTerima { get; set; }
        public int RefCaraKirimID { get; set; }
        public string[] FileId { get; set; }
        public string[] Uraian { get; set; }

        public string[] Keterangan { get; set; }
    }
}
