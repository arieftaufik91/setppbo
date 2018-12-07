using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisPemeriksaan
    {
        public RefJenisPemeriksaan()
        {
            Permohonan = new HashSet<Permohonan>();
        }

        public int RefJenisPemeriksaanId { get; set; }
        public string Uraian { get; set; }

        public ICollection<Permohonan> Permohonan { get; set; }
    }
}
