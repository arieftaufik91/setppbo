using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/RefMajelis")]
    public class RefMajelisController : Controller
    {
        private readonly MainDbContext _context;

        public RefMajelisController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefMajelis
        [HttpGet]
        public IEnumerable<RefMajelis> GetRefMajelis()
        {
            return _context.RefMajelis;
        }

        // GET: api/RefMajelis
        [HttpPut("Filter/{filterOn}")]
        public async Task<IActionResult> GetRefMajelisByJenisPajak([FromRoute] bool filterOn, [FromBody] Permohonan permohonan = null)
        {
            if (!ModelState.IsValid && filterOn)
            {
                return BadRequest(ModelState);
            }

            var refMajelis = await _context.RefMajelis
                .Select(m => new {
                    m.RefMajelisId,
                    m.Majelis,
                    m.RefJenisKasusId
                })
                .ToListAsync();
            
            if (filterOn) {

                if (permohonan.RefJenisPemeriksaanId.Equals(1)) {
                    refMajelis = refMajelis 
                    .Where(m => m.RefJenisKasusId.Equals(3))
                    .ToList();
                } else {
                    refMajelis = refMajelis
                    .Where(m => _context.RefJenisPajak.Where(j => j.RefJenisPajakId.Equals(permohonan.RefJenisPajakId)).Select(j => j.RefJenisKasusId).FirstOrDefault().Equals(m.RefJenisKasusId))
                    .ToList();
                }
            }

            if (refMajelis == null)
            {
                return NotFound();
            }

            return Ok(refMajelis);
        }

        // GET: api/RefMajelis/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefMajelis([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refMajelis = await _context.RefMajelis.SingleOrDefaultAsync(m => m.RefMajelisId == id);

            if (refMajelis == null)
            {
                return NotFound();
            }

            return Ok(refMajelis);
        }

        // PUT: api/RefMajelis/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefMajelis([FromRoute] int id, [FromBody] RefMajelis refMajelis)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refMajelis.RefMajelisId)
            {
                return BadRequest();
            }

            _context.Entry(refMajelis).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefMajelisExists(id))
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

        // POST: api/RefMajelis
        [HttpPost]
        public async Task<IActionResult> PostRefMajelis([FromBody] RefMajelis refMajelis)
      {
  {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefMajelis.Add(refMajelis);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefMajelis", new { id = refMajelis.RefMajelisId }, refMajelis);
        }
      }
        // DELETE: api/RefMajelis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefMajelis([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refMajelis = await _context.RefMajelis.SingleOrDefaultAsync(m => m.RefMajelisId == id);
            if (refMajelis == null)
            {
                return NotFound();
            }

            _context.RefMajelis.Remove(refMajelis);
            await _context.SaveChangesAsync();

            return Ok(refMajelis);
        }

        private bool RefMajelisExists(int id)
        {
            return _context.RefMajelis.Any(e => e.RefMajelisId == id);
        }
    }
}