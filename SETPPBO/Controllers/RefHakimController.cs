using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/RefHakim")]
    public class RefHakimController : Controller
    {
        private readonly MainDbContext _context;

        public RefHakimController(MainDbContext context)
        {
            _context = context;
        }

        //~ get all hakim (filtered)
        // GET: api/RefHakim
        [HttpGet]
        //public IEnumerable<RefHakim> GetRefHakim()
        public async Task<IActionResult> GetRefHakim()
        {
            return Ok(await _context.RefHakim
                .Select(a => new
                {
                    a.RefHakimId,
                    a.Nama,
                    a.Nik,
                    a.PegawaiId
                })
                .ToListAsync()
            );
            //return _context.RefHakim;
        }

        // GET: api/RefHakim/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefHakim([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refHakim = await _context.RefHakim.SingleOrDefaultAsync(m => m.RefHakimId == id);

            if (refHakim == null)
            {
                return NotFound();
            }

            return Ok(refHakim);
        }

        // PUT: api/RefHakim/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefHakim([FromRoute] int id, [FromBody] RefHakim refHakim)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refHakim.RefHakimId)
            {
                return BadRequest();
            }

            //~ check if exist by nik
            if (RefHakimExistsByNik(refHakim.Nik))
            {
                return BadRequest();
            }

            //_context.Entry(refHakim).State = EntityState.Modified;
            _context.Entry(refHakim).Property(x => x.Nama).IsModified = true;
            _context.Entry(refHakim).Property(x => x.Nik).IsModified = true;
            _context.Entry(refHakim).Property(x => x.PegawaiId).IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefHakimExists(id))
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

        // POST: api/RefHakim
        [HttpPost]
        public async Task<IActionResult> PostRefHakim([FromBody] RefHakim refHakim)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //~ check if exist by nik
            if (RefHakimExistsByNik(refHakim.Nik))
            {
                return BadRequest();
            }

            _context.RefHakim.Add(refHakim);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefHakimExists(refHakim.RefHakimId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRefHakim", new { id = refHakim.RefHakimId }, refHakim);
        }

        // DELETE: api/RefHakim/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefHakim([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refHakim = await _context.RefHakim.SingleOrDefaultAsync(m => m.RefHakimId == id);
            if (refHakim == null)
            {
                return NotFound();
            }

            _context.RefHakim.Remove(refHakim);
            await _context.SaveChangesAsync();

            return Ok(refHakim);
        }

        private bool RefHakimExists(int id)
        {
            return _context.RefHakim.Any(e => e.RefHakimId == id);
        }

        //~ return true if exist by Nik, or false if otherwise or Nik is null or empty
        private bool RefHakimExistsByNik(string id)
        {
            return string.IsNullOrEmpty(id)? false : _context.RefHakim.Any(e => e.Nik == id);
            //return _context.RefHakim.Any(e => e.Nik == id);
        }
    }
}