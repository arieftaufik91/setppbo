using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class PemohonMajelis
    {
        public int PemohonMajelisId { get; set; }
        public string PemohonId { get; set; }
        public int RefMajelisId { get; set; }
        public int TahunPajak { get; set; }
        public bool IsPph { get; set; }

        public Pemohon Pemohon { get; set; }
        public RefMajelis RefMajelis { get; set; }
    }
}
