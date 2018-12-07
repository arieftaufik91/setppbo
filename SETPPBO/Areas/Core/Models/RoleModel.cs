using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SETPPBO.Models
{
    public class RoleModel
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public List<string> ActionRoles { get; set; }
    }
}
