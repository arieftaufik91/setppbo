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
    [Route("api/RefJenisNormaWaktu")]
    public class RefJenisNormaWaktuController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisNormaWaktuController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisNormaWaktu
        [HttpGet]
        public IEnumerable<RefJenisNormaWaktu> GetRefJenisNormaWaktu()
        {

            return _context.RefJenisNormaWaktu;
        }

        // GET: api/RefJenisNormaWaktu/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisNormaWaktu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisNormaWaktu = await _context.RefJenisNormaWaktu.SingleOrDefaultAsync(m => m.RefJenisNormaWaktuId == id);

            if (refJenisNormaWaktu == null)
            {
                return NotFound();
            }

            return Ok(refJenisNormaWaktu);
        }

        // PUT: api/RefJenisNormaWaktu/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefJenisNormaWaktu([FromRoute] int id, [FromBody] RefJenisNormaWaktu refJenisNormaWaktu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refJenisNormaWaktu.RefJenisNormaWaktuId)
            {
                return BadRequest();
            }

            _context.Entry(refJenisNormaWaktu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefJenisNormaWaktuExists(id))
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

        // POST: api/RefJenisNormaWaktu
        [HttpPost]
        public async Task<IActionResult> PostRefJenisNormaWaktu([FromBody] RefJenisNormaWaktu refJenisNormaWaktu)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefJenisNormaWaktu.Add(refJenisNormaWaktu);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefJenisNormaWaktuExists(refJenisNormaWaktu.RefJenisNormaWaktuId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRefJenisNormaWaktu", new { id = refJenisNormaWaktu.RefJenisNormaWaktuId }, refJenisNormaWaktu);
        }

        // DELETE: api/RefJenisNormaWaktu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefJenisNormaWaktu([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisNormaWaktu = await _context.RefJenisNormaWaktu.SingleOrDefaultAsync(m => m.RefJenisNormaWaktuId == id);
            if (refJenisNormaWaktu == null)
            {
                return NotFound();
            }

            _context.RefJenisNormaWaktu.Remove(refJenisNormaWaktu);
            await _context.SaveChangesAsync();

            return Ok(refJenisNormaWaktu);
        }

        private bool RefJenisNormaWaktuExists(int id)
        {
            return _context.RefJenisNormaWaktu.Any(e => e.RefJenisNormaWaktuId == id);
        }
    }
}