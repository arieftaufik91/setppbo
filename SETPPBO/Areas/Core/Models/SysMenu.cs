
namespace SETPPBO.Models
{
    public class SysMenu
    {
        public int MenuId { get; set; }
        public string Link { get; set; }
        public bool Exact { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Roles { get; set; }
        public string ParentName { get; set; }
        public string Type { get; set; }
        public int? Order { get; set; }
    }
}
