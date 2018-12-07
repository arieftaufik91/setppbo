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
    [Route("api/RefStatus")]
    public class RefStatusController : Controller
    {
        private readonly MainDbContext _context;

        public RefStatusController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefStatus
        [HttpGet]
        public IEnumerable<RefStatus> GetRefStatus()
        {
            return _context.RefStatus;
        }

        // GET: api/RefStatus/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefStatus([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refStatus = await _context.RefStatus.SingleOrDefaultAsync(m => m.RefStatusId == id);

            if (refStatus == null)
            {
                return NotFound();
            }

            return Ok(refStatus);
        }

        // PUT: api/RefStatus/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRefStatus([FromRoute] int id, [FromBody] RefStatus refStatus)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != refStatus.RefStatusId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(refStatus).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RefStatusExists(id))
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

        // POST: api/RefStatus
        //[HttpPost]
        //public async Task<IActionResult> PostRefStatus([FromBody] RefStatus refStatus)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.RefStatus.Add(refStatus);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (RefStatusExists(refStatus.RefStatusId))
        //        {
        //            return new StatusCodeResult(StatusCodes.Status409Conflict);
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetRefStatus", new { id = refStatus.RefStatusId }, refStatus);
        //}

        // DELETE: api/RefStatus/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefStatus([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refStatus = await _context.RefStatus.SingleOrDefaultAsync(m => m.RefStatusId == id);
        //    if (refStatus == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefStatus.Remove(refStatus);
        //    await _context.SaveChangesAsync();

        //    return Ok(refStatus);
        //}

        private bool RefStatusExists(int id)
        {
            return _context.RefStatus.Any(e => e.RefStatusId == id);
        }
    }
}