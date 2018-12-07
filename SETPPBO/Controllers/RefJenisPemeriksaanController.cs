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
    [Route("api/RefJenisPemeriksaan")]
    public class RefJenisPemeriksaanController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisPemeriksaanController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisPemeriksaan
        [HttpGet]
        public IEnumerable<RefJenisPemeriksaan> GetRefJenisPemeriksaan()
        {
            return _context.RefJenisPemeriksaan;
        }

        // GET: api/RefJenisPemeriksaan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisPemeriksaan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisPemeriksaan = await _context.RefJenisPemeriksaan.SingleOrDefaultAsync(m => m.RefJenisPemeriksaanId == id);

            if (refJenisPemeriksaan == null)
            {
                return NotFound();
            }

            return Ok(refJenisPemeriksaan);
        }

        // PUT: api/RefJenisPemeriksaan/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRefJenisPemeriksaan([FromRoute] int id, [FromBody] RefJenisPemeriksaan refJenisPemeriksaan)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != refJenisPemeriksaan.RefJenisPemeriksaanId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(refJenisPemeriksaan).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RefJenisPemeriksaanExists(id))
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

        // POST: api/RefJenisPemeriksaan
        //[HttpPost]
        //public async Task<IActionResult> PostRefJenisPemeriksaan([FromBody] RefJenisPemeriksaan refJenisPemeriksaan)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.RefJenisPemeriksaan.Add(refJenisPemeriksaan);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (RefJenisPemeriksaanExists(refJenisPemeriksaan.RefJenisPemeriksaanId))
        //        {
        //            return new StatusCodeResult(StatusCodes.Status409Conflict);
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetRefJenisPemeriksaan", new { id = refJenisPemeriksaan.RefJenisPemeriksaanId }, refJenisPemeriksaan);
        //}

        // DELETE: api/RefJenisPemeriksaan/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefJenisPemeriksaan([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refJenisPemeriksaan = await _context.RefJenisPemeriksaan.SingleOrDefaultAsync(m => m.RefJenisPemeriksaanId == id);
        //    if (refJenisPemeriksaan == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefJenisPemeriksaan.Remove(refJenisPemeriksaan);
        //    await _context.SaveChangesAsync();

        //    return Ok(refJenisPemeriksaan);
        //}

        private bool RefJenisPemeriksaanExists(int id)
        {
            return _context.RefJenisPemeriksaan.Any(e => e.RefJenisPemeriksaanId == id);
        }
    }
}