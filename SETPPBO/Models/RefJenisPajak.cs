using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisPajak
    {
        public RefJenisPajak()
        {
            Permohonan = new HashSet<Permohonan>();
        }

        public int RefJenisPajakId { get; set; }
        public string Uraian { get; set; }
        public string UraianSingkat { get; set; }
        public string Kode { get; set; }
        public int RefJenisKasusId { get; set; }
        public bool IsPph { get; set; }

        public RefJenisKasus RefJenisKasus { get; set; }
        public ICollection<Permohonan> Permohonan { get; set; }
    }
}
