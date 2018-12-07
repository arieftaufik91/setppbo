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
    [Route("api/RefJenisPermohonan")]
    public class RefJenisPermohonanController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisPermohonanController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisPermohonan
        [HttpGet]
        public async Task<IActionResult> GetRefJenisPermohonan()
        {
            var AllRefJenisPermohon = await (from a in _context.RefJenisPermohonan
                                             select new
                                             {
                                                 a.RefJenisPermohonanId,
                                                 a.Uraian
                                             }).ToListAsync();
            return Ok(AllRefJenisPermohon);
        }

        // GET: api/RefJenisPermohonan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisPermohonan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisPermohonan = await _context.RefJenisPermohonan.SingleOrDefaultAsync(m => m.RefJenisPermohonanId == id);

            if (refJenisPermohonan == null)
            {
                return NotFound();
            }

            return Ok(refJenisPermohonan);
        }

        // PUT: api/RefJenisPermohonan/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRefJenisPermohonan([FromRoute] int id, [FromBody] RefJenisPermohonan refJenisPermohonan)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != refJenisPermohonan.RefJenisPermohonanId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(refJenisPermohonan).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RefJenisPermohonanExists(id))
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

        // POST: api/RefJenisPermohonan
        //[HttpPost]
        //public async Task<IActionResult> PostRefJenisPermohonan([FromBody] RefJenisPermohonan refJenisPermohonan)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.RefJenisPermohonan.Add(refJenisPermohonan);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (RefJenisPermohonanExists(refJenisPermohonan.RefJenisPermohonanId))
        //        {
        //            return new StatusCodeResult(StatusCodes.Status409Conflict);
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetRefJenisPermohonan", new { id = refJenisPermohonan.RefJenisPermohonanId }, refJenisPermohonan);
        //}

        // DELETE: api/RefJenisPermohonan/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefJenisPermohonan([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refJenisPermohonan = await _context.RefJenisPermohonan.SingleOrDefaultAsync(m => m.RefJenisPermohonanId == id);
        //    if (refJenisPermohonan == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefJenisPermohonan.Remove(refJenisPermohonan);
        //    await _context.SaveChangesAsync();

        //    return Ok(refJenisPermohonan);
        //}

        private bool RefJenisPermohonanExists(int id)
        {
            return _context.RefJenisPermohonan.Any(e => e.RefJenisPermohonanId == id);
        }
    }
}