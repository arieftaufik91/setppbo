using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefStatus
    {
        public RefStatus()
        {
            Permohonan = new HashSet<Permohonan>();
        }

        public int RefStatusId { get; set; }
        public string Uraian { get; set; }

        public ICollection<Permohonan> Permohonan { get; set; }
    }
}
