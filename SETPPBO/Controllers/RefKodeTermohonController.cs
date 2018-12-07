using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using SETPPBO.Models;
using SETPPBO.Utility;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/RefKodeTermohon")]
    public class RefKodeTermohonController : Controller
    {
        private readonly MainDbContext _context;

        private int _pegawaiId;

        public RefKodeTermohonController(MainDbContext context)
        {
            _context = context;
        }

       

        // GET: api/RefKotaTermohon
        [HttpGet]
        public async Task<IActionResult> GetRefKodeTermohon()
        {
            var result = await _context.RefKodeTermohon
                .Select(a => new
                {
                    a.OrganisasiId,
                    a.IndukOrganisasiId,
                    a.KodeOrganisasi,
                    a.Level,
                    a.UraianOrganisasi,
                    a.UraianLengkapOrganisasi,
                    a.UraianJabatan,
                    a.KodeSatker,
                    a.Alamat,
                    a.Kota,
                    a.KodePos,
                    a.KodeSurat
                })
                .ToListAsync();

            return Ok(result);
        }

        // POST: api/RefKodeTermohon
        [HttpPost]
        public async Task<IActionResult> PostRefKodeTermohon([FromBody] RefKodeTermohon refKodeTermohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefKodeTermohon.Add(refKodeTermohon);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefKodeTermohon", new { id = refKodeTermohon.OrganisasiId }, refKodeTermohon);
        }

        // PUT: api/RefKodeTermohon/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefKodeTermohon([FromRoute] int id, [FromBody] RefKodeTermohon refKodeTermohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refKodeTermohon.OrganisasiId)
            {
                return BadRequest();
            }

            _context.Entry(refKodeTermohon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                            }

            return NoContent();
        }
    }
}