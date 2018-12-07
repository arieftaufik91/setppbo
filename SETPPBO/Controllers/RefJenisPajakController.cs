using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/RefJenisPajak")]
    public class RefJenisPajakController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisPajakController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisPajak
        [HttpGet]
        public IEnumerable<RefJenisPajak> GetRefJenisPajak()
        {

            return _context.RefJenisPajak.Include(x => x.RefJenisKasus);
        }

        // GET: api/RefJenisPajak/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisPajak([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisPajak = await _context.RefJenisPajak.SingleOrDefaultAsync(m => m.RefJenisPajakId == id);

            if (refJenisPajak == null)
            {
                return NotFound();
            }

            return Ok(refJenisPajak);
        }

        // PUT: api/RefJenisPajak/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRefJenisPajak([FromRoute] int id, [FromBody] RefJenisPajak refJenisPajak)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != refJenisPajak.RefJenisPajakId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(refJenisPajak).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RefJenisPajakExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

       
        [HttpPost]
        public async Task<IActionResult> PostRefJenisPajak([FromBody] RefJenisPajak refJenisPajak)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefJenisPajak.Add(refJenisPajak);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefJenisPajakExists(refJenisPajak.RefJenisPajakId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRefJenisPajak", new { id = refJenisPajak.RefJenisPajakId }, refJenisPajak);
        }

        // DELETE: api/RefJenisPajak/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefJenisPajak([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refJenisPajak = await _context.RefJenisPajak.SingleOrDefaultAsync(m => m.RefJenisPajakId == id);
        //    if (refJenisPajak == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefJenisPajak.Remove(refJenisPajak);
        //    await _context.SaveChangesAsync();

        //    return Ok(refJenisPajak);
        //}

        private bool RefJenisPajakExists(int id)
        {
            return _context.RefJenisPajak.Any(e => e.RefJenisPajakId == id);
        }
    }
}