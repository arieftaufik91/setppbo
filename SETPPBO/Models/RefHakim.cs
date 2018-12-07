using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefHakim
    {
        public int RefHakimId { get; set; }
        public string Nama { get; set; }
        public string Nik { get; set; }
        public int? PegawaiId { get; set; }
    }
}
