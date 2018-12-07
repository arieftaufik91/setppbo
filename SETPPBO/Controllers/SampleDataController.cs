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
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private readonly MainDbContext _context;

        public SampleDataController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/SampleData
        [HttpGet]
        public IEnumerable<SampleData> GetSampleData()
        {
            return _context.SampleData;
        }

        // GET: api/SampleData/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSampleData([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sampleData = await _context.SampleData.SingleOrDefaultAsync(m => m.QuoteId == id);

            if (sampleData == null)
            {
                return NotFound();
            }

            return Ok(sampleData);
        }

        // PUT: api/SampleData/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSampleData([FromRoute] int id, [FromBody] SampleData sampleData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sampleData.QuoteId)
            {
                return BadRequest();
            }

            _context.Entry(sampleData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SampleDataExists(id))
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

        // POST: api/SampleData
        [HttpPost]
        public async Task<IActionResult> PostSampleData([FromBody] SampleData sampleData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // simpan modified by dan date
            var claim = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name);
            var userId = claim.Value;
            sampleData.CreatedBy = Int32.Parse(userId);
            sampleData.CreatedDate = DateTime.Now;
            _context.SampleData.Add(sampleData);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSampleData", new { id = sampleData.QuoteId }, sampleData);
        }

        // DELETE: api/SampleData/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSampleData([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sampleData = await _context.SampleData.SingleOrDefaultAsync(m => m.QuoteId == id);
            if (sampleData == null)
            {
                return NotFound();
            }

            _context.SampleData.Remove(sampleData);
            await _context.SaveChangesAsync();

            return Ok(sampleData);
        }

        private bool SampleDataExists(int id)
        {
            return _context.SampleData.Any(e => e.QuoteId == id);
        }
    }
}