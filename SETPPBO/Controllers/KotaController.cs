using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Filters;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Kota")]
    public class KotaController : KsbBaseController
    {
        public KotaController(IConfiguration configuration) : base(configuration)
        {
        }

        [BypassFilter]
        public async Task<IActionResult> GetAllKota()
        {
            var result = await GetStringAsync("/hris/api/kota/GetAllKota");
            return Ok(JsonConvert.DeserializeObject(result));
        }

        [BypassFilter]
        [Route("/GetProvinsi")]
        public async Task<IActionResult> GetAllProvinsi()
        {
            var result = await GetStringAsync("/hris/api/kota/GetAllProvinsi");
            return Ok(JsonConvert.DeserializeObject(result));
        }

        [BypassFilter]
        [Route("AllOrganisasi")]
        public async Task<IActionResult> GetAllOrganisasi()
        {
            var result = await GetStringAsync("/hris/api/Organisasi/GetUnitOptions/589");

            return Ok(JsonConvert.DeserializeObject(result));
        }
    }
}