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
    [Route("api/RefNormaWaktu")]
    public class RefNormaWaktuController : Controller
    {
        private readonly MainDbContext _context;

        public RefNormaWaktuController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefNormaWaktu
        [HttpGet]
        public IEnumerable<RefNormaWaktu> GetRefNormaWaktu()
        {
            return _context.RefNormaWaktu.Include(x=> x.RefJenisNormaWaktu).Include(x=> x.RefJenisPermohonan);
        }

        // GET: api/RefNormaWaktu/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefNormaWaktu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refNormaWaktu = await _context.RefNormaWaktu.SingleOrDefaultAsync(m => m.RefNormaWaktuId == id);

            if (refNormaWaktu == null)
            {
                return NotFound();
            }

            return Ok(refNormaWaktu);
        }

        // PUT: api/RefNormaWaktu/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefNormaWaktu([FromRoute] int id, [FromBody] RefNormaWaktu refNormaWaktu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refNormaWaktu.RefNormaWaktuId)
            {
                return BadRequest();
            }

            _context.Entry(refNormaWaktu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefNormaWaktuExists(id))
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

        // POST: api/RefNormaWaktu
        [HttpPost]
        public async Task<IActionResult> PostRefNormaWaktu([FromBody] RefNormaWaktu refNormaWaktu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefNormaWaktu.Add(refNormaWaktu);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefNormaWaktuExists(refNormaWaktu.RefNormaWaktuId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRefNormaWaktu", new { id = refNormaWaktu.RefNormaWaktuId }, refNormaWaktu);
        }

        // DELETE: api/RefNormaWaktu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefNormaWaktu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refNormaWaktu = await _context.RefNormaWaktu.SingleOrDefaultAsync(m => m.RefNormaWaktuId == id);
            if (refNormaWaktu == null)
            {
                return NotFound();
            }

            _context.RefNormaWaktu.Remove(refNormaWaktu);
            await _context.SaveChangesAsync();

            return Ok(refNormaWaktu);
        }

        private bool RefNormaWaktuExists(int id)
        {
            return _context.RefNormaWaktu.Any(e => e.RefNormaWaktuId == id);
        }
    }
}