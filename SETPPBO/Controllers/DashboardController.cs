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
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Dashboard")]
    public class DashboardController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;

        public DashboardController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [Route("DaftarBerkasMasuk")]
        public async Task<IActionResult> GetDaftarDokumen()
        {

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            //var daftar = await _context.Permohonan.Select(p => new { no_surat = p.NoSkp, tgl_surat = (p.TglSuratPermohonan.HasValue ? p.TglSuratPermohonan.Value.ToShortDateString() : null), nama_pemohon = p.Pemohon.Nama, no_sengketa = p.NoSengketa }).ToListAsync();
            var daftar = await _context.Permohonan
                .Select(p => new {
                    tgl_terima_permohonan = p.TglTerimaPermohonan.HasValue ? p.TglTerimaPermohonan.Value.ToShortDateString() : null,
                    nama_pemohon = p.Pemohon.Nama,
                    no_surat = p.NoSuratPermohonan,
                    no_sengketa = p.NoSengketa
                }).ToListAsync();

            return Ok(daftar);

        }

        [Route("DaftarBerkasBelumSiapSidang")]
        public async Task<IActionResult> GetDaftarSengketa()
        {
            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            var refNormaWaktu = _context.RefNormaWaktu.Where(w => w.RefJenisNormaWaktuId.Equals(9)).Select(w => new { w.RefJenisPermohonanId, w.Bulan, w.Hari }).ToList();

            var jatuhTempoBanding = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Bulan).First());

            var jatuhTempoGugatan = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Bulan).First());

            var sengketa = await _context.Permohonan
                .Where(p =>
                    (
                        (p.RefJenisPemeriksaanId.Equals(1) ? 
                            !p.RefStatusId.Equals(301) 
                        : 
                            !p.RefStatusId.Equals(331) &&
                            (p.RefJenisPermohonanId.Equals(1) ?
                                DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) > 0
                            :
                                DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) > 0
                            )
                        )
                    )
                    && p.RefStatusId < 700
                    && !string.IsNullOrEmpty(p.NoSengketa)
                    && !p.RefStatusId.Equals(611)
                )
            .Select(p => new { no_sengketa = p.NoSengketa, nama_pemohon = p.Pemohon.Nama, jenis_sengketa = p.RefJenisPermohonan.Uraian, jenis_pemeriksaan = p.RefJenisPemeriksaan.Uraian, tgl_jatuh_tempo = (p.TglJatuhTempoSiapSidang.HasValue ? p.TglJatuhTempoSiapSidang.Value.ToShortDateString() : null) })
            .ToListAsync();
            
            return Ok(sengketa);

        }

        [Route("DaftarBerkasSudahDistribusi")]
        public async Task<IActionResult> GetDaftarDistribusi()
        {

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            var distribusi = await _context.Permohonan.Where(p => p.RefStatusId >= 700).Select(p => new { no_sengketa = p.NoSengketa, nama_pemohon = p.Pemohon.Nama, jenis_sengketa = p.RefJenisPermohonan.Uraian, jenis_pemeriksaan = p.RefJenisPemeriksaan.Uraian, majelis = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisPenunjukanId)).Select(m => m.Majelis).FirstOrDefault() }).ToListAsync();

            return Ok(distribusi);

        }

        [Route("DaftarBerkasSudahPenetapan")]
        public async Task<IActionResult> GetDaftarSiapSidang()
        {

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            var sidang = await _context.Permohonan.Where(p => p.RefStatusId >= 800).Select(p => new { no_sengketa = p.NoSengketa, nama_pemohon = p.Pemohon.Nama, jenis_sengketa = p.RefJenisPermohonan.Uraian, jenis_pemeriksaan = p.RefJenisPemeriksaan.Uraian, majelis = _context.RefMajelis.Where(m => m.RefMajelisId.Equals(p.RefMajelisPenunjukanId)).Select(m => m.Majelis).FirstOrDefault() }).ToListAsync();

            return Ok(sidang);

        }
    }
}
