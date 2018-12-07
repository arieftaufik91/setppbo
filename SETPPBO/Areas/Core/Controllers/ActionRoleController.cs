using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using SETPPBO.Models;
using SETPPBO.Areas.Core.Models;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ActionRoleController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IActionDescriptorCollectionProvider _provider;

        public ActionRoleController(RoleManager<IdentityRole> roleManager, IActionDescriptorCollectionProvider provider)
        {
            _roleManager = roleManager;
            _provider = provider;
        }
        
        public async Task<IActionResult> GetActionRole()
        {
            List<ActionRoleModel> result = new List<ActionRoleModel>();
            try
            {
                var roles = _roleManager.Roles;
                foreach (IdentityRole role in roles)
                {// untuk setiap role
                    ActionRoleModel arModel = new ActionRoleModel();
                    arModel.Role = role.Name;
                    var claims = await _roleManager.GetClaimsAsync(role);
                    var actionClaim = claims.FirstOrDefault(x => x.Type == "Action");
                    if (actionClaim != null && actionClaim.Value.Length > 0)
                    {
                        List<SysActionModel> actionList = new List<SysActionModel>();
                        foreach (string value in actionClaim.Value.Split(";"))
                        {
                            // value : controllername.actionname
                            string[] splitted = value.Split(".");
                            string ctrlName = splitted[0];
                            string actName = splitted[1];

                            SysActionModel sysModel = new SysActionModel { ControllerName = ctrlName, ActionName = actName };
                            actionList.Add(sysModel);
                        }
                        arModel.Actions = actionList;
                        arModel.Action = actionClaim.Value;
                    }
                    result.Add(arModel);
                }
            }
            catch (Exception e)
            {
                //
                var eMessage = e.StackTrace;
                return BadRequest(eMessage);
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetSystemAction(int id)
        {
            //result.Add(controllerName + "." + actionName);
            List<SysActionModel> routes = _provider.ActionDescriptors.Items.Select(x => new SysActionModel
            {
                ActionName = x.RouteValues["Action"],
                ControllerName = x.RouteValues["Controller"]
            }).ToList();

            var cNameList = new List<string>();
            var cNameAsterisk = new List<SysActionModel>();

            foreach (var route in routes)
            {
                var cName = route.ControllerName;
                if (!cNameList.Contains(cName))
                {
                    cNameList.Add(cName);
                    cNameAsterisk.Add(new SysActionModel { ActionName = "*", ControllerName = cName });
                }
            }

            IEnumerable<SysActionModel> distinctRoute = routes.Distinct();
            IEnumerable<SysActionModel> unionRoute = distinctRoute.Union(cNameAsterisk);
            List<SysActionModel> result = unionRoute.OrderBy(x => x.ControllerName).ThenBy(y => y.ActionName).ToList();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> PostActionRole([FromBody] ActionRoleModel actionRole)
        {
            
                var role = _roleManager.Roles.FirstOrDefault(x => x.Name == actionRole.Role);
                // get claim for selected role
                var claimsRole = await _roleManager.GetClaimsAsync(role);
                var actionsRole = claimsRole.FirstOrDefault(a => a.Type == "Action");
                var listActions = new List<string>();
                // if (actionsRole!=null)
                // {
                //     listActions = actionsRole.Value.Split(';').ToList();
                // }

                var listFormActions = actionRole.Actions;
                foreach(SysActionModel action in listFormActions)
                {
                    // proses cek dan tambah list
                    string controllerNameAll = action.ControllerName + ".*";
                    bool hasController = listActions.Contains(controllerNameAll);

                    if(!hasController)
                    {// jika di database tidak ada yang controller .*
                        var strAction = action.ControllerName + "." + action.ActionName;
                        bool hasAction = listActions.Contains(strAction);
                        if(!hasAction)
                        {
                            listActions.Add(strAction);
                        }
                    }
                }

                // update claim role
                if (actionsRole != null)
                {
                    await _roleManager.RemoveClaimAsync(role, actionsRole);
                }

                // simpan
                string claimValue = String.Join(";", listActions);
                var newClaim = new Claim("Action", claimValue);
                var result = await _roleManager.AddClaimAsync(role, newClaim);

                ActionRoleModel rData = new ActionRoleModel { Role = actionRole.Role, Action = claimValue, Actions = ConstructActionList(listActions) };
            
            return Ok(new ResultModel { isSuccessful = result.Succeeded, message = result.Errors.ToString(), data = rData });
        }

        private List<SysActionModel> ConstructActionList(List<string> strActionList)
        {
            List<SysActionModel> result = new List<SysActionModel>();

            foreach(string strAction in strActionList)
            {// isinya "controller.action"
                string ctrName = strAction.Split('.').First();
                string actName = strAction.Split('.').Last();

                result.Add(new SysActionModel { ControllerName = ctrName, ActionName = actName });
            }

            return result;
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteActionRole([FromBody] IEnumerable<ActionRoleModel> actionRoles)
        {
            foreach(var actionRole in actionRoles){
                try
                {
                    var role = _roleManager.Roles.FirstOrDefault(x => x.Name == actionRole.Role);
                    // get claim for selected role
                    var claimsRole = await _roleManager.GetClaimsAsync(role);
                    var actionsRole = claimsRole.FirstOrDefault(a => a.Type == "Action");
                    var listActions = actionsRole.Value.Split(';').ToList();
    
                    listActions.Remove(actionRole.Action);
                    // hapus
                    await _roleManager.RemoveClaimAsync(role, actionsRole);
                    // serialize
                    string claimValue = String.Join(";", listActions);
                    var newClaim = new Claim("Action", claimValue);
                    // add
                    await _roleManager.AddClaimAsync(role, newClaim);

                }
                catch (Exception e)
                {
                    string message = e.StackTrace;
                }
            }
            
            return Ok();
        }
    }
}
