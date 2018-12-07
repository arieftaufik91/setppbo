using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class Kelengkapan
    {
        public string KelengkapanId { get; set; }
        public string PermohonanId { get; set; }
        public int RefDokumenId { get; set; }
        public string Uraian { get; set; }
        public string FileId { get; set; }
        public bool? Valid { get; set; }
        public string Keterangan { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public Permohonan Permohonan { get; set; }
        public RefDokumen RefDokumen { get; set; }
    }
}
