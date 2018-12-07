using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefNormaWaktu
    {
        public int RefNormaWaktuId { get; set; }
        public int RefJenisPermohonanId { get; set; }
        public int RefJenisNormaWaktuId { get; set; }
        public int Bulan { get; set; }
        public int Hari { get; set; }

        public RefJenisNormaWaktu RefJenisNormaWaktu { get; set; }
        public RefJenisPermohonan RefJenisPermohonan { get; set; }
    }
}
