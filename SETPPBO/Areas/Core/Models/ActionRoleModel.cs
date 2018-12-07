using SETPPBO.Areas.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SETPPBO.Models
{
    public class ActionRoleModel
    {
        public string Action { get; set; }
        public string Role { get; set; }
        public List<SysActionModel> Actions { get; set; }
    }
}
