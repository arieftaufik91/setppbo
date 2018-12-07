using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using System.Text.RegularExpressions;
using System.Dynamic;
using Microsoft.AspNetCore.Authorization;
//using Microsoft.Office.Interop.Word;
//using DocumentFormat.OpenXml.Packaging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Distribusi")]
    public class DistribusiController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;

        public DistribusiController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [Route("Dashboard")]
        public async Task<IActionResult> GetStatistikBerkas()
        {
            var permohonan = await _context.Permohonan
                .Where(p => p.RefStatusId >= 700)
                .GroupBy(p => new { p.RefMajelisPenunjukanId, p.RefJenisPajakId })
                .Select(p => new {
                    Majelis = p.Key.RefMajelisPenunjukanId,
                    IsPPH = p.Key.RefJenisPajakId == 12 ? true : false,
                    Beban = p.Count()
                })
                .ToListAsync();

            var majelis = await _context.RefMajelis
                .Select(m => new
                {
                    m.Majelis,
                    m.RefMajelisId,
                    m.RefJenisKasusId
                })
                .ToListAsync();

            List<string> MajelisPajak = new List<string>();
            List<int> BebanMajelisPajak = new List<int>();
            List<int> BebanPPhMajelisPajak = new List<int>();

            List<string> MajelisBeaCukai = new List<string>();
            List<int> BebanMajelisBeaCukai = new List<int>();
            List<int> BebanPPhMajelisBeaCukai = new List<int>();

            List<string> HakimTunggal = new List<string>();
            List<int> BebanHakimTunggal = new List<int>();
            List<int> BebanPPhHakimTunggal = new List<int>();

            foreach (var m in majelis)
            {
                switch (m.RefJenisKasusId)
                {
                    case 1:
                        MajelisPajak.Add(m.Majelis);
                        BebanMajelisPajak.Add(permohonan.Where(p => p.Majelis == m.RefMajelisId && !p.IsPPH).Sum(p => p.Beban));
                        BebanPPhMajelisPajak.Add(permohonan.Where(p => p.Majelis == m.RefMajelisId && p.IsPPH).Sum(p => p.Beban));
                        break;
                    case 2:
                        MajelisBeaCukai.Add(m.Majelis);
                        BebanMajelisBeaCukai.Add(permohonan.Where(p => p.Majelis == m.RefMajelisId && !p.IsPPH).Sum(p => p.Beban));
                        BebanPPhMajelisBeaCukai.Add(permohonan.Where(p => p.Majelis == m.RefMajelisId && p.IsPPH).Sum(p => p.Beban));
                        break;
                    case 3:
                        HakimTunggal.Add(m.Majelis);
                        BebanHakimTunggal.Add(permohonan.Where(p => p.Majelis == m.RefMajelisId && !p.IsPPH).Sum(p => p.Beban));
                        BebanPPhHakimTunggal.Add(permohonan.Where(p => p.Majelis == m.RefMajelisId && p.IsPPH).Sum(p => p.Beban));
                        break;
                }
            }

            return Ok(new { Pajak = new { labels = MajelisPajak, beban = BebanMajelisPajak, bebanPPh = BebanPPhMajelisPajak }, BeaCukai = new { labels = MajelisBeaCukai, beban = BebanMajelisBeaCukai, bebanPPh = BebanPPhMajelisBeaCukai }, HakimTunggal = new { labels = HakimTunggal, beban = BebanHakimTunggal, bebanPPh = BebanPPhHakimTunggal } });
        }

        [HttpPost("BerkasSiapSidangServerSide")] 
        public async Task<IActionResult> GetPermohonanPaging([FromBody] Paging paging) 
        {
            dynamic result = new ExpandoObject();

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            var refNormaWaktu = _context.RefNormaWaktu.Where(w => w.RefJenisNormaWaktuId.Equals(9)).Select(w => new { w.RefJenisPermohonanId, w.Bulan, w.Hari }).ToList();

            var jatuhTempoBanding = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Bulan).First());

            var jatuhTempoGugatan = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Bulan).First());

            var berkasSiapSidang = await _context.Permohonan
                /*.Where(p =>
                    (
                        p.RefJenisPemeriksaanId.Equals(1) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(1) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) <= 0) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(2) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) <= 0) ||
                        p.RefStatusId == 331
                    ) 
                    && p.RefStatusId < 700
                    && !p.RefStatusId.Equals(611)
                )*/
                .Where(p =>
                    (
                        (
                            (p.RefJenisPemeriksaanId.Equals(1) ?
                                p.RefStatusId.Equals(301)
                            :
                                (p.RefStatusId.Equals(331) && p.RefStatusId < 700) ||
                                (p.RefJenisPermohonanId.Equals(1) ?
                                    DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) <= 0
                                :
                                    DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) <= 0
                                )
                            )
                        )
                        && !string.IsNullOrEmpty(p.NoSengketa)
                        && !p.RefStatusId.Equals(611)
                    ) 
                    &&
                    (
                        p.NoSengketa.ToLower().Contains(paging.Search.ToLower()) ||
                        p.RefJenisPermohonan.Uraian.ToLower().Contains(paging.Search.ToLower()) ||
                        p.Pemohon.Nama.ToLower().Contains(paging.Search.ToLower()) ||
                        (!string.IsNullOrEmpty(p.NamaTermohon) && p.NamaTermohon.ToLower().Contains(paging.Search.ToLower())) ||
                        p.RefJenisPemeriksaan.Uraian.ToLower().Contains(paging.Search.ToLower())
                    )
                )
                .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisHistoriId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        historiMajelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        jatuhtempo = p.RefJenisPermohonanId == 1 ? jatuhTempoBanding : jatuhTempoGugatan
                    }
                )
                .ToListAsync();

            result.Data = berkasSiapSidang.Skip(paging.Offset * paging.Limit).Take(paging.Limit);
            result.Count = berkasSiapSidang.Count();
            return Ok(result);
        }

        [Route("BerkasSiapSidang")]
        public async Task<IActionResult> GetBerkasSiapSidang()
        {
            var refNormaWaktu = _context.RefNormaWaktu.Where(w => w.RefJenisNormaWaktuId.Equals(9)).Select(w => new { w.RefJenisPermohonanId, w.Bulan, w.Hari }).ToList();

            var jatuhTempoBanding = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Bulan).First());

            var jatuhTempoGugatan = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Bulan).First());
            
            var berkasSiapSidang = await _context.Permohonan
                /*.Where(p =>
                    (
                        p.RefJenisPemeriksaanId.Equals(1) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(1) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) <= 0) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(2) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) <= 0) ||
                        p.RefStatusId == 331
                    ) 
                    && p.RefStatusId < 700
                    && !p.RefStatusId.Equals(611)
                )*/
                .Where(p =>
                    (
                        (p.RefJenisPemeriksaanId.Equals(1) ?
                            p.RefStatusId.Equals(301)
                        :
                            (p.RefStatusId.Equals(331) && p.RefStatusId < 700) ||
                            (p.RefJenisPermohonanId.Equals(1) ?
                                DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) <= 0
                            :
                                DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) <= 0
                            )
                        )
                    )
                    && !string.IsNullOrEmpty(p.NoSengketa)
                    && !p.RefStatusId.Equals(611)
                )
                .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisHistoriId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {   
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        historiMajelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        jatuhtempo = p.RefJenisPermohonanId == 1 ? jatuhTempoBanding : jatuhTempoGugatan
                    }
                )
                .ToListAsync();

            return Ok(berkasSiapSidang);
        }

        [HttpPost("RekapServerSide")]
        public async Task<IActionResult> GetBerkasSudahDistribusiServerSide([FromBody] Paging paging)
        {
            dynamic result = new ExpandoObject();
            var refMajelis = _context.RefMajelis;
            
            var berkasSudahDistribusi = await _context.Permohonan
                .Where(p =>
                    p.RefStatusId == 700
                    &&
                    (
                        p.NoSengketa.Contains(paging.Search) ||
                        p.NoSuratPermohonan.ToLower().Contains(paging.Search.ToLower()) ||
                        p.Pemohon.Nama.ToLower().Contains(paging.Search.ToLower()) ||
                        p.RefJenisPajak.RefJenisKasus.Uraian.ToLower().Contains(paging.Search.ToLower()) ||
                        p.RefJenisPemeriksaan.Uraian.ToLower().Contains(paging.Search.ToLower()) ||
                        refMajelis.FirstOrDefault(m => m.RefMajelisId.Equals(p.RefMajelisBebanId)).Majelis.ToLower().Contains(paging.Search.ToLower()) ||
                        refMajelis.FirstOrDefault(m => m.RefMajelisId.Equals(p.RefMajelisHistoriId)).Majelis.ToLower().Contains(paging.Search.ToLower()) ||
                        refMajelis.FirstOrDefault(m => m.RefMajelisId.Equals(p.RefMajelisPenunjukanId)).Majelis.ToLower().Contains(paging.Search.ToLower())
                    )
                )
                .Select(p => new
                {
                    p.PermohonanId,
                    p.NoSengketa,
                    p.NoSuratPermohonan,
                    p.Pemohon.Nama,
                    JenisKasus = p.RefJenisPajak.RefJenisKasus.Uraian,
                    JenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                    MajelisBeban = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisBebanId)).Select(m => m.Majelis).FirstOrDefault(),
                    MajelisHistori = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisHistoriId)).Select(m => m.Majelis).FirstOrDefault(),
                    MajelisPenunjukan = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisPenunjukanId)).Select(m => m.Majelis).FirstOrDefault(),
                    p.RefJenisPemeriksaanId,
                    p.RefJenisPajakId
                }
                )
                .ToListAsync();

            result.Data = berkasSudahDistribusi.Skip(paging.Offset * paging.Limit).Take(paging.Limit);
            result.Count = berkasSudahDistribusi.Count();
            return Ok(result);
        }

        [Route("Rekap")]
        public async Task<IActionResult> GetBerkasSudahDistribusi()
        {

            var berkasSudahDistribusi = await _context.Permohonan
                .Where(p =>
                    p.RefStatusId == 700
                )
                .Select(p => new
                {
                    p.PermohonanId,
                    p.NoSengketa,
                    p.NoSuratPermohonan,
                    p.Pemohon.Nama,
                    JenisKasus = p.RefJenisPajak.RefJenisKasus.Uraian,
                    JenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                    MajelisBeban = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisBebanId)).Select(m => m.Majelis).FirstOrDefault(),
                    MajelisHistori = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisHistoriId)).Select(m => m.Majelis).FirstOrDefault(),
                    MajelisPenunjukan = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisPenunjukanId)).Select(m => m.Majelis).FirstOrDefault(),
                    p.RefJenisPemeriksaanId,
                    p.RefJenisPajakId
                }
                )
                .ToListAsync();

            return Ok(berkasSudahDistribusi);
        }

        [HttpGet("Detail/{id}")]
        public async Task<IActionResult> GetDetailBerkasSudahDistribusi([FromRoute] string id)
        {

            var detail = await _context.Permohonan
            .Select(p => new
            {
                p.PermohonanId,
                p.NoPendaftaran,
                p.Pemohon.Nama,
                p.Pemohon.Alamat,
                p.Pemohon.Kota,
                p.Pemohon.KodePos,
                p.Pemohon.ContactPerson,
                JenisSengketa = p.RefJenisPermohonan.Uraian,
                p.NoSuratPermohonan,
                TglSuratPermohonan = p.TglSuratPermohonan.HasValue ? p.TglSuratPermohonan.Value.ToShortDateString() : null,
                TglTerimaPermohonan = p.TglTerimaPermohonan.HasValue ? p.TglTerimaPermohonan.Value.ToShortDateString() : null,
                p.Pemohon.Npwp,
                p.NoSkp,
                TglSkp = p.TglSkp.HasValue ? p.TglSkp.Value.ToShortDateString() : null,
                p.MasaPajakAkhirTahun,
                MasaPajak = (p.MasaPajakAwalBulan.HasValue && p.MasaPajakAwalTahun.HasValue ? String.Concat(p.MasaPajakAwalBulan, " ", p.MasaPajakAwalTahun, (p.MasaPajakAkhirTahun.HasValue && p.MasaPajakAkhirBulan.HasValue ? String.Concat(" - ", p.MasaPajakAkhirBulan, " ", p.MasaPajakAkhirTahun) : "")) : (p.MasaPajakAkhirTahun.HasValue && p.MasaPajakAkhirBulan.HasValue ? String.Concat(p.MasaPajakAkhirBulan, " ", p.MasaPajakAkhirTahun) : "-")),
                JenisPajak = p.RefJenisPajak.Uraian,
                p.NoKep,
                TglKep = p.TglKep.HasValue ? p.TglKep.Value.ToShortDateString() : null,
                JenisPemeriksaan = p.RefJenisPemeriksaan.Uraian
            }
            )
            .SingleOrDefaultAsync((p =>
                p.PermohonanId.Equals(id)
            ));

            if (detail == null)
            {
                return NotFound();
            }

            return Ok(detail);
        }

        [Route("DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDaftarCetakDistribusi([FromBody] string[] ids)
        {
            var listPermohonan = await _context.Permohonan
                .Where(p => ids.Contains(p.PermohonanId))
                .Select(p => new
                {
                    p.NoSengketa,
                    p.Pemohon.Nama,
                    JenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                    TglTerimaPermohonan = p.TglTerimaPermohonan.HasValue ? p.TglTerimaPermohonan.Value.ToShortDateString() : null,
                    TglPemeriksaan = p.TglPemeriksaan.HasValue ? p.TglPemeriksaan.Value.ToShortDateString() : null,
                    p.NoSkp,
                    JenisPajak = p.RefJenisPajak.Uraian,
                    TahunPajak = p.MasaPajakAkhirTahun,
                    p.NoKep,
                    MajelisPenunjukan = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisPenunjukanId)).Select(m => m.Majelis).FirstOrDefault(),
                    MajelisBeban = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisBebanId)).Select(m => m.Majelis).FirstOrDefault(),
                    MajelisHistori = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisHistoriId)).Select(m => m.Majelis).FirstOrDefault()
                }
                )
                .ToListAsync();

            return Ok(listPermohonan);
        }
        
        [HttpPost]
        public async Task<IActionResult> ProsesDistribusi([FromBody] Permohonan[] listPermohonan)
        {
            var majelis = _context.RefMajelis;
            var startDtm = DateTime.ParseExact("2018-08-31", "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            Dictionary<int, int> bebanMajelis = new Dictionary<int, int>();

            foreach (var permohonan in listPermohonan)
            {
                var histori = await _context.Permohonan
                    .Where(p =>
                        p.MasaPajakAkhirTahun.Equals(permohonan.MasaPajakAkhirTahun) &&
                        p.RefJenisPajakId.Equals(permohonan.RefJenisPajakId) &&
                        p.PemohonId.Equals(permohonan.PemohonId) &&
                        p.RefJenisPemeriksaanId.Equals(permohonan.RefJenisPemeriksaanId) &&
                        !p.PermohonanId.Equals(permohonan.PermohonanId) &&
                        !String.IsNullOrEmpty(p.RefMajelisPenunjukanId.ToString())
                    )
                    .OrderByDescending(p => p.TglTerimaPermohonan)
                    .Select(p => p.RefMajelisPenunjukanId).FirstOrDefaultAsync();

                var beban = await _context.RefMajelis
                    .Where(m => (permohonan.RefJenisPemeriksaanId.Equals(2) ? _context.RefJenisPajak.Where(j => j.RefJenisPajakId.Equals(permohonan.RefJenisPajakId)).Select(j => j.RefJenisKasusId).FirstOrDefault().Equals(m.RefJenisKasusId) : m.RefJenisKasusId.Equals(3)))
                    .Select(m => new
                    {
                        majelisId = m.RefMajelisId,
                        bebanPerJenisKasus = _context.Permohonan.Where(p => p.RefMajelisPenunjukanId.Equals(m.RefMajelisId) && (DateTime.Compare(p.TglDistribusiBerkas.Value, startDtm) > 0) && (permohonan.RefJenisPajakId.Equals(12) ? p.RefJenisPajakId.Equals(12) : true)).Count() + (bebanMajelis.ContainsKey(m.RefMajelisId) ? bebanMajelis[m.RefMajelisId] : 0),
                        bebanTotal = _context.Permohonan.Where(p => p.RefMajelisPenunjukanId.Equals(m.RefMajelisId) && (DateTime.Compare(p.TglDistribusiBerkas.Value, startDtm) > 0)).Count() + (bebanMajelis.ContainsKey(m.RefMajelisId) ? bebanMajelis[m.RefMajelisId] : 0)
                    })
                    .OrderBy(b => b.bebanPerJenisKasus)
                    .ThenBy(b => b.bebanTotal)
                    .Select(b => b.majelisId)
                    .FirstOrDefaultAsync();

                if (beban > 0)
                {
                    permohonan.TglDistribusiBerkas = DateTime.Now;
                    _context.Entry(permohonan).Property("TglDistribusiBerkas").IsModified = true;

                    if (!String.IsNullOrEmpty(histori.ToString()))
                    {
                        permohonan.RefMajelisHistoriId = histori;
                        _context.Entry(permohonan).Property("RefMajelisHistoriId").IsModified = true;

                    }
                    permohonan.RefMajelisBebanId = beban;
                    _context.Entry(permohonan).Property("RefMajelisBebanId").IsModified = true;

                    permohonan.RefMajelisPenunjukanId = (!String.IsNullOrEmpty(histori.ToString()) ? histori : beban);
                    _context.Entry(permohonan).Property("RefMajelisPenunjukanId").IsModified = true;

                    permohonan.RefStatusId = 700;
                    _context.Entry(permohonan).Property("RefStatusId").IsModified = true;

                    var majelisPenunjukan = majelis.Where(m => m.RefMajelisId.Equals(permohonan.RefMajelisPenunjukanId)).SingleOrDefault();
                    if (majelisPenunjukan != null)
                    {
                        majelisPenunjukan.TotalBerkas = (majelisPenunjukan.TotalBerkas.HasValue ? majelisPenunjukan.TotalBerkas.Value + 1 : 1);
                        _context.Entry(majelisPenunjukan).Property("TotalBerkas").IsModified = true;

                        if (!bebanMajelis.ContainsKey(majelisPenunjukan.RefMajelisId))
                        {
                            bebanMajelis.Add(majelisPenunjukan.RefMajelisId, 1);
                        }
                        else
                        {
                            bebanMajelis[majelisPenunjukan.RefMajelisId]++;
                        }
                    }
                }

            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        [Route("Ulang")]
        [HttpPost]
        public async Task<IActionResult> ProsesDistribusiUlang([FromBody] Permohonan[] listPermohonan)
        {
            
            try
            {
                foreach (var permohonan in listPermohonan)
                {

                    var previousMajelis = _context.RefMajelis.FirstOrDefault(m => m.RefMajelisId.Equals(_context.Permohonan.FirstOrDefault(p => p.PermohonanId.Equals(permohonan.PermohonanId)).RefMajelisPenunjukanId.Value));
                    if (previousMajelis == null || !previousMajelis.RefMajelisId.Equals(permohonan.RefMajelisPenunjukanId))
                    {
                        permohonan.RefStatusId = 700;

                        _context.Entry(permohonan).Property("RefStatusId").IsModified = true;
                        _context.Entry(permohonan).Property("RefMajelisPenunjukanId").IsModified = true;
                        _context.Entry(permohonan).Property("KeteranganPenunjukan").IsModified = true;

                        var currentMajelis = _context.RefMajelis.FirstOrDefault(m => m.RefMajelisId.Equals(permohonan.RefMajelisPenunjukanId));
                        currentMajelis.TotalBerkas = (currentMajelis.TotalBerkas + 1 ?? 1);

                        if (previousMajelis != null)
                        {
                            previousMajelis.TotalBerkas = previousMajelis.TotalBerkas.HasValue && previousMajelis.TotalBerkas.Value > 0 ? previousMajelis.TotalBerkas.Value - 1 : 0;
                        }
                    }
                }

                await _context.SaveChangesAsync();

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return NoContent();
        }

    }
}
