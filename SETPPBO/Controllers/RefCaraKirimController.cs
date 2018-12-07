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
    [Route("api/RefCaraKirim")]
    public class RefCaraKirimController : Controller
    {
        private readonly MainDbContext _context;

        public RefCaraKirimController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefCaraKirim
        [HttpGet]
        public async Task<IActionResult> GetRefCaraKirim()
        {
            var AllRefCaraKirim = await (from a in _context.RefCaraKirim
                                         where a.Uraian != "Online" 
                                         select new
                                         {
                                             a.RefCaraKirimId,
                                             a.Uraian
                                         }).ToListAsync();
            return Ok(AllRefCaraKirim);
        }

        // GET: api/RefCaraKirim
        [Route("DaftarCaraKirim")]
        [HttpGet]
        public async Task<IActionResult> GetDaftarCaraKirim()
        {
            var AllRefCaraKirim = await (from a in _context.RefCaraKirim
                                         select new
                                         {
                                             a.RefCaraKirimId,
                                             a.Uraian
                                         }).ToListAsync();
            return Ok(AllRefCaraKirim);
        }

        // GET: api/RefCaraKirim/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefCaraKirim([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refCaraKirim = await _context.RefCaraKirim.SingleOrDefaultAsync(m => m.RefCaraKirimId == id);

            if (refCaraKirim == null)
            {
                return NotFound();
            }

            return Ok(refCaraKirim);
        }

        // PUT: api/RefCaraKirim/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefCaraKirim([FromRoute] int id, [FromBody] RefCaraKirim refCaraKirim)
        {
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           if (id != refCaraKirim.RefCaraKirimId)
           {
               return BadRequest();
           }

           _context.Entry(refCaraKirim).State = EntityState.Modified;

           try
           {
               await _context.SaveChangesAsync();
           }
           catch (DbUpdateConcurrencyException)
           {
               if (!RefCaraKirimExists(id))
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

        // POST: api/RefCaraKirim
        [HttpPost]
        public async Task<IActionResult> PostRefCaraKirim([FromBody] RefCaraKirim refCaraKirim)
        {
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           _context.RefCaraKirim.Add(refCaraKirim);
           try
           {
               await _context.SaveChangesAsync();
           }
           catch (DbUpdateException)
           {
               if (RefCaraKirimExists(refCaraKirim.RefCaraKirimId))
               {
                   return new StatusCodeResult(StatusCodes.Status409Conflict);
               }
               else
               {
                   throw;
               }
           }

           return CreatedAtAction("GetRefCaraKirim", new { id = refCaraKirim.RefCaraKirimId }, refCaraKirim);
        }

        //DELETE: api/RefCaraKirim/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefCaraKirim([FromRoute] int id)
        {
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           var refCaraKirim = await _context.RefCaraKirim.SingleOrDefaultAsync(m => m.RefCaraKirimId == id);
           if (refCaraKirim == null)
           {
               return NotFound();
           }

           _context.RefCaraKirim.Remove(refCaraKirim);
           await _context.SaveChangesAsync();

           return Ok(refCaraKirim);
        }

        private bool RefCaraKirimExists(int id)
        {
            return _context.RefCaraKirim.Any(e => e.RefCaraKirimId == id);
        }
    }
}