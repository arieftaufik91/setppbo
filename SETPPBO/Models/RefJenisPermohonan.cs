using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisPermohonan
    {
        public RefJenisPermohonan()
        {
            Permohonan = new HashSet<Permohonan>();
            RefNormaWaktu = new HashSet<RefNormaWaktu>();
        }

        public int RefJenisPermohonanId { get; set; }
        public string Uraian { get; set; }

        public ICollection<Permohonan> Permohonan { get; set; }
        public ICollection<RefNormaWaktu> RefNormaWaktu { get; set; }
    }
}
