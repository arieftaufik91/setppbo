using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class SuratPengantar
    {
        public SuratPengantar()
        {
            DataTambahan = new HashSet<DataTambahan>();
        }

        public string SuratPengantarId { get; set; }
        public string PermohonanId { get; set; }
        public string NoSuratPengantar { get; set; }
        public DateTime TglSuratPengantar { get; set; }
        public int? RefCaraKirimId { get; set; }
        public DateTime? TglKirim { get; set; }
        public DateTime? TglTerima { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public RefCaraKirim RefCaraKirim { get; set; }
        public ICollection<DataTambahan> DataTambahan { get; set; }
    }
}
