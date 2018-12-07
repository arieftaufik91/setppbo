using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.DAO;
using SETPPBO.Filters;
using SETPPBO.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using SETPPBO.Areas.Core.Models;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize]
    public class MenuController : Controller
    {
        private readonly CoreDbContext _context;

        public MenuController(CoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [BypassFilter]
        public IEnumerable<MenuItemModel> SysMenu() // Matches: api/Menu
        {   // ambil menu sesuai role user yang sedang login
            var userRoleClaim = User.Claims.Where(c => c.Type.Equals(ClaimTypes.Role));
            List<SysMenu> roleBasedMenu = new List<SysMenu>();
            var nullMenu = _context.SysMenu.Where(x => x.Roles == null);
            roleBasedMenu.AddRange(nullMenu);
            if (userRoleClaim.Any())
            {
                var userRoles = userRoleClaim.Select(x => x.Value);
                foreach (var userRole in userRoles)
                {// for each role user has
                    var containsRoles = _context.SysMenu.Where(a => a.Roles.Contains(userRole));
                    roleBasedMenu.AddRange(containsRoles);
                }
            }
            var menus = roleBasedMenu.Distinct(); // distincted menu
            return generateMenuItemModel(menus);
        }

        private IEnumerable<MenuItemModel> getMenuByParentName(IEnumerable<SysMenu> menus, string name)
        {
            return menus.Where(a => a.ParentName == name).Select(b => new MenuItemModel
            {
                MenuId = b.MenuId,
                Name = b.Name,
                Link = b.Link,
                Icon = b.Icon,
                Order = b.Order,
                Exact = b.Exact,
                ParentName = b.ParentName,
                Type = b.Type,
                Roles = b.Roles,
                Items = getMenuByParentName(menus, b.Name)
            }).OrderBy(c => c.Order);
        }

        // GET: api/Menu/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSysMenu([FromRoute] int id) // Matches: api/Menu/id
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id > 0)
            { // ambil sys menu sesuai id
                var sysMenu = await _context.SysMenu.SingleOrDefaultAsync(m => m.MenuId == id);

                if (sysMenu == null)
                {
                    return NotFound();
                }

                return Ok(sysMenu);
            }
            else
            { // ambil semua sys menu
                return Ok(generateMenuItemModel(_context.SysMenu));
            }

        }

        private IEnumerable<MenuItemModel> generateMenuItemModel(IEnumerable<SysMenu> sysMenu)
        {
            // cari parent (parentName null)
            var rootMenus = sysMenu.Where(x => x.ParentName == null || x.Type=="group").OrderBy(x => x.Order);
            var menu = rootMenus.Select(a => new MenuItemModel
                             {
                                 MenuId = a.MenuId,
                                 Name = a.Name,
                                 Link = a.Link,
                                 Icon = a.Icon,
                                 Order = a.Order,
                                 Exact = a.Exact,
                                 Type = a.Type,
                                 ParentName = a.ParentName,
                                 Roles = a.Roles,
                                 Items = getMenuByParentName(sysMenu, a.Name)
                             }).OrderBy(d => d.Order);
            return menu;
        }

        // PUT: api/Menu/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSysMenu([FromRoute] int id, [FromBody] SysMenu sysMenu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sysMenu.MenuId)
            {
                return BadRequest();
            }

            _context.Entry(sysMenu).State = EntityState.Modified;
            int result = 0;
            try
            {
                result = await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SysMenuExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(
                new ResultModel { isSuccessful = result > 0, message = "", data = sysMenu }
            );
        }

        // POST: api/Menu
        [HttpPost]
        public async Task<IActionResult> PostSysMenu([FromBody] SysMenu sysMenu)
        {
            // cek isi
            if(sysMenu.Type == "group" || sysMenu.Type == "collapse") {
                // tidak ada link
                sysMenu.Link = null;
            }

            _context.SysMenu.Add(sysMenu);
            var result = await _context.SaveChangesAsync();
            return Ok(
                new ResultModel { isSuccessful = result > 0, message = "", data = sysMenu }
            );
            /*
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SysMenu.Add(sysMenu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSysMenu", new { id = sysMenu.MenuId }, sysMenu);
            */
        }

        // DELETE: api/Menu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSysMenu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sysMenu = await _context.SysMenu.SingleOrDefaultAsync(m => m.MenuId == id);
            if (sysMenu == null)
            {
                return NotFound();
            }

            _context.SysMenu.Remove(sysMenu);
            await _context.SaveChangesAsync();

            return Ok(sysMenu);
        }

        private bool SysMenuExists(int id)
        {
            return _context.SysMenu.Any(e => e.MenuId == id);
        }
    }
}