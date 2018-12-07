using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefConfig
    {
        public int RefConfigId { get; set; }
        public string Uraian { get; set; }
        public string ConfigKey { get; set; }
        public string ConfigValue { get; set; }
        public bool? IsEncrypted { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
