using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/RefJenisKetetapan")]
    public class RefJenisKetetapanController : Controller
    {
        private readonly MainDbContext _context;

        public RefJenisKetetapanController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/RefJenisKetetapan
        [HttpGet]
        public IEnumerable<RefJenisKetetapan> GetRefJenisKetetapan()
        {
            return _context.RefJenisKetetapan;
        }

        // GET: api/RefJenisKetetapan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefJenisKetetapan([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refJenisKetetapan = await _context.RefJenisKetetapan.SingleOrDefaultAsync(m => m.RefJenisKetetapanId == id);

            if (refJenisKetetapan == null)
            {
                return NotFound();
            }

            return Ok(refJenisKetetapan);
        }

        // PUT: api/RefJenisKetetapan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefJenisKetetapan([FromRoute] int id, [FromBody] RefJenisKetetapan refJenisKetetapan)
        {
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           if (id != refJenisKetetapan.RefJenisKetetapanId)
           {
               return BadRequest();
           }

           _context.Entry(refJenisKetetapan).State = EntityState.Modified;

           try
           {
               await _context.SaveChangesAsync();
           }
           catch (DbUpdateConcurrencyException)
           {
               if (!RefJenisKetetapanExists(id))
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

        // POST: api/RefJenisKetetapan
        [HttpPost]
        public async Task<IActionResult> PostRefJenisKetetapan([FromBody] RefJenisKetetapan refJenisKetetapan)
        {
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           _context.RefJenisKetetapan.Add(refJenisKetetapan);
           try
           {
               await _context.SaveChangesAsync();
           }
           catch (DbUpdateException)
           {
               if (RefJenisKetetapanExists(refJenisKetetapan.RefJenisKetetapanId))
               {
                   return new StatusCodeResult(StatusCodes.Status409Conflict);
               }
               else
               {
                   throw;
               }
           }

           return CreatedAtAction("GetRefJenisKetetapan", new { id = refJenisKetetapan.RefJenisKetetapanId }, refJenisKetetapan);
        }

        // DELETE: api/RefJenisKetetapan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefJenisKetetapan([FromRoute] int id)
        {
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           var refJenisKetetapan = await _context.RefJenisKetetapan.SingleOrDefaultAsync(m => m.RefJenisKetetapanId == id);
           if (refJenisKetetapan == null)
           {
               return NotFound();
           }

           _context.RefJenisKetetapan.Remove(refJenisKetetapan);
           await _context.SaveChangesAsync();

           return Ok(refJenisKetetapan);
        }

        private bool RefJenisKetetapanExists(int id)
        {
            return _context.RefJenisKetetapan.Any(e => e.RefJenisKetetapanId == id);
        }
    }
}