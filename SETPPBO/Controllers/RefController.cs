using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Net;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/Ref")]
    public class RefController : Controller
    {
        private readonly MainDbContext _context;
        private IConfiguration Configuration { get; }
        private string accessToken;
        private string refreshToken;

        private string ksbUrl;
        private string sSOUrl;

        public RefController(MainDbContext context, IConfiguration config)
        {
            _context = context;
            Configuration = config;
            ksbUrl = Configuration["KSB:URL"];
            sSOUrl = Configuration["Authentication:KemenkeuID:SSOUrl"];
        }

        // GET: api/RefStatus
        //~ GetPegawaiByNIP
        [Route("GetPegawaiByNIP/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPegawai([FromRoute] string id)
        {

            //~ add claims
            await GetAccessToken();
            PegawaiInfo _pegawaiInfo = await GetPegawaiByNIP(id);
            return Ok(_pegawaiInfo);
        }

        [Route("GetProvinsi")]
        [HttpGet]
        public async Task<IActionResult> GetProvinsi()
        {
            //~ add claims
            await GetAccessToken();
            return Json((await HRGetAllProvinsi()).Select(a => new
            {
                a.IDRefProvinsi,
                KodeProvinsi = a.KodeProvinsi.Trim(),
                NamaProvinsi = a.NamaProvinsi.Trim()
            }));
        }
        [Route("GetKota")]
        [HttpGet]
        public async Task<IActionResult> GetKota()
        {
            //~ add claims
            await GetAccessToken();
            return Json((await HRGetAllKota()).Select(a => new
            {
                a.IDRefKota,
                a.IDRefProvinsi,
                KodeKota = a.KodeKota.Trim(),
                NamaKota = a.NamaKota.Trim()
            }));
        }

        [Route("GetKotaByName")]
        [HttpGet]
        public async Task<IActionResult> GetKotaByName(string k)
        {
            //~ add claims
            await GetAccessToken();
            return Json(await HRGetKotaByName(k));
        }

        [Route("GetKotaByID/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKotaByID([FromRoute] int id)
        {
            //~ add claims
            await GetAccessToken();
            return Json(await HRGetKotaByID(id));
        }

        [Route("GetProvinsiByID/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProvinsiByID([FromRoute] int id)
        {
            //~ add claims
            await GetAccessToken();
            return Json(await HRGetProvinsiByID(id));
        }

        [Route("GetKotaByProvinsiID/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKotaByProvinsiID([FromRoute] int id)
        {
            //~ add claims
            await GetAccessToken();
            return Json(await HRGetKotaByProvinsi(id));
        }

        #region KsbControllerRegion
        //~ get pegawai info - taken from KsbController
        private async Task<PegawaiInfo> GetPegawaiByNIP(string id)
        {
            string uri = "/hris/api/pegawai/GetPegawaiByNIP/" + id;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    PegawaiInfo _pegawaiInfo = JsonConvert.DeserializeObject<PegawaiInfo>(response); //~ return Hr_Pegawai
                    return _pegawaiInfo;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return null;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefProvinsi>> HRGetAllProvinsi()
        {
            string uri = "/hris/api/kota/GetAllProvinsi";

            IEnumerable<Hr_RefProvinsi> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefProvinsi>>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        //~ modified
        private async Task<Hr_RefKota> HRGetKotaByName(string keyword)
        {
            string uri = "/hris/api/kota/GetAllKota";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    IEnumerable<Hr_RefKota> result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefKota>>(response);
                    return result
                        .Where(a => a.NamaKota.Trim().ToLower().Contains(keyword.Trim().ToLower()))
                        .FirstOrDefault();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return null;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefKota>> HRGetAllKota()
        {
            string uri = "/hris/api/kota/GetAllKota";

            IEnumerable<Hr_RefKota> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefKota>>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefKota>> HRGetKotaByProvinsi(int id)
        {
            string uri = "/hris/api/kota/GetAllKota";

            IEnumerable<Hr_RefKota> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefKota>>(response);
                    return result.Where(a => a.IDRefProvinsi == id);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<Hr_RefKota> HRGetKotaByID(int id)
        {
            string uri = "/hris/api/kota/GetKotaByID/" + id;

            Hr_RefKota result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<Hr_RefKota>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<Hr_RefProvinsi> HRGetProvinsiByID(int id)
        {
            string uri = "/hris/api/kota/GetProvinsiByID/" + id;

            Hr_RefProvinsi result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<Hr_RefProvinsi>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        //~ model pegawaiInfo got from ksb
        //~ need to be updated on change
        private class PegawaiInfo
        {
            public int IDPegawai { get; set; }
            public string Nama { get; set; }
            public string NIP18 { get; set; }
            public string NIK { get; set; }
        }

        // model provinsi
        private class Hr_RefProvinsi
        {
            public int IDRefProvinsi { get; set; }
            public string KodeProvinsi { get; set; }
            public string NamaProvinsi { get; set; }
        }

        // model kota
        private class Hr_RefKota
        {
            public int IDRefKota { get; set; }
            public int? IDRefProvinsi { get; set; }
            public string KodeKota { get; set; }
            public string NamaKota { get; set; }
        }
        #endregion

        #region KsbBaseRegionCopy
        private async Task GetAccessToken()
        {
            var accTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken"));
            if (accTokenClaim != null)
            {
                accessToken = accTokenClaim.Value;
            }
            else
            {
                await GetNewAccessToken();
            }
        }

        private void GetRefreshToken()
        {
            var refreshTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("refreshToken"));
            if (refreshTokenClaim != null)
            {
                refreshToken = refreshTokenClaim.Value;
            }
        }

        private async Task GetNewAccessToken()
        {
            GetRefreshToken();
            string requestBody = "client_id=devapps&client_secret=1234&grant_type=refresh_token&refresh_token=" + refreshToken;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(requestBody, Encoding.UTF8, "application/x-www-form-urlencoded");
                    var response = await client.PostAsync(sSOUrl + "/oauth/token", content);
                    var data = await response.Content.ReadAsStringAsync();
                    var dict = JsonConvert.DeserializeObject<OauthToken>(data);
                    // update access token
                    accessToken = dict.access_token;
                    ((ClaimsIdentity)User.Identity).AddClaim(new Claim("accessToken", accessToken));
                }
                catch (Exception e)
                {
                    var message = e.Message;
                }
            }
        }

        private async Task<bool> AccessTokenIsValid(string paramAccessToken)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", paramAccessToken);
                var response = await client.GetAsync("http://api.kemenkeu.go.id/api/Values/Get");
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        private class OauthToken
        {
            public string access_token { get; set; }
            public string expires_in { get; set; }
            public string refresh_token { get; set; }
        }
        #endregion
    }
}