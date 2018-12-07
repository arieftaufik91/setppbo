using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefTemplate
    {
        public int RefTemplateId { get; set; }
        public string Uraian { get; set; }
        public string FileId { get; set; }
        public string JenisFile { get; set; }
        public bool Status { get; set; }
    }
}
