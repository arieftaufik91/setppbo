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
    [Route("api/Audit")]
    public class AuditController : Controller
    {
        private readonly MainDbContext _context;

        public AuditController(MainDbContext context)
        {
            _context = context;
        }

        //~ audit by sengketa
        // GET: api/Audit/Sengketa
        [Route("Sengketa")]
        [HttpGet]
        public async Task<IActionResult> GetAuditSengketa()
        {
            var result =
            await _context.Audit
                .Select(s => new { s.AuditId, s.PermohonanId })
                .GroupBy(a => new { a.PermohonanId })
                .Select(g => new { g.Key.PermohonanId, Count = g.Count() })
                .Join(
                    _context.Permohonan,
                    aud => aud.PermohonanId,
                    per => per.PermohonanId,
                    (aud, per) => new
                    {
                        aud.PermohonanId,
                        per.NoSuratPermohonan,
                        aud.Count
                    }
                )
                .OrderBy(g => g.PermohonanId)
                .ToListAsync();

            return Ok(result);
        }

        //~ audit by sengketa
        // GET: api/Audit/Sengketa/5
        [Route("Sengketa/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuditSengketa([FromRoute] string id)
        {
            if (id.Length != 36)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var audit = await _context.Audit
                .Where(a => a.PermohonanId == id)
                .Join(
                    _context.Permohonan,
                    aud => aud.PermohonanId,
                    per => per.PermohonanId,
                    (aud, per) => new
                    {
                        aud.AuditId,
                        aud.LogDate,
                        aud.Method,
                        aud.StringUrl,
                        aud.Name,
                        aud.NewValue,
                        aud.OldValue,
                        aud.PermohonanId,
                        aud.UserId,
                        aud.CompIp,
                        aud.CompMacAddress,
                        aud.CompName,
                        per.NoSuratPermohonan,
                    }
                )
                .ToListAsync();

            if (audit == null)
            {
                return NotFound();
            }

            return Ok(audit);
        }

        //~ audit by user
        // GET: api/Audit/User
        [Route("User")]
        [HttpGet]
        public async Task<IActionResult> GetAuditUser()
        {
            var result =
                await _context.Audit
                .Select(s => new { s.AuditId, s.UserId, s.Name })
                .GroupBy(a => new { a.UserId, a.Name })
                .Select(g => new { g.Key.UserId, g.Key.Name, Count = g.Count() })
                .OrderBy(g => g.UserId)
                .ToListAsync();

            return Ok(result);
        }

        //~ audit by user
        // GET: api/Audit/User/5
        [Route("User/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuditUser([FromRoute] string id)
        {
            if (id.Length != 36)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var audit = await _context
                .Audit.Where(a => a.UserId == id)
                .Join(
                    _context.Permohonan,
                    aud => aud.PermohonanId,
                    per => per.PermohonanId,
                    (aud, per) => new
                    {
                        aud.AuditId,
                        aud.LogDate,
                        aud.Method,
                        aud.StringUrl,
                        aud.Name,
                        aud.NewValue,
                        aud.OldValue,
                        aud.PermohonanId,
                        aud.UserId,
                        aud.CompIp,
                        aud.CompMacAddress,
                        aud.CompName,
                        per.NoSuratPermohonan,
                    }
                )
                .ToListAsync();

            if (audit == null)
            {
                return NotFound();
            }

            return Ok(audit);
        }
    }
}