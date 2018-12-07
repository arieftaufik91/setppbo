using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/RefPenandatangan")]
    public class RefPenandatanganController : Controller
    {
        private readonly MainDbContext _context;
        private IConfiguration Configuration { get; }

        public RefPenandatanganController( MainDbContext context, IConfiguration config)
        {
            _context = context;
            Configuration = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetRefPenandatangan()
        {
            var daftar = await _context.RefConfig
                .Where(a => a.ConfigKey == "TTD_SES" || a.ConfigKey == "TTD_WASES")
                .Select(a => new
                {
                    a.RefConfigId,
                    a.Uraian,
                    a.ConfigKey,
                    a.ConfigValue
                }).ToListAsync();
            return Ok(daftar);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefPenandatangan([FromRoute] int id)
        {
            var daftar = await _context.RefConfig
                .Where(a => a.RefConfigId == id)
                .Select(a => new
                {
                    a.RefConfigId,
                    a.Uraian,
                    a.ConfigKey,
                    a.ConfigValue
                }).SingleOrDefaultAsync();
            return Ok(daftar);
        }

        [Route("Update/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefPenandatangan([FromRoute] int id, [FromBody] RefConfig refTTD)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refTTD.RefConfigId)
            {
                return BadRequest();
            }

            RefConfig ttd = new RefConfig();
            ttd.RefConfigId = refTTD.RefConfigId;
            _context.RefConfig.Attach(ttd);
            ttd.ConfigValue = refTTD.ConfigValue;
            ttd.UpdatedDate = DateTime.Now;
            ttd.UpdatedBy = PegawaiID;

            _context.Entry(ttd).Property("ConfigValue").IsModified = true;
            _context.Entry(ttd).Property("UpdatedDate").IsModified = true;
            _context.Entry(ttd).Property("UpdatedBy").IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

                if (!RefConfigExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Route("GetNamaByNIP/{nip}")]
        [HttpGet("{nip}")]
        public async Task<IActionResult> GetNamaByNIP([FromRoute] string nip)
        {
            string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
            PegawaiInfo info = await GetPegawaiByNIP(nip, accessToken);

            return Ok(info.Nama+"::"+info.IDPegawai);
        }

        private bool RefConfigExists(int id)
        {
            return _context.RefConfig.Any(e => e.RefConfigId == id);
        }

        #region KsbControllerRegion
        //~ get pegawai info - taken from KsbController
        private async Task<PegawaiInfo> GetPegawaiByNIP(string id, string accessToken)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/pegawai/GetPegawaiByNIP/" + id;

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
            public int IDPegawai { get; set; }
            public string Nama { get; set; }
            public string NIP18 { get; set; }
        }
        #endregion
    }
}