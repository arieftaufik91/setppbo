using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.DAO;
using SETPPBO.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserRoleController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly CoreDbContext _db;

        public UserRoleController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, CoreDbContext db)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _db = db;
        }

        public IActionResult GetUserRole()
        {
            List<UserDataModel> result = new List<UserDataModel>();
            var users = _userManager.Users;
            var userClaims = _db.UserClaims;
            var roles = _db.Roles;
            var userRoles = _db.UserRoles;

            foreach (ApplicationUser user in users)
            {// untuk setiap user

                string userId = user.Id;
                IdentityRole role = new IdentityRole();
                var listRoles = new List<string>();
                foreach (var userRole in userRoles.Where(a => a.UserId == userId))
                {// untuk setiap role untuk tsb
                    role = roles.Find(userRole.RoleId);
                    listRoles.Add(role.Name);
                }

                var userClaimsById = userClaims.Where(a => a.UserId == userId);
                var Nama = userClaimsById.FirstOrDefault(x => x.ClaimType == "nama");
                //var Nip = userClaimsById.FirstOrDefault(x => x.ClaimType == "nip");

                //~ need to check, Pemohon will not have nip and gravatar
                var isNip = userClaimsById.Any(x => x.ClaimType.Equals("nip"));
                var Nip = isNip ? userClaimsById.FirstOrDefault(x => x.ClaimType == "nip") : null;
                //~ nip might be null for external  users
                var Gravatar = isNip ? "https://account.kemenkeu.go.id/manage/uploads/thumbnails/" + Nip.ClaimValue + ".jpg" : "/assets/images/profile.jpg";

                result.Add(new UserDataModel
                {
                    UserId = userId,
                    UserRoles = listRoles,
                    Nama = Nama.ClaimValue,
                    Nip = isNip ? Nip.ClaimValue : "", //~
                    Gravatar = Gravatar,
                    PegawaiId = user.UserName
                });
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserRoleByPegawaiId(string id)
        {
            var user = _userManager.Users.First(x => x.UserName == id);
            var userClaims = await _userManager.GetClaimsAsync(user);
            var Nama = userClaims.FirstOrDefault(x => x.Type == "nama");
            var Nip = userClaims.FirstOrDefault(x => x.Type == "nip");
            var Gravatar = "https://account.kemenkeu.go.id/manage/uploads/thumbnails/" + Nip.Value + ".jpg";
            var userRoles = await _userManager.GetRolesAsync(user);

            var result = new UserDataModel
            {
                UserId = user.Id,
                UserRoles = userRoles.ToList(),
                Nama = Nama.Value,
                Nip = Nip.Value,
                Gravatar = Gravatar,
                PegawaiId = user.UserName
            };

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> PutLockUser([FromBody] UserDataModel userData)
        {
            var user = _userManager.Users.First(x => x.Id == userData.UserId);
            var userRoles = await _userManager.SetLockoutEnabledAsync(user, userData.IsLocked);

            return Ok(userRoles);
        }

        [HttpPost]
        public async Task<IActionResult> PostUserRole([FromBody] UserDataModel userRole)
        {
            var user = _userManager.Users.First(x => x.Id == userRole.UserId);
            var userRoles = await _userManager.GetRolesAsync(user);
            var newRoles = new List<string>();
            var deletedRoles = new List<string>();
            // cek added role
            foreach (string role in userRole.UserRoles)
            {
                if (!userRoles.Contains(role))
                {
                    newRoles.Add(role);
                }
            }
            // cek deleted role
            foreach (string role in userRoles)
            {
                if (!userRole.UserRoles.Contains(role))
                {
                    deletedRoles.Add(role);
                }
            }

            // tambah yang baru

            if (newRoles.Count > 0)
            {
                await _userManager.AddToRolesAsync(user, newRoles);
            }

            // hapus yang lama
            if (deletedRoles.Count > 0)
                await _userManager.RemoveFromRolesAsync(user, deletedRoles);

            return Ok(userRole);
        }

        //~ suspend/un-suspend
        [Route("Suspend")]
        [HttpPost]
        public async Task<IActionResult> PostUserSuspend([FromBody] UserDataModel user)
        {
            var _user = _userManager.Users.First(x => x.Id == user.UserId);
            bool isPemohon = await _userManager.IsInRoleAsync(_user, "Pemohon");

            if (isPemohon)
            {
                //~ toggle lock/unlock
                bool _locked = await _userManager.IsLockedOutAsync(_user);
                if (_locked) //~ if was locked out, then unlocked and reset
                {
                    await _userManager.SetLockoutEndDateAsync(_user, null);
                    await _userManager.ResetAccessFailedCountAsync(_user);
                }
                else //~ if was not locked out, then locked and set lockout enddate
                {
                    await _userManager.SetLockoutEndDateAsync(_user, System.DateTimeOffset.MaxValue);
                    await _userManager.ResetAccessFailedCountAsync(_user);
                }
                return Ok(_locked? "unsuspended" : "suspended");
            }

            return NoContent();
        }
    }
}
