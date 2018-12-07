using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefJenisNormaWaktu
    {
        public RefJenisNormaWaktu()
        {
            RefNormaWaktu = new HashSet<RefNormaWaktu>();
        }

        public int RefJenisNormaWaktuId { get; set; }
        public string Uraian { get; set; }

        public ICollection<RefNormaWaktu> RefNormaWaktu { get; set; }
    }
}
