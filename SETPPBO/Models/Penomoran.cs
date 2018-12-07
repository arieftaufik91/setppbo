using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class Penomoran
    {
        public int PenomoranId { get; set; }
        public int RefJenisPenomoranId { get; set; }
        public int Tahun { get; set; }
        public int OrganisasiId { get; set; }
        public string KodeOrganisasi { get; set; }
        public string NamaOrganisasi { get; set; }
        public int NomorTerakhir { get; set; }

        public RefJenisPenomoran RefJenisPenomoran { get; set; }
    }
}
