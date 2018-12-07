using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Filters;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;

namespace SETPPBO.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [BypassFilter]
        public IActionResult Index()
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var nip = User.Claims.FirstOrDefault(x => x.Type.Equals("nip")).Value;
            var roles = String.Join(",",User.Claims.Where(x => x.Type.Equals(ClaimTypes.Role)).Select(y => y.Value));
            var gravatar = "https://account.kemenkeu.go.id/manage/uploads/thumbnails/"+ nip + ".jpg";
            ViewBag.Claims = JsonConvert.SerializeObject(new { Nama=nama, Nip=nip, Gravatar=gravatar, Roles=roles });
            
            return View();
        }

        [BypassFilter]
        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
