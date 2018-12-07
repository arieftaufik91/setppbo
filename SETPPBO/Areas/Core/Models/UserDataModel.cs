using System.Collections.Generic;

namespace SETPPBO.Models
{
    public class UserDataModel
    {
        public string UserId { get; set; }
        public string PegawaiId { get; set; }
        public string Nama { get; set; }
        public string Nip { get; set; }
        public bool IsLocked { get; set; }
        public string Gravatar { get; set; }
        public List<string> UserRoles { get; set; }
    }
}
