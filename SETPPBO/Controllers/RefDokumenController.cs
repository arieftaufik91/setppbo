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
    [Route("api/RefDokumen")]
    public class RefDokumenController : Controller
    {
        private readonly MainDbContext _context;

        public RefDokumenController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefDokumen
        [HttpGet]
        public IEnumerable<RefDokumen> GetRefDokumen()
        {
            return _context.RefDokumen;
        }

        // GET: api/RefDokumen/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefDokumen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refDokumen = await _context.RefDokumen.SingleOrDefaultAsync(m => m.RefDokumenId == id);

            if (refDokumen == null)
            {
                return NotFound();
            }

            return Ok(refDokumen);
        }

        // PUT: api/RefDokumen/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefDokumen([FromRoute] int id, [FromBody] RefDokumen refDokumen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refDokumen.RefDokumenId)
            {
                return BadRequest();
            }

            _context.Entry(refDokumen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefDokumenExists(id))
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

        // POST: api/RefDokumen
        [HttpPost]
        public async Task<IActionResult> PostRefDokumen([FromBody] RefDokumen refDokumen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefDokumen.Add(refDokumen);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefDokumenExists(refDokumen.RefDokumenId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRefDokumen", new { id = refDokumen.RefDokumenId }, refDokumen);
        }

        // DELETE: api/RefDokumen/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefDokumen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refDokumen = await _context.RefDokumen.SingleOrDefaultAsync(m => m.RefDokumenId == id);
            if (refDokumen == null)
            {
                return NotFound();
            }

            _context.RefDokumen.Remove(refDokumen);
            await _context.SaveChangesAsync();

            return Ok(refDokumen);
        }

        private bool RefDokumenExists(int id)
        {
            return _context.RefDokumen.Any(e => e.RefDokumenId == id);
        }
    }
}