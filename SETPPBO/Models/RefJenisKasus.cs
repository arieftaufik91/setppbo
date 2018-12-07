using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisKasus
    {
        public RefJenisKasus()
        {
            RefJenisPajak = new HashSet<RefJenisPajak>();
            RefMajelis = new HashSet<RefMajelis>();
        }

        public int RefJenisKasusId { get; set; }
        public string Uraian { get; set; }

        public ICollection<RefJenisPajak> RefJenisPajak { get; set; }
        public ICollection<RefMajelis> RefMajelis { get; set; }
    }
}
