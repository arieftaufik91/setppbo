using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SETPPBO.Models
{
    public class MenuItemModel
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
        public IEnumerable<MenuItemModel> Items { get; set; }
    }
}
