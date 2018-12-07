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
    [Route("api/Penomoran")]
    public class PenomoranController : Controller
    {
        private readonly MainDbContext _context;

        public PenomoranController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/Penomoran
        [HttpGet]
        public IEnumerable<Penomoran> GetPenomoran()
        {
            return _context.Penomoran.Include(x=> x.RefJenisPenomoran).OrderByDescending(x=> x.Tahun);
        }

        // GET: api/Penomoran/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPenomoran([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var penomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.PenomoranId == id);

            if (penomoran == null)
            {
                return NotFound();
            }

            return Ok(penomoran);
        }

        // PUT: api/Penomoran/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPenomoran([FromRoute] int id, [FromBody] Penomoran penomoran)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != penomoran.PenomoranId)
            {
                return BadRequest();
            }

            _context.Entry(penomoran).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PenomoranExists(id))
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

        // POST: api/Penomoran
        [HttpPost]
        public async Task<IActionResult> PostPenomoran([FromBody] Penomoran penomoran)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Penomoran.Add(penomoran);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPenomoran", new { id = penomoran.PenomoranId }, penomoran);
        }

        // DELETE: api/Penomoran/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePenomoran([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var penomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.PenomoranId == id);
            if (penomoran == null)
            {
                return NotFound();
            }

            _context.Penomoran.Remove(penomoran);
            await _context.SaveChangesAsync();

            return Ok(penomoran);
        }

        private bool PenomoranExists(int id)
        {
            return _context.Penomoran.Any(e => e.PenomoranId == id);
        }
    }
}