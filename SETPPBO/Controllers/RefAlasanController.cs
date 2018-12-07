using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/RefAlasan")]
    public class RefAlasanController : Controller
    {
        private readonly MainDbContext _context;

        public RefAlasanController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefAlasan
        [HttpGet]
        public IEnumerable<RefAlasan> GetRefAlasan()
        {
            return _context.RefAlasan;
        }

        // GET: api/RefAlasan
        [Route("Active")]
        public async Task<IActionResult> GetRefAlasanActive()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refAlasan = await _context.RefAlasan
                .Where(a => a.Status)
                .Select(a => new {
                    a.RefAlasanId,
                    a.Uraian
                })
                .ToListAsync();

            if (refAlasan == null)
            {
                return NotFound();
            }

            return Ok(refAlasan);
        }

        // GET: api/RefAlasan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefAlasan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refAlasan = await _context.RefAlasan.SingleOrDefaultAsync(m => m.RefAlasanId == id);

            if (refAlasan == null)
            {
                return NotFound();
            }

            return Ok(refAlasan);
        }

        // PUT: api/RefAlasan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefAlasan([FromRoute] int id, [FromBody] RefAlasan refAlasan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refAlasan.RefAlasanId)
            {
                return BadRequest();
            }

            _context.Entry(refAlasan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefAlasanExists(id))
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

        // POST: api/RefAlasan
        [HttpPost]
        public async Task<IActionResult> PostRefAlasan([FromBody] RefAlasan refAlasan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefAlasan.Add(refAlasan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefAlasan", new { id = refAlasan.RefAlasanId }, refAlasan);
        }

        // DELETE: api/RefAlasan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefAlasan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refAlasan = await _context.RefAlasan.SingleOrDefaultAsync(m => m.RefAlasanId == id);
            if (refAlasan == null)
            {
                return NotFound();
            }

            _context.RefAlasan.Remove(refAlasan);
            await _context.SaveChangesAsync();

            return Ok(refAlasan);
        }

        private bool RefAlasanExists(int id)
        {
            return _context.RefAlasan.Any(e => e.RefAlasanId == id);
        }
    }
}