using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisPenomoran
    {
        public RefJenisPenomoran()
        {
            Penomoran = new HashSet<Penomoran>();
        }

        public int RefJenisPenomoranId { get; set; }
        public string Uraian { get; set; }
        public int? JatuhTempoBulan { get; set; }
        public int? JatuhTempoHari { get; set; }
        public string Prefix { get; set; }
        public string Suffix { get; set; }

        public ICollection<Penomoran> Penomoran { get; set; }
    }
}
