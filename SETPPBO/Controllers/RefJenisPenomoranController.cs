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
    [Route("api/RefJenisPenomoran")]
    public class RefJenisPenomoranController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisPenomoranController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisPenomoran
        [HttpGet]
        public IEnumerable<RefJenisPenomoran> GetRefJenisPenomoran()
        {
            return _context.RefJenisPenomoran;
        }

        // GET: api/RefJenisPenomoran/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisPenomoran([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisPenomoran = await _context.RefJenisPenomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == id);

            if (refJenisPenomoran == null)
            {
                return NotFound();
            }

            return Ok(refJenisPenomoran);
        }

        // PUT: api/RefJenisPenomoran/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRefJenisPenomoran([FromRoute] int id, [FromBody] RefJenisPenomoran refJenisPenomoran)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != refJenisPenomoran.RefJenisPenomoranId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(refJenisPenomoran).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RefJenisPenomoranExists(id))
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

        // POST: api/RefJenisPenomoran
        //[HttpPost]
        //public async Task<IActionResult> PostRefJenisPenomoran([FromBody] RefJenisPenomoran refJenisPenomoran)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.RefJenisPenomoran.Add(refJenisPenomoran);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetRefJenisPenomoran", new { id = refJenisPenomoran.RefJenisPenomoranId }, refJenisPenomoran);
        //}

        // DELETE: api/RefJenisPenomoran/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefJenisPenomoran([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refJenisPenomoran = await _context.RefJenisPenomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == id);
        //    if (refJenisPenomoran == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefJenisPenomoran.Remove(refJenisPenomoran);
        //    await _context.SaveChangesAsync();

        //    return Ok(refJenisPenomoran);
        //}

        private bool RefJenisPenomoranExists(int id)
        {
            return _context.RefJenisPenomoran.Any(e => e.RefJenisPenomoranId == id);
        }
    }
}