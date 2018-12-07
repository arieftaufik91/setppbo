using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class Paging
    {
        public int Limit { get; set; }
        public int Offset { get; set; }
        public string Search { get; set; }
    }
}
