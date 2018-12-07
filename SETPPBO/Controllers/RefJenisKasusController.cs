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
    [Route("api/RefJenisKasus")]
    public class RefJenisKasusController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisKasusController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisKasus
        [HttpGet]
        public IEnumerable<RefJenisKasus> GetRefJenisKasus()
        {
            return _context.RefJenisKasus;
        }

        // GET: api/RefJenisKasus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisKasus([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisKasus = await _context.RefJenisKasus.SingleOrDefaultAsync(m => m.RefJenisKasusId == id);

            if (refJenisKasus == null)
            {
                return NotFound();
            }

            return Ok(refJenisKasus);
        }

        // PUT: api/RefJenisKasus/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRefJenisKasus([FromRoute] int id, [FromBody] RefJenisKasus refJenisKasus)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != refJenisKasus.RefJenisKasusId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(refJenisKasus).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RefJenisKasusExists(id))
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

        // POST: api/RefJenisKasus
        //[HttpPost]
        //public async Task<IActionResult> PostRefJenisKasus([FromBody] RefJenisKasus refJenisKasus)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.RefJenisKasus.Add(refJenisKasus);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (RefJenisKasusExists(refJenisKasus.RefJenisKasusId))
        //        {
        //            return new StatusCodeResult(StatusCodes.Status409Conflict);
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetRefJenisKasus", new { id = refJenisKasus.RefJenisKasusId }, refJenisKasus);
        //}

        // DELETE: api/RefJenisKasus/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefJenisKasus([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refJenisKasus = await _context.RefJenisKasus.SingleOrDefaultAsync(m => m.RefJenisKasusId == id);
        //    if (refJenisKasus == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefJenisKasus.Remove(refJenisKasus);
        //    await _context.SaveChangesAsync();

        //    return Ok(refJenisKasus);
        //}

        private bool RefJenisKasusExists(int id)
        {
            return _context.RefJenisKasus.Any(e => e.RefJenisKasusId == id);
        }
    }
}