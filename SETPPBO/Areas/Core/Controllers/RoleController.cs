using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Areas.Core.Models;
using SETPPBO.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class RoleController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public IActionResult GetRole()
        {
            var result = _roleManager.Roles.Select(x => new RoleModel { RoleId = x.Id, RoleName = x.Name });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(string id)
        {
            var role = _roleManager.Roles.FirstOrDefault(x => x.Id == id);
            // get claim for selected role
            var claimsRole = await _roleManager.GetClaimsAsync(role);
            var actionsRole = claimsRole.FirstOrDefault(a => a.Type == "Action");

            List<string> listActions = null;

            if(actionsRole != null)
            {
                listActions = actionsRole.Value.Split(';').ToList();
            }
            
            var result = new RoleModel { RoleId = role.Id, RoleName = role.Name, ActionRoles = listActions };
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> PostRole([FromBody] RoleModel role)
        {
            var result = await _roleManager.CreateAsync(new IdentityRole { Name = role.RoleName });
            var roleDb = _roleManager.Roles.FirstOrDefault(x => x.Name == role.RoleName);
            if (roleDb != null)
            {
                RoleModel returnModel = new RoleModel { RoleId = roleDb.Id, RoleName = roleDb.Name };
                return Ok(new ResultModel { isSuccessful = result.Succeeded, message = result.Errors.ToString(), data = returnModel });
            }

            return Ok(new { success = result.Succeeded, msg = result.Errors.ToString(), data = "data" });
        }

        [HttpPut]
        public async Task<IActionResult> PutRole([FromBody] RoleModel role)
        {
            var roleDb = _roleManager.Roles.FirstOrDefault(x => x.Id == role.RoleId);
            roleDb.Name = role.RoleName;
            roleDb.NormalizedName = role.RoleName.ToUpper();
            var result = await _roleManager.UpdateAsync(roleDb);

            return Ok(new ResultModel { isSuccessful = result.Succeeded, message = result.Errors.ToString(), data = roleDb });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var roleDb = _roleManager.Roles.FirstOrDefault(x => x.Id == id);
            var result = await _roleManager.DeleteAsync(roleDb);
            return Ok(new ResultModel { isSuccessful = result.Succeeded, message = result.Errors.ToString(), data = roleDb });
        }
    }
}