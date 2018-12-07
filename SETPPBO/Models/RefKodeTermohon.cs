using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefKodeTermohon
    {
        public int OrganisasiId { get; set; }
        public int? IndukOrganisasiId { get; set; }
        public string KodeOrganisasi { get; set; }
        public int? Level { get; set; }
        public string UraianOrganisasi { get; set; }
        public string UraianLengkapOrganisasi { get; set; }
        public string UraianJabatan { get; set; }
        public string KodeSatker { get; set; }
        public string Alamat { get; set; }
        public string Kota { get; set; }
        public string KodePos { get; set; }
        public string KodeSurat { get; set; }
        public byte? IsSdtk { get; set; }
        public int? OrganisasiBerkasId { get; set; }
        public string KodeOrganisasiBerkas { get; set; }
        public string UraianOrganisasiBerkas { get; set; }
    }
}
