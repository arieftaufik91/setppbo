using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using Microsoft.AspNetCore.Authorization;

//~ !!! Sengketa Only, use SELECT

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Sengketa")]
    public class SengketaController : Controller
    {
        private readonly MainDbContext _context;

        public SengketaController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/Sengketa
        [HttpGet]
        public async Task<IActionResult> Sengketa()
        {
            var sengketa =  (from a in _context.Permohonan
                            join b in _context.RefJenisPermohonan
                            on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                            join c in _context.Pemohon
                            on a.PemohonId equals c.PemohonId
                            join d in _context.RefJenisPemeriksaan
                            on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                            join e in _context.Pemohon
                            on a.PemohonId equals e.PemohonId
                            join f in _context.RefJenisPajak
                            on a.RefJenisPajakId equals f.RefJenisPajakId

                            select new
                            {
                                a.PermohonanId,
                                Nama_Pemohon = e.Nama,
                                NPWP = e.Npwp,
                                NoSengketa = a.NoSengketa,
                                SISPA = a.NoSengketa == null ? null : a.NoSengketa.Substring(0, 6),
                                KodePajak = a.NoSengketa == null ? null : a.NoSengketa.Substring(6, 2),
                                Tahun_Pajak = a.NoSengketa == null ? null : a.NoSengketa.Substring(8, 4),
                                Masa_Pajak = a.MasaPajakAwalBulan,
                                No_Surat = a.NoSuratPermohonan,
                                Tanggal_Surat = a.TglSuratPermohonan,
                                Tanggal_Terima = a.TglTerimaPermohonan,
                                Tanggal_Kirim = a.TglKirimPermohonan,
                                a.RefJenisKetetapanId,
                                Jenis_Permohonan = b.Uraian,
                                Jenis_pemeriksaan = d.Uraian,
                                Jenis_Sengketa = f.UraianSingkat,
                                Nomor_SKP = a.NoSkp,
                                Tanggal_SKP = a.TglSkp,
                                Nomor_KEP = a.NoKep,
                                Tanggal_KEP = a.TglKep,
                                JenisKetetapan = a.RefJenisKetetapanId,
                                ABG = (a.RefPembagianBerkasId == 16776) ? "ABG I" : (a.RefPembagianBerkasId == 16777) ? "ABG II" : "ABG III"
                            }).ToList();

            var sengketa_list = sengketa
                 .GroupJoin(
                    _context.RefJenisKetetapan,
                    p => p.RefJenisKetetapanId,
                    m => m.RefJenisKetetapanId,
                    (p, m) => new
                    {
                        p.PermohonanId,
                        p.Nama_Pemohon,
                        p.NPWP,
                        p.NoSengketa,
                        p.SISPA,
                        p.KodePajak,
                        p.Tahun_Pajak,
                        p.Masa_Pajak,
                        p.No_Surat,
                        p.Tanggal_Surat,
                        p.Tanggal_Terima,
                        p.Tanggal_Kirim,
                        Jenis_SKP = m.Select(x => x.Uraian).SingleOrDefault(),
                        p.Jenis_Permohonan,
                        p.Jenis_pemeriksaan,
                        p.Jenis_Sengketa,
                        p.Nomor_SKP,
                        p.Tanggal_SKP,
                        p.Nomor_KEP,
                        p.Tanggal_KEP,
                        JenisKetetapan = m.Select(x => x.Uraian).SingleOrDefault(),
                        p.ABG
                    }
                ).Distinct()
                .ToList();

            return Ok(sengketa_list);
        }


        [Route("DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDaftarCetak([FromBody] string[] ids)
        {
            var sengketa = (from a in _context.Permohonan
                            join b in _context.RefJenisPermohonan
                            on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                            join c in _context.Pemohon
                            on a.PemohonId equals c.PemohonId
                            join d in _context.RefJenisPemeriksaan
                            on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                            join e in _context.Pemohon
                            on a.PemohonId equals e.PemohonId
                            join f in _context.RefJenisPajak
                            on a.RefJenisPajakId equals f.RefJenisPajakId
                            where ids.Contains(a.PermohonanId)
                            select new
                            {
                                Nama_Pemohon = e.Nama,
                                NPWP = e.Npwp,
                                NoSengketa = a.NoSengketa,
                                SISPA = a.NoSengketa == null ? null : a.NoSengketa.Substring(0, 6),
                                KodePajak = a.NoSengketa == null ? null : a.NoSengketa.Substring(6, 2),
                                Tahun_Pajak = a.NoSengketa == null ? null : a.NoSengketa.Substring(8, 4),
                                Masa_Pajak = a.MasaPajakAwalBulan,
                                No_Surat = a.NoSuratPermohonan,
                                Tanggal_Surat = a.TglSuratPermohonan,
                                Tanggal_Terima = a.TglTerimaPermohonan,
                                Tanggal_Kirim = a.TglKirimPermohonan,
                                a.RefJenisKetetapanId,
                                Jenis_Permohonan = b.Uraian,
                                Jenis_pemeriksaan = d.Uraian,
                                Jenis_Sengketa = f.UraianSingkat,
                                Nomor_SKP = a.NoSkp,
                                Tanggal_SKP = a.TglSkp,
                                Nomor_KEP = a.NoKep,
                                Tanggal_KEP = a.TglKep,
                                JenisKetetapan = a.RefJenisKetetapanId,
                                ABG = (a.RefPembagianBerkasId == 16776) ? "ABG I" : (a.RefPembagianBerkasId == 16777) ? "ABG II" : "ABG III"
                            }).ToList();

            var sengketa_list = sengketa
                 .GroupJoin(
                    _context.RefJenisKetetapan,
                    p => p.RefJenisKetetapanId,
                    m => m.RefJenisKetetapanId,
                    (p, m) => new
                    {
                        p.Nama_Pemohon,
                        p.NPWP,
                        p.NoSengketa,
                        p.SISPA,
                        p.KodePajak,
                        p.Tahun_Pajak,
                        p.Masa_Pajak,
                        p.No_Surat,
                        p.Tanggal_Surat,
                        p.Tanggal_Terima,
                        p.Tanggal_Kirim,
                        Jenis_SKP = m.Select(x => x.Uraian).SingleOrDefault(),
                        p.Jenis_Permohonan,
                        p.Jenis_pemeriksaan,
                        p.Jenis_Sengketa,
                        p.Nomor_SKP,
                        p.Tanggal_SKP,
                        p.Nomor_KEP,
                        p.Tanggal_KEP,
                        JenisKetetapan = m.Select(x => x.Uraian).SingleOrDefault(),
                        p.ABG
                    }
                ).Distinct()
                .ToList();

            return Ok(sengketa_list);
        }

        [Route("Filter")]
        [HttpPost]
        public async Task<IActionResult> GetDaftarBandingGugatanFilter([FromBody] DateTime[] Filter)
        {

            var sengketa = (from a in _context.Permohonan
                            join b in _context.RefJenisPermohonan
                            on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                            join c in _context.Pemohon
                            on a.PemohonId equals c.PemohonId
                            join d in _context.RefJenisPemeriksaan
                            on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                            join e in _context.Pemohon
                            on a.PemohonId equals e.PemohonId
                            join f in _context.RefJenisPajak
                            on a.RefJenisPajakId equals f.RefJenisPajakId
                            select new
                            {
                                Nama_Pemohon = e.Nama,
                                NPWP = e.Npwp,
                                NoSengketa = a.NoSengketa,
                                SISPA = a.NoSengketa == null ? null : a.NoSengketa.Substring(0, 6),
                                KodePajak = a.NoSengketa == null ? null : a.NoSengketa.Substring(6, 2),
                                Tahun_Pajak = a.NoSengketa == null ? null : a.NoSengketa.Substring(8, 4),
                                Masa_Pajak = a.MasaPajakAwalBulan,
                                No_Surat = a.NoSuratPermohonan,
                                Tanggal_Surat = a.TglSuratPermohonan,
                                Tanggal_Terima = a.TglTerimaPermohonan,
                                Tanggal_Kirim = a.TglKirimPermohonan,
                                a.RefJenisKetetapanId,
                                Jenis_Permohonan = b.Uraian,
                                Jenis_pemeriksaan = d.Uraian,
                                Jenis_Sengketa = f.UraianSingkat,
                                Nomor_SKP = a.NoSkp,
                                Tanggal_SKP = a.TglSkp,
                                Nomor_KEP = a.NoKep,
                                Tanggal_KEP = a.TglKep,
                                JenisKetetapan = a.RefJenisKetetapanId,
                                ABG = (a.RefPembagianBerkasId == 16776) ? "ABG I" : (a.RefPembagianBerkasId == 16777) ? "ABG II" : "ABG III"
                            }).ToList();

            var sengketa_list = sengketa
                 .GroupJoin(
                    _context.RefJenisKetetapan,
                    p => p.RefJenisKetetapanId,
                    m => m.RefJenisKetetapanId,
                    (p, m) => new
                    {
                        p.Nama_Pemohon,
                        p.NPWP,
                        p.NoSengketa,
                        p.SISPA,
                        p.KodePajak,
                        p.Tahun_Pajak,
                        p.Masa_Pajak,
                        p.No_Surat,
                        p.Tanggal_Surat,
                        p.Tanggal_Terima,
                        p.Tanggal_Kirim,
                        Jenis_SKP = m.Select(x => x.Uraian).SingleOrDefault(),
                        p.Jenis_Permohonan,
                        p.Jenis_pemeriksaan,
                        p.Jenis_Sengketa,
                        p.Nomor_SKP,
                        p.Tanggal_SKP,
                        p.Nomor_KEP,
                        p.Tanggal_KEP,
                        JenisKetetapan = m.Select(x => x.Uraian).SingleOrDefault(),
                        p.ABG
                    }
                ).Distinct()
                .ToList();

            var sengketaFilter = sengketa_list.Where(x => x.Tanggal_Terima > Filter[0] && x.Tanggal_Terima < Filter[1]).ToList();
            return Ok(sengketaFilter);
        }


        [Route("DaftarSengketa")]
        public async Task<IActionResult> GetDaftarSengketa()
        {
            
            var daftarSengketas = await _context.Permohonan
            .Select(p => new { 
                p.NoSuratPermohonan, 
                p.NoSengketa, 
                p.Pemohon.Nama, 
                p.NoSubSt, 
                p.NoSuratBantahan, 
                p.RefStatus.Uraian }).ToListAsync();
            return Ok(daftarSengketas);
        }

        [Route("ProsesSidang")]
        public async Task<IActionResult> GetProsesSidang()
        {

            var prosesSidang = await _context.Permohonan
            .Select(p => new {
                p.NoSuratPermohonan,
                p.NoSengketa,
                p.Pemohon.Nama,
                p.TglDistribusiBerkas,
                p.TglPenetapan,
                p.RefStatusId,
                Status = p.RefStatus.Uraian
            }).ToListAsync();
            return Ok(prosesSidang);
        }

        // GET: api/Sengketa/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPermohonan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var permohonan = await _context.Permohonan.SingleOrDefaultAsync(m => m.PermohonanId == id);

            if (permohonan == null)
            {
                return NotFound();
            }

            return Ok(permohonan);
        }

        // PUT: api/Sengketa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPermohonan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }

            _context.Entry(permohonan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PermohonanExists(id))
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

        // POST: api/Sengketa
        [HttpPost]
        public async Task<IActionResult> PostPermohonan([FromBody] Permohonan permohonan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Permohonan.Add(permohonan);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PermohonanExists(permohonan.PermohonanId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPermohonan", new { id = permohonan.PermohonanId }, permohonan);
        }

        // DELETE: api/Sengketa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermohonan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var permohonan = await _context.Permohonan.SingleOrDefaultAsync(m => m.PermohonanId == id);
            if (permohonan == null)
            {
                return NotFound();
            }

            _context.Permohonan.Remove(permohonan);
            await _context.SaveChangesAsync();

            return Ok(permohonan);
        }

        private bool PermohonanExists(string id)
        {
            return _context.Permohonan.Any(e => e.PermohonanId == id);
        }
    }
}