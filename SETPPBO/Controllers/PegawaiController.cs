using Microsoft.AspNetCore.Mvc;
using SETPPBO.Filters;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace SETPPBO.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    public class PegawaiController : KsbBaseController
    {
        public PegawaiController(IConfiguration configuration) : base(configuration)
        {
        }

        [BypassFilter]
        public async Task<IActionResult> GetPegawaiInfo() 
        {
            var result = await GetStringAsync("/hris/api/pegawai/GetPegawaiInfo");
            return Ok(result);
        }
    }
}