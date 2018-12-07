using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisKetetapan
    {
        public RefJenisKetetapan()
        {
            Permohonan = new HashSet<Permohonan>();
        }

        public int RefJenisKetetapanId { get; set; }
        public string Uraian { get; set; }

        public ICollection<Permohonan> Permohonan { get; set; }
    }
}
