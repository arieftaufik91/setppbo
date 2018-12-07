using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefDokumen
    {
        public RefDokumen()
        {
            Kelengkapan = new HashSet<Kelengkapan>();
        }

        public int RefDokumenId { get; set; }
        public string Uraian { get; set; }
        public string JenisFile { get; set; }
        public bool Mandatory { get; set; }
        public bool Status { get; set; }

        public ICollection<Kelengkapan> Kelengkapan { get; set; }
    }
}
