using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SETPPBO.DAO;
using SETPPBO.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;


namespace SETPPBO.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger _logger;
        public IConfiguration Configuration { get; }
        public string LoginProvider { get; set; }
        public string ReturnUrl { get; set; }
        [TempData]
        public string ErrorMessage { get; set; }

        //~
        PegawaiController _pegawai;

        public AccountController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, ILogger<AccountController> logger, IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _logger = logger;
            Configuration = configuration;
            //~ add ksb
            _pegawai = new PegawaiController(configuration);
        }

        [AllowAnonymous]
        [BypassFilter]
        public IActionResult Login(string returnUrl = null)
        {
            var redirectUrl = Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties("KemenkeuID", redirectUrl);
            return new ChallengeResult("KemenkeuID", properties);
        }

        [BypassFilter]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            if (remoteError != null)
            {
                ErrorMessage = $"Error from external provider: {remoteError}";
                return RedirectToPage("/Account/Login");
            }
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                //return RedirectToPage("./Login");
                return RedirectToPage("/Account/Login");
            }

            // Sign in the user with this external login provider if the user already has a login.
            //var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);

            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user != null)
            {
                // Injecting access token to user claims on signin process without save to user claims db
                var claimsPrincipal = await _signInManager.CreateUserPrincipalAsync(user);

                //~ access token
                string accessToken = info.AuthenticationTokens.Single(t => t.Name == "access_token").Value;

                ((ClaimsIdentity)claimsPrincipal.Identity).AddClaim(new Claim("accessToken", accessToken));

                //~ --- claims ---

                //~ add claims: BO
                //~ UserID, PegawaiID, RoleID, RoleName, UnitID, UnitName

                //~ get pegawai info
                PegawaiInfo pegawaiInfo = await GetPegawaiInfo(accessToken);

                //~ call: User.Claims.FirstOrDefault(x => x.Type.Equals("organisasiID")).Value;
                ((ClaimsIdentity)claimsPrincipal.Identity).AddClaim(new Claim("organisasiID", pegawaiInfo.IDOrganisasi.ToString()));
                //~ call: User.Claims.FirstOrDefault(x => x.Type.Equals("organisasiNama")).Value;
                ((ClaimsIdentity)claimsPrincipal.Identity).AddClaim(new Claim("organisasiNama", pegawaiInfo.NamaUnit)); //~ uraian lengkap

                //~ --- claims END ---

                // save claim
                await AuthenticationHttpContextExtensions.SignInAsync(HttpContext, IdentityConstants.ApplicationScheme, claimsPrincipal);

                // saving new refresh token to user claim
                var refreshToken = info.AuthenticationTokens.Single(t => t.Name == "refresh_token").Value; // asumsi selalu ada refresh token alias tidak pernah null.
                var refreshTokenClaim = ((ClaimsIdentity)claimsPrincipal.Identity).Claims.Where(x => x.Type.Equals("refreshToken"));
                if (refreshTokenClaim.Count() > 0)
                {
                    await _userManager.RemoveClaimsAsync(user, refreshTokenClaim);
                }
                await _userManager.AddClaimAsync(user, new Claim("refreshToken", refreshToken)); //~ add to user manager

                //var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
                //var nip = User.Claims.FirstOrDefault(x => x.Type.Equals("nip")).Value;
                //var roles = String.Join(",", User.Claims.Where(x => x.Type.Equals(ClaimTypes.Role)).Select(y => y.Value));
                //var gravatar = "https://account.kemenkeu.go.id/manage/uploads/thumbnails/" + nip + ".jpg";
                //ViewBag.Claims = JsonConvert.SerializeObject(new { Nama = nama, Nip = nip, Gravatar = gravatar, Roles = roles });

                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
                return RedirectToReturnUrl(returnUrl);
            }

            //if (result.IsCompletedSuccessfully)
            //{
            //    _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
            //    return RedirectToReturnUrl(returnUrl);
            //}

            else
            {
                // If the user does not have an account, then ask the user to create an account.
                ReturnUrl = returnUrl;
                LoginProvider = info.LoginProvider;
                if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Name))
                {
                    // auto registration with NIP as username
                    return await Register(returnUrl);
                }

                //return RedirectToPage("./Login");
                return RedirectToReturnUrl(returnUrl);
            }
        }

        internal async Task<IActionResult> Register(string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    throw new ApplicationException("Error loading external login information during confirmation.");
                }

                var IDPegawai = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
                var Nip = info.Principal.FindFirstValue(ClaimTypes.Name);
                var Nama = info.Principal.FindFirstValue(ClaimTypes.GivenName);
                var Email = info.Principal.FindFirstValue(ClaimTypes.Email);
                var user = new ApplicationUser { UserName = IDPegawai, Email = Email, EmailConfirmed = true }; // default locked - false
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    // set 1st logged user as administrator
                    await SetAdminUser();

                    var claims = new List<Claim>
                    {
                        new Claim("nip", Nip),
                        new Claim("nama", Nama)
                    };

                    // add user claims to table
                    foreach (var item in claims)
                    {
                        await _userManager.AddClaimAsync(user, item);
                    }

                    result = await _userManager.AddLoginAsync(user, info); // add user to user table
                    if (result.Succeeded)
                    {
                        // add login succeeded! signing in user and injecting access token into User claims
                        var claimsPrincipal = await _signInManager.CreateUserPrincipalAsync(user);

                        //~ access token
                        string accessToken = info.AuthenticationTokens.Single(t => t.Name == "access_token").Value;

                        ((ClaimsIdentity)claimsPrincipal.Identity).AddClaim(new Claim("accessToken", accessToken));

                        // saving new refresh token to user claim
                        var refreshToken = info.AuthenticationTokens.Single(t => t.Name == "refresh_token").Value; // asumsi selalu ada refresh token alias tidak pernah null.
                        var refreshTokenClaim = ((ClaimsIdentity)claimsPrincipal.Identity).Claims.Where(x => x.Type.Equals("refreshToken"));
                        if (refreshTokenClaim.Count() > 0)
                        {
                            await _userManager.RemoveClaimsAsync(user, refreshTokenClaim);
                        }
                        await _userManager.AddClaimAsync(user, new Claim("refreshToken", refreshToken));

                        //~ create claims
                        PegawaiInfo pegawaiInfo = await GetPegawaiInfo(accessToken);
                        await _userManager.AddClaimAsync(user, new Claim("organisasiID", pegawaiInfo.IDOrganisasi.ToString()));
                        await _userManager.AddClaimAsync(user, new Claim("organisasiNama", pegawaiInfo.NamaUnit)); //~ uraian lengkap

                        await AuthenticationHttpContextExtensions.SignInAsync(HttpContext, IdentityConstants.ApplicationScheme, claimsPrincipal);
                        //await _signInManager.SignInAsync(user, isPersistent: false);
                        _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);

                        return RedirectToReturnUrl(returnUrl); // return to page
                    }
                }
                foreach (var error in result.Errors)
                {
                    _logger.LogInformation("Error.", error.Description);
                }
            }

            return RedirectToReturnUrl(returnUrl); // if somehow modelstate is not valid..
        }

        [BypassFilter]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            // url sso external logout
            string uri = Configuration["Authentication:KemenkeuID:SSOUrl"] + "/Account/ExternalLogout?returnUrl=" + Configuration["Authentication:KemenkeuID:ClientUrl"];

            return Redirect(uri);
            //return RedirectToPage("Home/Index");
        }

        [BypassFilter]
        public IActionResult Lockedout()
        {
            return View();
        }

        private IActionResult RedirectToReturnUrl(string returnUrl)
        {
            // use redirect
            return Redirect(returnUrl);
        }

        private async Task SetAdminUser()
        {
            bool adminExists = (await _userManager.GetUsersInRoleAsync("Administrator")).Count > 0;
            if (!adminExists)
            {
                var user = await _userManager.Users.FirstOrDefaultAsync();

                if (user != null)
                {
                    var userRoles = await _userManager.GetRolesAsync(user);
                    bool userIsAdmin = userRoles.Contains("Administrator");
                    if (!userIsAdmin)
                    {
                        await _userManager.AddToRoleAsync(user, ApplicationRoles.Administrator.ToString());
                    }
                }
            }

        }

        #region KsbControllerRegion
        //~ get pegawai info - taken from KsbController
        private async Task<PegawaiInfo> GetPegawaiInfo(string accessToken)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/pegawai/GetPegawaiInfo";

            PegawaiInfo _pegawaiInfo = new PegawaiInfo();

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var response = await client.GetStringAsync(ksbUrl + uri);
                    _pegawaiInfo = JsonConvert.DeserializeObject<PegawaiInfo>(response);
                    return _pegawaiInfo;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return _pegawaiInfo;
                }
            }
        }

        //~ model pegawaiInfo got from ksb
        //~ need to be updated on change
        private class PegawaiInfo
        {
            public string Alamat { get; set; }
            public string Atasan { get; set; }
            public string Hubungan { get; set; }
            public int IDJabatan { get; set; }
            public int IDOrganisasi { get; set; }
            public int IDPegawai { get; set; }
            public int? IDPegawaiAtasan { get; set; }
            public string KodeOrganisasi { get; set; }
            public string Nama { get; set; }
            public string NamaAtasan { get; set; }
            public string NamaJabatan { get; set; }
            public string NamaOrganisasi { get; set; }
            public string NamaUnit { get; set; }
            public string NIP18 { get; set; }
            public string NIP9 { get; set; }
            public string NIPAtasan { get; set; }
            public int StatusJabatan { get; set; }
            public int StatusPenilaian { get; set; }
            public DateTime? TmtJabatan { get; set; }
            public DateTime? TMTJabatan { get; set; }
            public DateTime? TmtOrganisasi { get; set; }
            public DateTime? TMTOrganisasi { get; set; }
            public string UraianGolongan { get; set; }
            public string UraianPangkat { get; set; }
            public string UraianStatus { get; set; }
        }
        #endregion
    }
}
