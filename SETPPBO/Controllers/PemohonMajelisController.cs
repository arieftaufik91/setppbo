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
    [Route("api/PemohonMajelis")]
    public class PemohonMajelisController : Controller
    {
        private readonly MainDbContext _context;

        public PemohonMajelisController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/PemohonMajelis
        [HttpGet]
        public IEnumerable<PemohonMajelis> GetPemohonMajelis()
        {
            return _context.PemohonMajelis;
        }

        // GET: api/PemohonMajelis/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPemohonMajelis([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pemohonMajelis = await _context.PemohonMajelis.SingleOrDefaultAsync(m => m.PemohonMajelisId == id);

            if (pemohonMajelis == null)
            {
                return NotFound();
            }

            return Ok(pemohonMajelis);
        }

        // PUT: api/PemohonMajelis/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPemohonMajelis([FromRoute] int id, [FromBody] PemohonMajelis pemohonMajelis)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohonMajelis.PemohonMajelisId)
            {
                return BadRequest();
            }

            _context.Entry(pemohonMajelis).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PemohonMajelisExists(id))
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

        // POST: api/PemohonMajelis
        [HttpPost]
        public async Task<IActionResult> PostPemohonMajelis([FromBody] PemohonMajelis pemohonMajelis)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.PemohonMajelis.Add(pemohonMajelis);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPemohonMajelis", new { id = pemohonMajelis.PemohonMajelisId }, pemohonMajelis);
        }

        // DELETE: api/PemohonMajelis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePemohonMajelis([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pemohonMajelis = await _context.PemohonMajelis.SingleOrDefaultAsync(m => m.PemohonMajelisId == id);
            if (pemohonMajelis == null)
            {
                return NotFound();
            }

            _context.PemohonMajelis.Remove(pemohonMajelis);
            await _context.SaveChangesAsync();

            return Ok(pemohonMajelis);
        }

        private bool PemohonMajelisExists(int id)
        {
            return _context.PemohonMajelis.Any(e => e.PemohonMajelisId == id);
        }
    }
}