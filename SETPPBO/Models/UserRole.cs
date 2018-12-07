using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class UserRole
    {
        public int UserRoleId { get; set; }
        public int? PegawaiId { get; set; }
        public string RoleId { get; set; }
        public string Nip18 { get; set; }
        public string Nama { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
