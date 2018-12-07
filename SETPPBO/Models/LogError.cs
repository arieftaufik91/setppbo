using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class LogError
    {
        public int LogErrorId { get; set; }
        public string Message { get; set; }
        public string StringUrl { get; set; }
        public string Method { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public DateTime LogDate { get; set; }
        public string CompIp { get; set; }
        public string CompName { get; set; }
        public string CompMacAddress { get; set; }
    }
}
