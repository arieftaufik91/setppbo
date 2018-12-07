using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class SampleData
    {
        public int QuoteId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Quote { get; set; }
    }
}
