using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class Audit
    {
        public int AuditId { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string StringUrl { get; set; }
        public string Method { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public DateTime LogDate { get; set; }
        public string PermohonanId { get; set; }
        public string CompIp { get; set; }
        public string CompName { get; set; }
        public string CompMacAddress { get; set; }
    }
}
