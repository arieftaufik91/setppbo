using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/Kelengkapan")]
    public class KelengkapanController : Controller
    {
        private readonly MainDbContext _context;

        public KelengkapanController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/Kelengkapan
        [HttpGet]
        public IEnumerable<Kelengkapan> GetKelengkapan()
        {
            return _context.Kelengkapan;
        }

        // GET: api/Kelengkapan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKelengkapan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var kelengkapan = await _context.Kelengkapan.SingleOrDefaultAsync(m => m.KelengkapanId == id);

            if (kelengkapan == null)
            {
                return NotFound();
            }

            return Ok(kelengkapan);
        }

        // GET: api/Kelengkapan/5
        [Route("Pemohon/{id}")]

        public async Task<IActionResult> GetByPemohonId([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var AllKelengkapan = await (from a in _context.Kelengkapan
                                  join b in _context.RefDokumen
                                  on a.RefDokumenId equals b.RefDokumenId
                                  select new
                                  {
                                      a.KelengkapanId,
                                      a.PermohonanId,
                                      a.RefDokumenId,
                                      RefDokumenUr = b.Uraian,
                                      b.JenisFile,
                                      b.Mandatory,
                                      a.Uraian,
                                      a.FileId,
                                      a.Valid,
                                      a.Keterangan
                                  }).ToListAsync();

            return Ok(AllKelengkapan);
        }
        // PUT: api/Kelengkapan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKelengkapan([FromRoute] string id, [FromBody] Kelengkapan kelengkapan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != kelengkapan.KelengkapanId)
            {
                return BadRequest();
            }

            _context.Entry(kelengkapan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KelengkapanExists(id))
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

        // POST: api/Kelengkapan
        [HttpPost]
        public async Task<IActionResult> PostKelengkapan([FromBody] Kelengkapan kelengkapan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Kelengkapan.Add(kelengkapan);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (KelengkapanExists(kelengkapan.KelengkapanId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetKelengkapan", new { id = kelengkapan.KelengkapanId }, kelengkapan);
        }

        // DELETE: api/Kelengkapan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKelengkapan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var kelengkapan = await _context.Kelengkapan.SingleOrDefaultAsync(m => m.KelengkapanId == id);
            if (kelengkapan == null)
            {
                return NotFound();
            }

            _context.Kelengkapan.Remove(kelengkapan);
            await _context.SaveChangesAsync();

            return Ok(kelengkapan);
        }

        private bool KelengkapanExists(string id)
        {
            return _context.Kelengkapan.Any(e => e.KelengkapanId == id);
        }
    }
}