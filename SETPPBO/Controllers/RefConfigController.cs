using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using SETPPBO.Utility;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/RefConfig")]
    public class RefConfigController : Controller
    {
        private readonly MainDbContext _context;

        private int _pegawaiId;

        public RefConfigController(MainDbContext context)
        {
            //_pegawaiId = Convert.ToInt32(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value);
            _pegawaiId = 114616;

            _context = context;
        }

        // GET: api/RefConfig
        [HttpGet]
        //public IEnumerable<RefConfig> GetRefConfig()
        public async Task<IActionResult> GetRefConfig()
        {
            var result = await _context.RefConfig
                .Select(a => new
                {
                    a.RefConfigId,
                    a.Uraian,
                    a.ConfigKey,
                    //a.ConfigValue,
                    a.IsEncrypted
                })
                .ToListAsync();

            return Ok(result);
        }

        //~ get for grid, value is null
        // GET: api/RefConfig/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefConfig([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refConfig = await _context.RefConfig
                .Select(a => new
                {
                    a.RefConfigId,
                    a.Uraian,
                    a.ConfigKey,
                    ConfigValue = "", //~ emptied
                    a.IsEncrypted
                })
                .SingleOrDefaultAsync(m => m.RefConfigId == id);

            if (refConfig == null)
            {
                return NotFound();
            }

            return Ok(refConfig);
        }

        [Route("api/RefConfig/Smtp")]
        [HttpGet]
        public async Task<IActionResult> GetRefConfigSmtp()
        {
            var _conf = _context.RefConfig
            .Where(a => a.Uraian == "SMTP")
            .Select(a => new
            {
                a.ConfigKey,
                a.ConfigValue
            });

            var SenderAddress = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_ADDRESS");
            var SenderName = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_NAME");
            var SenderSecret = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_SECRET");
            var SenderServer = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_SERVER");
            var SenderDomain = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_DOMAIN");

            ConfigSmtp conf = new ConfigSmtp
            {
                SenderAddress = SenderAddress.ConfigValue,
                SenderName = SenderName.ConfigValue,
                SenderSecret = SenderSecret.ConfigValue,
                SenderServer = SenderServer.ConfigValue,
                SenderDomain = SenderDomain.ConfigValue,
            };

            return Ok(conf);
        }

        // PUT: api/RefConfig/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRefConfig([FromRoute] int id, [FromBody] RefConfig refConfig)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refConfig.RefConfigId)
            {
                return BadRequest();
            }

            //~ get old
            var _refConfig = await _context.RefConfig
                .Select(a => new
                {
                    a.RefConfigId,
                    a.ConfigValue,
                    a.IsEncrypted
                })
                .SingleOrDefaultAsync(m => m.RefConfigId == id);

            //~ if ConfigValue is not null, then encrypt or decrypt value
            if (refConfig.ConfigValue == null || refConfig.ConfigValue == "")
            {
                //~ false to true: encrypt
                if (refConfig.IsEncrypted == true)
                {
                    if (_refConfig.IsEncrypted == false)
                    {
                        refConfig.ConfigValue = Util.Encrypt(_refConfig.ConfigValue); //~ encrypt old
                        _context.Entry(refConfig).Property("ConfigValue").IsModified = true;
                    }
                }
                else //~ true to false: decrypt
                {
                    if (_refConfig.IsEncrypted == true)
                    {
                        refConfig.ConfigValue = Util.Decrypt(_refConfig.ConfigValue); //~ decrypt old
                        _context.Entry(refConfig).Property("ConfigValue").IsModified = true;
                    }
                }
            }
            else {
                //~ old to new
                //~ false to true: encrypt
                //~ false to false: skip (as is)
                //~ true to false: decrypt
                //~ true to true: encrypt
                if (refConfig.IsEncrypted == true)
                {
                    refConfig.ConfigValue = Util.Encrypt(refConfig.ConfigValue);
                }
                else //~ if refConfig.IsEncrypted == false
                {
                    if (_refConfig.IsEncrypted == true)
                    {
                        refConfig.ConfigValue = Util.Decrypt(refConfig.ConfigValue);
                    }
                }

                //~ modified if not null/empty
                _context.Entry(refConfig).Property("ConfigValue").IsModified = true;
            }

            //~ add update info
            refConfig.UpdatedDate = DateTime.Now;
            refConfig.UpdatedBy = _pegawaiId;

            _context.Entry(refConfig).Property("Uraian").IsModified = true;
            _context.Entry(refConfig).Property("ConfigKey").IsModified = true;
            _context.Entry(refConfig).Property("IsEncrypted").IsModified = true;

            _context.Entry(refConfig).Property("UpdatedDate").IsModified = true;
            _context.Entry(refConfig).Property("UpdatedBy").IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefConfigExists(id))
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

        // POST: api/RefConfig
        [HttpPost]
        public async Task<IActionResult> PostRefConfig([FromBody] RefConfig refConfig)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //~ encrypt if isEncrypted
            if (refConfig.IsEncrypted == true)
            {
                refConfig.ConfigValue = Util.Encrypt(refConfig.ConfigValue);
            }

            _context.RefConfig.Add(refConfig);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRefConfig", new { id = refConfig.RefConfigId }, refConfig);
        }

        // DELETE: api/RefConfig/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteRefConfig([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var refConfig = await _context.RefConfig.SingleOrDefaultAsync(m => m.RefConfigId == id);
        //    if (refConfig == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.RefConfig.Remove(refConfig);
        //    await _context.SaveChangesAsync();

        //    return Ok(refConfig);
        //}

        private bool RefConfigExists(int id)
        {
            return _context.RefConfig.Any(e => e.RefConfigId == id);
        }
    }
}