using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SETPPBO.Areas.Core.Models
{
    public class ResultModel
    {
        // boolen is operation successful
        // message string
        // data type object
        public bool isSuccessful { get; set; }
        public string message { get; set; }
        public object data { get; set; }
    }
}
