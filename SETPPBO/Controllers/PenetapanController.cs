using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using Microsoft.Office.Interop.Word;
using SETPPBO.Models;
using System.Security.Claims;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using SETPPBO.Utility;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;
using Pusintek.AspNetcore.DocIO;
using System.Text;
using System.Net;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Penetapan")]
    public class PenetapanController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private IConfiguration Configuration { get; }
        private String penetapanPath = "wwwroot/assets/template/";
        private DocumentService documentService;

        private string templatePath;
        private string accessToken;
        private string refreshToken;
        private string sSOUrl;

        public PenetapanController(IHostingEnvironment hostingEnvironment, MainDbContext context, IConfiguration configuration)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            Configuration = configuration;
        }

        [Route("DaftarPenetapan/{jenisPenetapan}")]
        [HttpGet("{jenisPenetapan}")]
        public async Task<IActionResult> GetDaftarPenetapan([FromRoute] int jenisPenetapan)
        {
            jenisPenetapan = 1;
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;

            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan != null && p.RefJenisPemeriksaanId == 2 && p.NoPenetapan.Contains("BR"))
                 .GroupJoin(
                    _context.RefConfig,
                    p => p.TempatSidang.ToString(),
                    m => m.ConfigKey,
                    (p, m) => new
                    {
                        p.NoPenetapan,
                        p.TglPenetapan,
                        TempatSidang = m.Select(x => x.ConfigValue).SingleOrDefault(),// get Data Permohonan hanya yang berjenis Banding
                        PejabatPenandatangan ="",
                        PosisiPejabatPenandatangan=""
            }).OrderByDescending(x=> x.NoPenetapan).Distinct().ToListAsync();
           
            return Ok(daftar);
        }
        [Route("DaftarPenetapanAC/{jenisPenetapan}")]
        [HttpGet("{jenisPenetapan}")]
        public async Task<IActionResult> GetDaftarPenetapanAC([FromRoute] int jenisPenetapan)
        {
            jenisPenetapan = 1;
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;

            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan != null && p.RefJenisPemeriksaanId == 1 && p.NoPenetapan.Contains("BR"))
                 .GroupJoin(
                    _context.RefConfig,
                    p => p.TempatSidang.ToString(),
                    m => m.ConfigKey,
                    (p, m) => new
                    {
                        p.NoPenetapan,
                        p.TglPenetapan,
                        TempatSidang = m.Select(x => x.ConfigValue).SingleOrDefault(),// get Data Permohonan hanya yang berjenis Banding
                        PejabatPenandatangan = "",
                        PosisiPejabatPenandatangan = ""
                    }).OrderByDescending(x => x.NoPenetapan).Distinct().ToListAsync();

            return Ok(daftar);
        }

        [Route("DaftarPenetapanEdit/{notap}")]
        [HttpGet("{notap}")]
        public async Task<IActionResult> GetPenetapanEdit([FromRoute] string notap)
        {
            
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan.Replace("/","") == notap )// get Data Permohonan hanya yang berjenis Banding
            .Select(p => new {
                p.NoPenetapan,
                p.TglPenetapan,
                p.TempatSidang,
                PejabatPenandatangan = "",
                PosisiPejabatPenandatangan = ""
            }).Distinct().SingleOrDefaultAsync();

            return Ok(daftar);
        }
        [Route("DaftarPenetapanPencabutan/{jenisPenetapan}")]
        [HttpGet("{jenisPenetapan}")]
        public async Task<IActionResult> GetDaftarPenetapanPencabutan([FromRoute] int jenisPenetapan)
        {
            jenisPenetapan = 1;
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;

            var daftarPenCabut = await (
                from a in _context.Permohonan
                join b in _context.Pemohon
                on a.PemohonId equals b.PemohonId
                where (
                        a.RefStatusId == 800 && a.NoPenetapan.Contains("CBT")
                      )
                select new
                {
                    a.NoPenetapan,
                    a.TglPenetapan,
                    a.NoSengketa,
                    b.Nama,
                    a.NamaTermohon,
                    a.NamaUpTermohon
                }
            ).OrderByDescending(x=> x.NoPenetapan).Distinct().ToListAsync();

            return Ok(daftarPenCabut);
        }
        [Route("DaftarSengketaAC")]
        [HttpGet()]
        public async Task<IActionResult> GetDaftarSengketaAC()
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan == null && p.RefMajelisPenunjukanId != null && p.RefJenisPemeriksaanId == 1)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId
                    }).ToListAsync();
            return Ok(daftar);
        }


        [Route("DaftarSengketa")]
        [HttpGet()]
        public async Task<IActionResult> GetDaftarSengketa()
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan == null && p.RefMajelisPenunjukanId != null && p.RefJenisPemeriksaanId == 2)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
            {
                p.PermohonanId,
                p.NoSengketa,
                jenisSengketa = p.RefJenisPermohonan.Uraian,
                p.Pemohon.Nama,
                p.NamaTermohon,
                jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                p.MasaPajakAkhirTahun,
                p.RefJenisPajakId,
                p.RefJenisPemeriksaanId,
                p.PemohonId
            }).ToListAsync();
            return Ok(daftar);
        }

        [Route("DaftarSengketaEdit/{notap}")]
        [HttpGet("{notap}")]
    public async Task<IActionResult> GetDaftarSengketaEdit(string notap)
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan == null && p.RefMajelisPenunjukanId != null && p.RefJenisPemeriksaanId == 2 || p.NoPenetapan.Replace("/", "") == notap)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.NoPenetapan,
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        check = p.NoPenetapan != null ? true :false
                    }).ToListAsync();
            return Ok(daftar);
        }

        [Route("DaftarSengketaEditAC/{notap}")]
        [HttpGet("{notap}")]
        public async Task<IActionResult> GetDaftarSengketaEditAC(string notap)
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan == null && p.RefMajelisPenunjukanId != null && p.RefJenisPemeriksaanId == 1 || p.NoPenetapan.Replace("/", "") == notap)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.NoPenetapan,
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        check = p.NoPenetapan != null ? true : false
                    }).ToListAsync();
            return Ok(daftar);
        }

        [Route("DaftarSengketaPencabutan")]
        [HttpGet()]
        public async Task<IActionResult> GetDaftarSengketaPencabutan()
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.RefStatusId == 611)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        p.NoSuratPencabutan,
                        p.TglSuratPencabutan
                    }).ToListAsync();
            return Ok(daftar);
        }

        [Route("DaftarSengketaEditCabut/{notap}")]
        [HttpGet("{notap}")]
        public async Task<IActionResult> GetDaftarSengketaEditCabut(string notap)
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.RefStatusId == 611 || p.NoPenetapan.Replace("/", "") == notap)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.NoPenetapan,
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        p.NoSuratPencabutan,
                        p.TglSuratPencabutan,
                        check = p.NoPenetapan != null ? true : false
                    }).ToListAsync();
            return Ok(daftar);
        }

        [Route("DaftarSengketaDeleteCabut/{notap}")]
        [HttpGet("{notap}")]
        public async Task<IActionResult> GetDaftarSengketaDeleteCabut(string notap)
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            var daftar = await _context.Permohonan
                .Where(p => p.NoPenetapan.Replace("/", "") == notap)
                  .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisPenunjukanId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.NoPenetapan,
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.NamaTermohon,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        Majelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        p.NoSuratPencabutan,
                        p.TglSuratPencabutan,
                        check = p.NoPenetapan != null ? true : false
                    }).ToListAsync();
            return Ok(daftar);
        }


        [Route("AddPenetapan")]
        [HttpPost]
        public async Task<IActionResult> AddPenetapan([FromBody] Permohonan permohonan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Permohonan perm = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(perm);
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);
            string[] strNomorTerakhir;
            int intNomorTerakhir;
            
            //    if (varPenomoran == null)
            //    {
            //        varPenomoran = new Penomoran();
            //        intNomorTerakhir = 1;
            //        varPenomoran.NomorTerakhir = 1;
            //        varPenomoran.OrganisasiId = 0;
            //        varPenomoran.KodeOrganisasi = "0";
            //        varPenomoran.NamaOrganisasi = "-";
            //        varPenomoran.Tahun = DateTime.Now.Year;
            //        varPenomoran.RefJenisPenomoranId = 4;
            //        _context.Penomoran.Add(varPenomoran);
            //    }
            //    else
            //    {
            //    intNomorTerakhir = varPenomoran.NomorTerakhir + 1;
             
            //    //_context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;
            //    }
            // perm.NoPenetapan = intNomorTerakhir + "/PP/BR/" + DateTime.Now.Year;
            strNomorTerakhir = permohonan.NoPenetapan.Split("/");
            intNomorTerakhir = Convert.ToInt32(strNomorTerakhir[0]);
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == 4 && m.Tahun == DateTime.Now.Year);
            varPenomoran.NomorTerakhir = intNomorTerakhir;
            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;
            perm.NoPenetapan = permohonan.NoPenetapan;
            perm.TglPenetapan = permohonan.TglPenetapan;
            perm.TempatSidang = permohonan.TempatSidang;

            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;
            perm.RefStatusId = 800;
            _context.Entry(perm).Property("NoPenetapan").IsModified = true;
            _context.Entry(perm).Property("TglPenetapan").IsModified = true;
            _context.Entry(perm).Property("TempatSidang").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true; 
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
          
            //_context.Entry(perm).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               
            }
            return NoContent();
        }

        [Route("GetPenetapanById/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPenetapanById([FromRoute] string id)
        {
            Console.WriteLine("Id = " + id);
            id = id.Replace(".", "/");
            Console.WriteLine("Id = " + id);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var penetapan = await _context.Permohonan
            .Select(p => new
            {
                p.NoPenetapan,
                p.TglPenetapan
            })
            .SingleOrDefaultAsync(p => p.NoPenetapan == id);
            if (penetapan == null)
            {
                return NotFound();
            }
            return Ok(penetapan);
        }

        [Route("UpdatePenetapanDelete/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> UpdatePenetapanDelete(string id)
        {
            Permohonan[] perms = _context.Permohonan.Where(x => x.PermohonanId == id).ToArray();
            foreach (var perm in perms)
            {
                perm.NoPenetapan = null;
                perm.TglPenetapan = null;
                perm.TempatSidang = null;
                _context.Entry(perm).Property("NoPenetapan").IsModified = true;
                _context.Entry(perm).Property("TglPenetapan").IsModified = true;
                _context.Entry(perm).Property("TempatSidang").IsModified = true;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                }
            }
            return NoContent();

        }
        [Route("UpdatePenetapan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePenetapan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {


            string notaplama = _context.Permohonan.Where(p => p.NoPenetapan.Replace("/", "") == id).Select(x => x.NoPenetapan).FirstOrDefault().ToString();
            Permohonan permbaru = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(permbaru);
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            permbaru.NoPenetapan = notaplama;
            permbaru.TglPenetapan = permohonan.TglPenetapan;
            permbaru.TempatSidang = permohonan.TempatSidang;
            permbaru.UpdatedDate = DateTime.Now;
            permbaru.UpdatedBy = PegawaiID;
            permbaru.RefStatusId = 800;
            _context.Entry(permbaru).Property("NoPenetapan").IsModified = true;
            _context.Entry(permbaru).Property("TglPenetapan").IsModified = true;
            _context.Entry(permbaru).Property("UpdatedBy").IsModified = true;
            _context.Entry(permbaru).Property("UpdatedDate").IsModified = true;
            _context.Entry(permbaru).Property("RefStatusId").IsModified = true;
            _context.Entry(permbaru).Property("TempatSidang").IsModified = true;
            //_context.Entry(perm).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

            }
            return NoContent();
        }

        [Route("UpdatePenetapanPencabutanDelete/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePenetapanPencabutanDelete([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            // string notaplama = _context.Permohonan.Where(p => p.NoPenetapan.Replace("/", "") == id).Select(x => x.NoPenetapan).FirstOrDefault().ToString();
            Permohonan permbaru = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(permbaru);
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            permbaru.NoPenetapan = null;
            permbaru.TglPenetapan = null;
            permbaru.UpdatedDate = DateTime.Now;
            permbaru.UpdatedBy = PegawaiID;
            permbaru.RefStatusId = 611;
            _context.Entry(permbaru).Property("NoPenetapan").IsModified = true;
            _context.Entry(permbaru).Property("TglPenetapan").IsModified = true;
            _context.Entry(permbaru).Property("UpdatedBy").IsModified = true;
            _context.Entry(permbaru).Property("UpdatedDate").IsModified = true;
            _context.Entry(permbaru).Property("RefStatusId").IsModified = true;
            // _context.Entry(permbaru).Property("TempatSidang").IsModified = true;
            //_context.Entry(perm).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

            }
            return NoContent();

        }

        [Route("GetNomorPenetapan")]
        [HttpGet]
        public async Task<IActionResult> NomorPenetapan()
        {
            string nomorPenetapan;
            int intNomorTerakhir = 0;
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == 4 && m.Tahun == DateTime.Now.Year);
            if (varPenomoran == null)
            {
                varPenomoran = new Penomoran();
                intNomorTerakhir = 1;
                varPenomoran.NomorTerakhir = 1;
                varPenomoran.OrganisasiId = 0;
                varPenomoran.KodeOrganisasi = "0";
                varPenomoran.NamaOrganisasi = "-";
                varPenomoran.Tahun = DateTime.Now.Year;
                varPenomoran.RefJenisPenomoranId = 5;
                _context.Penomoran.Add(varPenomoran);
            }
            else
            {
                intNomorTerakhir = varPenomoran.NomorTerakhir + 1;
                varPenomoran.NomorTerakhir = intNomorTerakhir;
            }
            nomorPenetapan = intNomorTerakhir + "/PP/BR/" + DateTime.Now.Year;
            return Ok(nomorPenetapan);
        }

        [Route("GetNomorPenetapanPencabutan")]
        [HttpGet]
        public async Task<IActionResult> NomorPenetapanPencabutan()
        {
            string nomorPenetapan;
            int intNomorTerakhir = 0;
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == 5 && m.Tahun == DateTime.Now.Year);
            if (varPenomoran == null)
            {
                varPenomoran = new Penomoran();
                intNomorTerakhir = 1;
                varPenomoran.NomorTerakhir = 1;
                varPenomoran.OrganisasiId = 0;
                varPenomoran.KodeOrganisasi = "0";
                varPenomoran.NamaOrganisasi = "-";
                varPenomoran.Tahun = DateTime.Now.Year;
                varPenomoran.RefJenisPenomoranId = 5;
                _context.Penomoran.Add(varPenomoran);
            }
            else
            {
                intNomorTerakhir = varPenomoran.NomorTerakhir + 1;
                varPenomoran.NomorTerakhir = intNomorTerakhir;
            }
            nomorPenetapan = intNomorTerakhir + "/PP/CBT/" + DateTime.Now.Year;
            return Ok(nomorPenetapan);
        }


        [Route("AddPenetapanPencabutan")]
        [HttpPost]
        public async Task<IActionResult> AddPenetapanPencabutan([FromBody] Permohonan permohonan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Permohonan perm = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(perm);
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);
            string[] strNomorTerakhir;
            int intNomorTerakhir;
            strNomorTerakhir = permohonan.NoPenetapan.Split("/");
            intNomorTerakhir = Convert.ToInt32(strNomorTerakhir[0]);
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == 5 && m.Tahun == DateTime.Now.Year);
            varPenomoran.NomorTerakhir = intNomorTerakhir;
            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;
            perm.NoPenetapan = permohonan.NoPenetapan;
            perm.TglPenetapan = permohonan.TglPenetapan;
            // perm.TempatSidang = permohonan.TempatSidang;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;
            perm.RefStatusId = 800;
            _context.Entry(perm).Property("NoPenetapan").IsModified = true;
            _context.Entry(perm).Property("TglPenetapan").IsModified = true;
            // _context.Entry(perm).Property("TempatSidang").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true; 
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
          
            //_context.Entry(perm).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               
            }
            return NoContent();
        }
        

        [Route("DeletePenetapan/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePenetapan([FromRoute] string id)
        {
            Console.WriteLine("Id = " + id);
            id = id.Replace(".", "/");
            Console.WriteLine("Id = " + id);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Console.WriteLine(id);
            Permohonan[] perms = _context.Permohonan.Where(x => x.NoPenetapan == id).ToArray();
            foreach(var perm in perms)
            {
                perm.NoPenetapan = null;
                perm.TglPenetapan = null;
                perm.TempatSidang = null;
                
                _context.Entry(perm).Property("NoPenetapan").IsModified = true;
                _context.Entry(perm).Property("TglPenetapan").IsModified = true;
                _context.Entry(perm).Property("TempatSidang").IsModified = true;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                }
            }

            //return repository.DeletePenetapan(id);
            return NoContent();

        }

        [Route("DeletePenetapanPencabutan/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePenetapanPencabutan([FromRoute] string id)
        {
            Console.WriteLine("Id = " + id);
            id = id.Replace(".", "/");
            Console.WriteLine("Id = " + id);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Console.WriteLine(id);
            Permohonan[] perms = _context.Permohonan.Where(x => x.NoPenetapan == id).ToArray();
            foreach(var perm in perms)
            {
                perm.NoPenetapan = null;
                perm.TglPenetapan = null;
                // perm.TempatSidang = null;
                perm.RefStatusId = 611;
                
                _context.Entry(perm).Property("NoPenetapan").IsModified = true;
                _context.Entry(perm).Property("TglPenetapan").IsModified = true;
                // _context.Entry(perm).Property("TempatSidang").IsModified = true;
                _context.Entry(perm).Property("RefStatusId").IsModified = true;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                }
            }

            //return repository.DeletePenetapan(id);
            return NoContent();

        }

        [HttpGet("CetakPenetapan/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Cetak(string id)
        {

            byte[] byteArray;
            Console.WriteLine("Id = " + id);
            id = id.Replace(".", "/");
            Console.WriteLine("Id = " + id);
            var webRoot = _hostingEnvironment.WebRootPath;
            var userht =
                   (
                        from a in _context.Permohonan
                        join b in _context.RefMajelis on a.RefMajelisPenunjukanId equals b.RefMajelisId
                        where a.NoPenetapan == id
                        select new { a, b }
                         ).Distinct().FirstOrDefault();
            if (userht.b.Majelis.Contains("HT-"))
            {
                byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanAC.docx"));
            }
            else
            {
                byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanAB.docx"));
            }

            string notap;
            using (MemoryStream mem = new MemoryStream())
            {
                mem.Write(byteArray, 0, (int)byteArray.Length);
                using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
                {

                    string ConfigKetua = _context.RefConfig.Where(x => x.ConfigKey == "TTD_KETUA").Select(x => x.ConfigValue).FirstOrDefault().ToString();
                    int ConfigKetuaInt = Convert.ToInt32(ConfigKetua);
                    var ketua = (from a in _context.RefHakim where a.RefHakimId == ConfigKetuaInt select new { a }).FirstOrDefault();
                    string VarKetua = ketua.a.Nama.ToString();
                    string NomorKepKetua = _context.RefConfig.Where(x => x.ConfigKey == "NomorKepPenetapan").Select(x => x.ConfigValue).FirstOrDefault().ToString();
                    var Penetapan =
                   (
                        from a in _context.Permohonan
                        join b in _context.RefMajelis on a.RefMajelisPenunjukanId equals b.RefMajelisId
                        join c in _context.RefMajelis on a.RefMajelisPenunjukanId equals c.RefMajelisId
                        join d in _context.RefHakim on c.HakimKetuaId equals d.RefHakimId
                        join e in _context.RefHakim on c.HakimAnggota1Id equals e.RefHakimId
                        join f in _context.RefHakim on c.HakimAnggota2Id equals f.RefHakimId
                        join g in _context.RefJenisPemeriksaan on a.RefJenisPemeriksaanId equals g.RefJenisPemeriksaanId
                        join h in _context.RefConfig on a.TempatSidang.ToString() equals h.ConfigKey
                        where a.NoPenetapan == id
                        select new { a, b, c, d, e, f, g, h }
                         ).Distinct().FirstOrDefault();

                    var PenetapanSengketa =
                    (
                         from a in _context.Permohonan
                         join b in _context.Pemohon on a.PemohonId equals b.PemohonId
                         join c in _context.RefJenisPajak on a.RefJenisPajakId equals c.RefJenisPajakId
                         join d in _context.RefJenisPemeriksaan on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                         join e in _context.RefConfig on a.TempatSidang.ToString() equals e.ConfigKey
                         where a.NoPenetapan == id
                         select new { a, b, c, d, e }
                          ).ToList();
                    string VarNomor = Penetapan.a.NoPenetapan;
                    notap = Penetapan.a.NoPenetapan;
                    string VarMajelis = Penetapan.b.Majelis;
                    string VarTempatSidang = Penetapan.h.ConfigValue;
                    string VarHakimKetua = Penetapan.d.Nama;
                    string VarHakimAnggota1 = Penetapan.e.Nama;
                    string VarHakimAnggota2 = Penetapan.f.Nama;
                    string VarPaniteraPengganti = Penetapan.b.Nipsp;


                  
                    await GetAccessToken();
                    PegawaiInfo info = await GetPegawaiByID(VarPaniteraPengganti, accessToken);
                    VarPaniteraPengganti = info.GelarDepan + " " + info.Nama + " " + info.GelarBelakang;

                    string VarTanggalCetak = DateTime.Parse(Penetapan.a.TglPenetapan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id-ID"));
                    string VarJenisPemeriksaan = Penetapan.g.Uraian == "AB" ? "Acara Biasa" : "Acara Cepat";
                    //string varTglSuratBanding = DateTime.Parse(DataTambahan.b.TglSuratPermohonan.ToString()).ToString("dd-MM-yyyy");
                    string docText = null;
                    using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
                    {
                        docText = sr.ReadToEnd();
                    }

                    Regex regexNomor = new Regex("VarNomor");
                    Regex regexNomorKep = new Regex("VarKepNomor");
                    Regex regexTempatSidang = new Regex("VarTempatSidang");
                    Regex regexMajelis = new Regex("VarMajelis");
                    Regex regexHakimKetua = new Regex("VarHakimKetua");
                    Regex regexHakimAnggota1 = new Regex("VarHakimAnggota1");
                    Regex regexHakimAnggota2 = new Regex("VarHakimAnggota2");
                    Regex regexPejabatPenandatangan = new Regex("VarPejabatPenandatangan");
                    Regex regexTanggalCetak = new Regex("VarTanggalCetak");
                    Regex regexJenisPemeriksaan = new Regex("VarJenisPemeriksaan");
                    Regex regexPaniteraPengganti = new Regex("VarPaniteraPengganti");


                    docText = regexNomor.Replace(docText, VarNomor);
                    docText = regexNomorKep.Replace(docText, NomorKepKetua);
                    docText = regexTempatSidang.Replace(docText, VarTempatSidang);
                    docText = regexMajelis.Replace(docText, VarMajelis);
                    docText = regexHakimKetua.Replace(docText, VarHakimKetua);
                    docText = regexHakimAnggota1.Replace(docText, VarHakimAnggota1);
                    docText = regexHakimAnggota2.Replace(docText, VarHakimAnggota2);
                    docText = regexPaniteraPengganti.Replace(docText, VarPaniteraPengganti);
                    docText = regexTanggalCetak.Replace(docText, VarTanggalCetak);
                    docText = regexJenisPemeriksaan.Replace(docText, VarJenisPemeriksaan);
                    docText = regexPejabatPenandatangan.Replace(docText, VarKetua);

                    using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
                    {
                        sw.Write(docText);

                    }
                    for (int i = 0; i < PenetapanSengketa.Count(); i++)
                    {
                        if (i < 10)
                        {
                            docText = null;
                            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
                            {
                                docText = sr.ReadToEnd();
                            }
                            Console.WriteLine(PenetapanSengketa[i]);
                            string VarSengketa = Util.GetFormatNomorSengketa(PenetapanSengketa[i].a.NoSengketa.ToString());
                            string VarNamaPemohon = PenetapanSengketa[i].b.Nama.ToString();
                            string VarJnsPjk = PenetapanSengketa[i].c.Uraian.ToString();
                            string VarThnPjk = PenetapanSengketa[i].a.MasaPajakAwalTahun.ToString();
                            string VarJnsPmks = PenetapanSengketa[i].d.Uraian.ToString();

                            string VarSengketaReplace = "VarSengketa" + i.ToString();
                            string VarNamaPemohonReplace = "VarNamaPemohon" + i.ToString();
                            string VarJnsPjkReplace = "VarJnsPjk" + i.ToString();
                            string VarThnPjkReplace = "VarThnPjk" + i.ToString();
                            string VarJnsPmksReplace = "VarJnsPmks" + i.ToString();

                            Regex regexSengketa = new Regex(VarSengketaReplace);
                            Regex regexNamaPemohon = new Regex(VarNamaPemohonReplace);
                            Regex regexJnsPjk = new Regex(VarJnsPjkReplace);
                            Regex regexThnPjk = new Regex(VarThnPjkReplace);
                            Regex regexJnsPmks = new Regex(VarJnsPmksReplace);

                            docText = regexSengketa.Replace(docText, VarSengketa);
                            docText = regexNamaPemohon.Replace(docText, VarNamaPemohon);
                            docText = regexJnsPjk.Replace(docText, VarJnsPjk);
                            docText = regexThnPjk.Replace(docText, VarThnPjk);
                            docText = regexJnsPmks.Replace(docText, VarJnsPmks);

                            Console.WriteLine(VarThnPjk);
                            Console.WriteLine(VarThnPjkReplace);
                            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
                            {
                                sw.Write(docText);

                            }
                        }
                        else if (i >= 10 && i < 100)
                        {
                            docText = null;
                            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
                            {
                                docText = sr.ReadToEnd();
                            }
                            string VarSengketa = Util.GetFormatNomorSengketa(PenetapanSengketa[i].a.NoSengketa.ToString());
                            string VarNamaPemohon = PenetapanSengketa[i].b.Nama.ToString();
                            string VarJnsPjk = PenetapanSengketa[i].c.Uraian.ToString();
                            string VarThnPjk = PenetapanSengketa[i].a.MasaPajakAwalTahun.ToString();
                            string VarJnsPmks = PenetapanSengketa[i].d.Uraian.ToString();

                            string VarSengketaReplace = "VarSengketaf" + i.ToString();
                            string VarNamaPemohonReplace = "VarNamaPemohonf" + i.ToString();
                            string VarJnsPjkReplace = "VarJnsPjkf" + i.ToString();
                            string VarThnPjkReplace = "VarThnPjkf" + i.ToString();
                            string VarJnsPmksReplace = "VarJnsPmksf" + i.ToString();

                            Regex regexSengketa = new Regex(VarSengketaReplace);
                            Regex regexNamaPemohon = new Regex(VarNamaPemohonReplace);
                            Regex regexJnsPjk = new Regex(VarJnsPjkReplace);
                            Regex regexThnPjk = new Regex(VarThnPjkReplace);
                            Regex regexJnsPmks = new Regex(VarJnsPmksReplace);

                            docText = regexSengketa.Replace(docText, VarSengketa);
                            docText = regexNamaPemohon.Replace(docText, VarNamaPemohon);
                            docText = regexJnsPjk.Replace(docText, VarJnsPjk);
                            docText = regexThnPjk.Replace(docText, VarThnPjk);
                            docText = regexJnsPmks.Replace(docText, VarJnsPmks);

                            Console.WriteLine(VarThnPjk);
                            Console.WriteLine(VarThnPjkReplace);
                            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
                            {
                                sw.Write(docText);

                            }
                        }
                        else if (i >= 100 && i <= 300)
                        {
                            docText = null;
                            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
                            {
                                docText = sr.ReadToEnd();
                            }
                            string VarSengketa = Util.GetFormatNomorSengketa(PenetapanSengketa[i].a.NoSengketa.ToString());
                            string VarNamaPemohon = PenetapanSengketa[i].b.Nama.ToString();
                            string VarJnsPjk = PenetapanSengketa[i].c.Uraian.ToString();
                            string VarThnPjk = PenetapanSengketa[i].a.MasaPajakAwalTahun.ToString();
                            string VarJnsPmks = PenetapanSengketa[i].d.Uraian.ToString();

                            string VarSengketaReplace = "VarSengketaf" + i.ToString();
                            string VarNamaPemohonReplace = "VarNamaPemohonf" + i.ToString();
                            string VarJnsPjkReplace = "VarJnsPjkf" + i.ToString();
                            string VarThnPjkReplace = "VarThnPjkf" + i.ToString();
                            string VarJnsPmksReplace = "VarJnsPmksf" + i.ToString();

                            Regex regexSengketa = new Regex(VarSengketaReplace);
                            Regex regexNamaPemohon = new Regex(VarNamaPemohonReplace);
                            Regex regexJnsPjk = new Regex(VarJnsPjkReplace);
                            Regex regexThnPjk = new Regex(VarThnPjkReplace);
                            Regex regexJnsPmks = new Regex(VarJnsPmksReplace);

                            docText = regexSengketa.Replace(docText, VarSengketa);
                            docText = regexNamaPemohon.Replace(docText, VarNamaPemohon);
                            docText = regexJnsPjk.Replace(docText, VarJnsPjk);
                            docText = regexThnPjk.Replace(docText, VarThnPjk);
                            docText = regexJnsPmks.Replace(docText, VarJnsPmks);

                            Console.WriteLine(VarThnPjk);
                            Console.WriteLine(VarThnPjkReplace);
                            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
                            {
                                sw.Write(docText);

                            }
                        }
                    }
                    int jumlahPenetapanSengketa = PenetapanSengketa.Count();
                    int jumlahSengketaDelete = PenetapanSengketa.Count() + 2;
                    DocumentFormat.OpenXml.Wordprocessing.Table table = wordprocessingDocument.MainDocumentPart.Document.Body.Elements<DocumentFormat.OpenXml.Wordprocessing.Table>().Last();
                    for (int i = jumlahPenetapanSengketa; i < 301; i++)
                    {
                        TableRow row = table.Elements<TableRow>().ElementAt(jumlahSengketaDelete);
                        row.Remove();
                    }

                    //if (varNoSengketa == null)
                    //{
                    //    docText = regexNoSengketa.Replace(docText, "");
                    //}
                    //else
                    //{
                    //    docText = regexNoSengketa.Replace(docText, varNoSengketa);
                    //}
                    //docText = regexNoSuratBanding.Replace(docText, varNoSuratBanding);
                    //docText = regexTglSuratBanding.Replace(docText, varTglSuratBanding);
                    //docText = regexNoSuratDataTambahan.Replace(docText, varNoSuratDataTambahan);
                    //docText = regexTglSuratDataTambahan.Replace(docText, varTglSuratDataTambahan);
                    wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\Template1\\pdf4.docx")).Close();

                    //PdfMetamorphosis p = new PdfMetamorphosis();
                    //string docxPath = System.IO.Path.Combine(webRoot, "assets\\Template\\pdf1.docx");
                    //string pdfPath = System.IO.Path.Combine(webRoot, "assets\\Template\\data.pdf");

                    //p.DocxToPdfConvertFile(docxPath, pdfPath);
                }
            }
            notap = notap.Replace("/", "");
            byte[] fileBytes1 = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template1\\pdf4.docx"));
            return File(fileBytes1, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", notap + " penetapan.docx");

            // Application word = new Application();

            // // C# doesn't have optional arguments so we'll need a dummy value
            // object oMissing = System.Reflection.Missing.Value;

            // // Get list of Word files in specified directory
            // DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\Template1"));
            // FileInfo[] wordFiles = dirInfo.GetFiles("*.doc");

            // word.Visible = false;
            // word.ScreenUpdating = false;
            // try
            // {
            //     foreach (FileInfo wordFile in wordFiles)
            //     {
            //         // Cast as Object for word Open method
            //         Object filename = (Object)wordFile.FullName;

            //         // Use the dummy value as a placeholder for optional arguments
            //         Microsoft.Office.Interop.Word.Document doc = word.Documents.Open(ref filename, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing);
            //         doc.Activate();

            //         object outputFileName = wordFile.FullName.Replace(".docx", ".pdf");
            //         object fileFormat = WdSaveFormat.wdFormatPDF;

            //         // Save document into PDF Format
            //         doc.SaveAs(ref outputFileName,
            //             ref fileFormat, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing);

            //         // Close the Word document, but leave the Word application open.
            //         // doc has to be cast to type _Document so that it will find the
            //         // correct Close method.                
            //         object saveChanges = WdSaveOptions.wdDoNotSaveChanges;
            //         ((_Document)doc).Close(ref saveChanges, ref oMissing, ref oMissing);
            //         doc = null;
            //     }
            //      ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
            //     word = null;

            // }
            // catch
            // {
            //     ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
            //     word = null;
            // }

            // byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template1\\pdf4.pdf"));
            // return File(fileBytes, "application/pdf", "Penetapan.pdf");



        }
        [HttpGet("CetakPenetapanPencabutan/{id}")]
        [HttpGet("{id}")]
        public IActionResult CetakPencabutan(string id)
        {
            byte[] byteArray;
            Console.WriteLine("Id = " + id);
            id = id.Replace(".", "/");
            Console.WriteLine("Id = " + id);
            var webRoot = _hostingEnvironment.WebRootPath;
            var penetapanCabut = (
                from a in _context.Permohonan
                join b in _context.RefJenisPermohonan on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                where a.NoPenetapan == id
                select new { a, b }
            ).Distinct().FirstOrDefault();

            if (penetapanCabut.a.RefJenisPermohonanId.Equals("1"))
            {
                byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanPencabutan.docx"));
            }
            else
            {
                byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanPencabutanGGT.docx"));
            }

            string notap;
            // byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanPencabutan.docx"));
            using (MemoryStream mem = new MemoryStream())
            {
                mem.Write(byteArray, 0, (int)byteArray.Length);
                using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
                {
                    string ConfigKetua = _context.RefConfig.Where(x => x.ConfigKey == "TTD_KETUA").Select(x => x.ConfigValue).FirstOrDefault().ToString();
                    int ConfigKetuaInt = Convert.ToInt32(ConfigKetua);
                    var ketua = (from a in _context.RefHakim where a.RefHakimId == ConfigKetuaInt select new { a }).FirstOrDefault();
                    string VarKetua = ketua.a.Nama.ToString();
                    var Penetapan =
                   (
                        from a in _context.Permohonan
                        join b in _context.Pemohon on a.PemohonId equals b.PemohonId
                        where a.NoPenetapan == id
                        select new { a, b }
                         ).Distinct().FirstOrDefault();
                    Console.WriteLine(Penetapan.a);
                    Console.WriteLine(Penetapan.b);
                    string VarNomorPenetapan = Penetapan.a.NoPenetapan;
                    notap = Penetapan.a.NoPenetapan;
                    string VarNomorSuratPencabutan = Penetapan.a.NoSuratPencabutan;
                    string VarNamaPemohon = Penetapan.b.Nama;
                    string VarNPWPPemohon = Penetapan.b.Npwp;
                    string VarNamaTerbanding = Penetapan.a.NamaTermohon;
                    string VarUpTermohon = Penetapan.a.NamaUpTermohon;
                    string VarNomorKepTerbanding = Penetapan.a.NoKep;
                    string VarAlamatTerbanding = Penetapan.a.AlamatTermohon;
                    string VarAlamatPemohon = Penetapan.b.Alamat;


                    string VarNomorSengketaPajak = Util.GetFormatNomorSengketa(Penetapan.a.NoSengketa.ToString());
                    // string VarTanggal = DateTime.Now.ToString("dd-MM-yyyy");
                    System.Globalization.CultureInfo cultureinfo = new System.Globalization.CultureInfo("id-ID");
                    string VarTanggal = DateTime.Parse(Penetapan.a.TglPenetapan.ToString()).ToString("dd MMMM yyyy", cultureinfo);
                    string docText = null;
                    using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
                    {
                        docText = sr.ReadToEnd();
                    }

                    Regex regexNomorPenetapan = new Regex("VarNomorPen");
                    Regex regexNomorSuratPencabutan = new Regex("VarNomorSuratPencabutan");
                    Regex regexNamaPemohon = new Regex("VarNamaPemohon");
                    Regex regexNPWPPemohon = new Regex("VarNPWPPemohon");
                    Regex regexNamaTerbanding = new Regex("VarNamaTerbanding");
                    Regex regexUpTermohon = new Regex ("VarUpTermohon");
                    Regex regexNomorKepTerbanding = new Regex("VarNomorKepTerbanding");
                    Regex regexAlamatTerbanding = new Regex("VarAlamatTerbanding");
                    Regex regexNomorSengketaPajak = new Regex("VarNomorSengketaPajak");
                    Regex regexTanggal = new Regex("VarTanggal");
                    Regex regexKetua = new Regex("VarKetua");
                    Regex regexAlamatPemohon = new Regex("VarAlamatPemohon");


                    docText = regexNomorPenetapan.Replace(docText, VarNomorPenetapan);
                    docText = regexNomorSuratPencabutan.Replace(docText, VarNomorSuratPencabutan);
                    docText = regexNamaPemohon.Replace(docText, VarNamaPemohon);
                    docText = regexNPWPPemohon.Replace(docText, VarNPWPPemohon);
                    docText = regexNamaTerbanding.Replace(docText, VarNamaTerbanding);
                    docText = regexUpTermohon.Replace(docText, VarUpTermohon);
                    docText = regexNomorKepTerbanding.Replace(docText, VarNomorKepTerbanding);
                    docText = regexAlamatTerbanding.Replace(docText, VarAlamatTerbanding);
                    docText = regexNomorSengketaPajak.Replace(docText, VarNomorSengketaPajak);
                    docText = regexTanggal.Replace(docText, VarTanggal);
                    docText = regexKetua.Replace(docText, VarKetua);
                    docText = regexAlamatPemohon.Replace(docText, VarAlamatPemohon);


                    using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
                    {
                        sw.Write(docText);

                    }

                    wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\TempPenetapanCabut\\penCabut.docx")).Close();


                }
            }
            notap = notap.Replace("/","");
            byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\TempPenetapanCabut\\penCabut.docx"));
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Penetapan Pencabutan No. " + notap + ".docx");

            // Application word = new Application();

            // // C# doesn't have optional arguments so we'll need a dummy value
            // object oMissing = System.Reflection.Missing.Value;

            // // Get list of Word files in specified directory
            // DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\Template1"));
            // FileInfo[] wordFiles = dirInfo.GetFiles("*.doc");

            // word.Visible = false;
            // word.ScreenUpdating = false;
            // try
            // {
            //     foreach (FileInfo wordFile in wordFiles)
            //     {
            //         // Cast as Object for word Open method
            //         Object filename = (Object)wordFile.FullName;

            //         // Use the dummy value as a placeholder for optional arguments
            //         Microsoft.Office.Interop.Word.Document doc = word.Documents.Open(ref filename, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing);
            //         doc.Activate();

            //         object outputFileName = wordFile.FullName.Replace(".docx", ".pdf");
            //         object fileFormat = WdSaveFormat.wdFormatPDF;

            //         // Save document into PDF Format
            //         doc.SaveAs(ref outputFileName,
            //             ref fileFormat, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing,
            //             ref oMissing, ref oMissing, ref oMissing, ref oMissing);

            //         // Close the Word document, but leave the Word application open.
            //         // doc has to be cast to type _Document so that it will find the
            //         // correct Close method.                
            //         object saveChanges = WdSaveOptions.wdDoNotSaveChanges;
            //         ((_Document)doc).Close(ref saveChanges, ref oMissing, ref oMissing);
            //         doc = null;
            //     }
            //      ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
            //     word = null;

            // }
            // catch
            // {
            //     ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
            //     word = null;




            // }

            // byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\TempPenetapanCabut\\TempFile.pdf"));
            // return File(fileBytes, "application/pdf", "Penetapan.pdf");
        }




        //[HttpGet("CetakPenetapan/{id}")]
        //[HttpGet("{id}")]
        //public async Task<IActionResult> Cetak(string id)
        //{

        //    id = id.Replace(".", "/");
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var userht =
        //           (
        //                from a in _context.Permohonan
        //                join b in _context.RefMajelis on a.RefMajelisPenunjukanId equals b.RefMajelisId
        //                where a.NoPenetapan == id
        //                select new { a, b }
        //                 ).Distinct().FirstOrDefault();
        //    if (userht.b.Majelis.Contains("HT-"))
        //    {
        //        documentService = new DocumentService(penetapanPath + "PenetapanACDocumentsService.docx");
        //    }
        //    else
        //    {
        //        documentService = new DocumentService(penetapanPath + "PenetapanAB.docx");
        //    }





        //    //string varTglSuratBanding = DateTime.Parse(DataTambahan.b.TglSuratPermohonan.ToString()).ToString("dd-MM-yyyy");
        //    string ConfigKetua = _context.RefConfig.Where(x => x.ConfigKey == "TTD_KETUA").Select(x => x.ConfigValue).FirstOrDefault().ToString();
        //    int ConfigKetuaInt = Convert.ToInt32(ConfigKetua);
        //    var ketua = (from a in _context.RefHakim where a.RefHakimId == ConfigKetuaInt select new { a }).FirstOrDefault();
        //    string VarKetua = ketua.a.Nama.ToString();
        //    string NomorKepKetua = _context.RefConfig.Where(x => x.ConfigKey == "NomorKepPenetapan").Select(x => x.ConfigValue).FirstOrDefault().ToString();
        //    var Penetapan =
        //   (
        //        from a in _context.Permohonan
        //        join b in _context.RefMajelis on a.RefMajelisPenunjukanId equals b.RefMajelisId
        //        join c in _context.RefMajelis on a.RefMajelisPenunjukanId equals c.RefMajelisId
        //        join d in _context.RefHakim on c.HakimKetuaId equals d.RefHakimId
        //        join e in _context.RefHakim on c.HakimAnggota1Id equals e.RefHakimId
        //        join f in _context.RefHakim on c.HakimAnggota2Id equals f.RefHakimId
        //        join g in _context.RefJenisPemeriksaan on a.RefJenisPemeriksaanId equals g.RefJenisPemeriksaanId
        //        join h in _context.RefConfig on a.TempatSidang.ToString() equals h.ConfigKey
        //        where a.NoPenetapan == id
        //        select new { a, b, c, d, e, f, g, h }
        //         ).Distinct().FirstOrDefault();

        //    var PenetapanSengketa =
        //    (
        //         from a in _context.Permohonan
        //         join b in _context.Pemohon on a.PemohonId equals b.PemohonId
        //         join c in _context.RefJenisPajak on a.RefJenisPajakId equals c.RefJenisPajakId
        //         join d in _context.RefJenisPemeriksaan on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
        //         join e in _context.RefConfig on a.TempatSidang.ToString() equals e.ConfigKey
        //         where a.NoPenetapan == id
        //         select new { a, b, c, d, e }
        //          ).ToList();

        //    string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
        //    PegawaiInfo info = await GetPegawaiByID(Penetapan.b.Nipsp, accessToken);

        //    string VarTanggalCetak = DateTime.Parse(Penetapan.a.TglPenetapan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id-ID"));
        //    string VarJenisPemeriksaan = Penetapan.g.Uraian == "AB" ? "Acara Biasa" : "Acara Cepat";

        //    Dictionary<string, string> PenetapanList = new Dictionary<string, string>() {
        //        {"VarNomor", Penetapan.a.NoPenetapan },
        //        {"VarKepNomor", NomorKepKetua },
        //        {"VarTempatSidang", Penetapan.h.ConfigValue },
        //        {"VarMajelis", Penetapan.b.Majelis},
        //        {"VarHakimKetua", Penetapan.d.Nama },
        //        {"VarHakimAnggota1",Penetapan.e.Nama== null ? "" : Penetapan.e.Nama},
        //        {"VarHakimAnggota2", Penetapan.f.Nama== null ? "" : Penetapan.f.Nama},
        //        {"VarPaniteraPengganti",   info.GelarDepan + " " + info.Nama + " " + info.GelarBelakang },
        //        {"VarPejabatPenandatangan", VarKetua},
        //        {"VarTanggalCetak", VarTanggalCetak  },
        //        {"VarJenisPemeriksaan",VarJenisPemeriksaan}

        //    };


        //    documentService.Data = new DataField()
        //    {
        //        Data = PenetapanList
        //    };

        //    documentService.DataTable = new List<DataFieldGroup>(){
        //        new DataFieldGroup() {
        //            Data = new List<Pegawai>() {
        //                new Pegawai() {
        //                    Nama = "Pegawai 1",
        //                    Unit = "Pusintek",
        //                    Image = "https://pay.google.com/about/static/images/social/og_image.jpg",
        //                },
        //                new Pegawai()
        //                {
        //                    Nama = "Pegawai 2",
        //                    Unit = "Pusintek",
        //                    Image = "https://pbs.twimg.com/profile_images/972154872261853184/RnOg6UyU.jpg",
        //                }
        //            },
        //            Key = "Pegawai",
        //            Options = new Dictionary<string, Options>()
        //            {
        //                { "Image", new Options()
        //                    {
        //                        FromUrl = true,
        //                        Width = 200,
        //                        Height = 300
        //                    }
        //                }
        //            },
        //        }
        //    };

        //    MemoryStream fileStream = documentService.GeneratePDF();
        //    return File(fileStream, "application/pdf", "Penetapan " + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");




        //}
        // [HttpGet("CetakPenetapanPencabutan/{id}")]
        // [HttpGet("{id}")]
        //public IActionResult CetakPencabutan(string id)
        //{
        //    byte[] byteArray;
        //    Console.WriteLine("Id = " + id);
        //    id = id.Replace(".", "/");
        //    Console.WriteLine("Id = " + id);
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var penetapanCabut = (
        //        from a in _context.Permohonan
        //        join b in _context.RefJenisPermohonan on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
        //        where a.NoPenetapan == id
        //        select new { a, b }
        //    ).Distinct().FirstOrDefault();

        //    if (penetapanCabut.a.RefJenisPermohonanId.Equals("1"))
        //    {
        //        byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanPencabutan.docx"));
        //    }
        //    else
        //    {
        //        byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanPencabutanGGT.docx"));
        //    }

        //    // byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\PenetapanPencabutan.docx"));
        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            string ConfigKetua = _context.RefConfig.Where(x => x.ConfigKey == "TTD_KETUA").Select(x => x.ConfigValue).FirstOrDefault().ToString();
        //            int ConfigKetuaInt = Convert.ToInt32(ConfigKetua);
        //            var ketua = (from a in _context.RefHakim where a.RefHakimId == ConfigKetuaInt select new { a }).FirstOrDefault();
        //            string VarKetua = ketua.a.Nama.ToString();
        //            var Penetapan =
        //           (
        //                from a in _context.Permohonan
        //                join b in _context.Pemohon on a.PemohonId equals b.PemohonId
        //                where a.NoPenetapan == id
        //                select new { a, b }
        //                 ).Distinct().FirstOrDefault();
        //            Console.WriteLine(Penetapan.a);
        //            Console.WriteLine(Penetapan.b);
        //            string VarNomorPenetapan = Penetapan.a.NoPenetapan;
        //            string VarNomorSuratPencabutan = Penetapan.a.NoSuratPencabutan;
        //            string VarNamaPemohon = Penetapan.b.Nama;
        //            string VarNPWPPemohon = Penetapan.b.Npwp;
        //            string VarNamaTerbanding = Penetapan.a.NamaTermohon;
        //            string VarNomorKepTerbanding = Penetapan.a.NoKep;
        //            string VarAlamatTerbanding = Penetapan.a.AlamatTermohon;
        //            string VarAlamatPemohon = Penetapan.b.Alamat;


        //            string VarNomorSengketaPajak = Penetapan.a.NoSengketa;
        //            // string VarTanggal = DateTime.Now.ToString("dd-MM-yyyy");
        //            string VarTanggal = DateTime.Parse(Penetapan.a.TglPenetapan.ToString()).ToString("dd-MM-yyyy");
        //            string docText = null;
        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            Regex regexNomorPenetapan = new Regex("VarNomorPen");
        //            Regex regexNomorSuratPencabutan = new Regex("VarNomorSuratPencabutan");
        //            Regex regexNamaPemohon = new Regex("VarNamaPemohon");
        //            Regex regexNPWPPemohon = new Regex("VarNPWPPemohon");
        //            Regex regexNamaTerbanding = new Regex("VarNamaTerbanding");
        //            Regex regexNomorKepTerbanding = new Regex("VarNomorKepTerbanding");
        //            Regex regexAlamatTerbanding = new Regex("VarAlamatTerbanding");
        //            Regex regexNomorSengketaPajak = new Regex("VarNomorSengketaPajak");
        //            Regex regexTanggal = new Regex("VarTanggal");
        //            Regex regexKetua = new Regex("VarKetua");
        //            Regex regexAlamatPemohon = new Regex("VarAlamatPemohon");


        //            docText = regexNomorPenetapan.Replace(docText, VarNomorPenetapan);
        //            docText = regexNomorSuratPencabutan.Replace(docText, VarNomorSuratPencabutan);
        //            docText = regexNamaPemohon.Replace(docText, VarNamaPemohon);
        //            docText = regexNPWPPemohon.Replace(docText, VarNPWPPemohon);
        //            docText = regexNamaTerbanding.Replace(docText, VarNamaTerbanding);
        //            docText = regexNomorKepTerbanding.Replace(docText, VarNomorKepTerbanding);
        //            docText = regexAlamatTerbanding.Replace(docText, VarAlamatTerbanding);
        //            docText = regexNomorSengketaPajak.Replace(docText, VarNomorSengketaPajak);
        //            docText = regexTanggal.Replace(docText, VarTanggal);
        //            docText = regexKetua.Replace(docText, VarKetua);
        //            docText = regexAlamatPemohon.Replace(docText, VarAlamatPemohon);


        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);

        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\TempPenetapanCabut\\penCabut.docx")).Close();


        //        }
        //    }
        //    byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\TempPenetapanCabut\\penCabut.docx"));
        //    return File(fileBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "penetapanpencabutan.docx");

        //    // Application word = new Application();

        //    // // C# doesn't have optional arguments so we'll need a dummy value
        //    // object oMissing = System.Reflection.Missing.Value;

        //    // // Get list of Word files in specified directory
        //    // DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\Template1"));
        //    // FileInfo[] wordFiles = dirInfo.GetFiles("*.doc");

        //    // word.Visible = false;
        //    // word.ScreenUpdating = false;
        //    // try
        //    // {
        //    //     foreach (FileInfo wordFile in wordFiles)
        //    //     {
        //    //         // Cast as Object for word Open method
        //    //         Object filename = (Object)wordFile.FullName;

        //    //         // Use the dummy value as a placeholder for optional arguments
        //    //         Microsoft.Office.Interop.Word.Document doc = word.Documents.Open(ref filename, ref oMissing,
        //    //             ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //    //             ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //    //             ref oMissing, ref oMissing, ref oMissing, ref oMissing);
        //    //         doc.Activate();

        //    //         object outputFileName = wordFile.FullName.Replace(".docx", ".pdf");
        //    //         object fileFormat = WdSaveFormat.wdFormatPDF;

        //    //         // Save document into PDF Format
        //    //         doc.SaveAs(ref outputFileName,
        //    //             ref fileFormat, ref oMissing, ref oMissing,
        //    //             ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //    //             ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //    //             ref oMissing, ref oMissing, ref oMissing, ref oMissing);

        //    //         // Close the Word document, but leave the Word application open.
        //    //         // doc has to be cast to type _Document so that it will find the
        //    //         // correct Close method.                
        //    //         object saveChanges = WdSaveOptions.wdDoNotSaveChanges;
        //    //         ((_Document)doc).Close(ref saveChanges, ref oMissing, ref oMissing);
        //    //         doc = null;
        //    //     }
        //    //      ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
        //    //     word = null;

        //    // }
        //    // catch
        //    // {
        //    //     ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
        //    //     word = null;




        //    // }

        //    // byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\TempPenetapanCabut\\TempFile.pdf"));
        //    // return File(fileBytes, "application/pdf", "Penetapan.pdf");
        //}
        [Route("DaftarKotaPenetapan")]
        [HttpGet()]
        public async Task<IActionResult> GetDaftarKotaPenetapan()
        {
            var daftar = await _context.RefConfig
                .Where(a => a.Uraian == "LOKASI") 
                .Select(a => new
                {
                    kotapenetapan = a.ConfigValue,
                    kotaId = a.ConfigKey
                }).ToListAsync();
            return Ok(daftar);
        }

        [Route("NomorPenetapan")]
        [HttpGet()]
        public async Task<IActionResult> GetNomorPenetapan()
        {
            int intNomorTerakhir = 0;
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == 4 && m.Tahun == DateTime.Now.Year);
                // if (varPenomoran == null)
                // {
                //     varPenomoran = new Penomoran();
                //     intNomorTerakhir = 1;
                //     varPenomoran.NomorTerakhir = 1;
                //     varPenomoran.OrganisasiId = 0;
                //     varPenomoran.KodeOrganisasi = "0";
                //     varPenomoran.NamaOrganisasi = "-";
                //     varPenomoran.Tahun = DateTime.Now.Year;
                //     varPenomoran.RefJenisPenomoranId = 4;
                //     _context.Penomoran.Add(varPenomoran);
                // }
                // else
                // {
                    intNomorTerakhir = varPenomoran.NomorTerakhir + 1;
                    varPenomoran.NomorTerakhir = intNomorTerakhir;
                    _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;
                // }
               
                // varPenomoran = intNomorTerakhir;
                // nomorPenetapan = intNomorTerakhir + "/PP/" + DateTime.Now.Year;
                return Ok(varPenomoran);
        }


        #region KsbControllerRegion
        //~ get pegawai info - taken from KsbController
        private async Task<PegawaiInfo> GetPegawaiByID(string id, string accessToken)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/pegawai/GetPegawaiByNIP/" + id;

            PegawaiInfo _pegawaiInfo = new PegawaiInfo();

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    _pegawaiInfo = JsonConvert.DeserializeObject<PegawaiInfo>(response);
                    return _pegawaiInfo;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return _pegawaiInfo;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefProvinsi>> GetAllProvinsi(string accessToken)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetAllProvinsi";

            IEnumerable<Hr_RefProvinsi> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefProvinsi>>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefKota>> GetAllKota(string accessToken)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetAllKota";

            IEnumerable<Hr_RefKota> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefKota>>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private string GetBaseUrl()
        {
            string baseUrl = "";

            if (Request.Host.Host == "localhost")
            {
                //~ base url is SETPP BO url //??? check again
                baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            }
            //~ else not localhost
            else
            {
                baseUrl = _context.RefConfig.Where(a => a.ConfigKey == "BO_BASEURL").Select(x => x.ConfigValue).ToString();
                
            }

            return baseUrl;
        }

        [Route("BaseUrl")]
        [HttpGet]
        public string GetBaseUrlPenetapan()
        {
            string BaseUrl = GetBaseUrl() + "/api/Penetapan/CetakPenetapan/";
            return BaseUrl;
        }

        [Route("BaseUrlCabut")]
        [HttpGet]
        public string GetBaseUrlPenetapanCabut()
        {
            string BaseUrl = GetBaseUrl() + "/api/Penetapan/CetakPenetapanPencabutan/";
            return BaseUrl;
        }


        //~ model pegawaiInfo got from ksb
        //~ need to be updated on change
        private class PegawaiInfo
        {
            public string GelarBelakang { get; set; }
            public string GelarDepan { get; set; }
            public int IDPegawai { get; set; }
            public string Nama { get; set; }
            public string NIP18 { get; set; }
        }

        // model provinsi
        private class Hr_RefProvinsi
        {
            public int IDRefProvinsi { get; set; }
            public string KodeProvinsi { get; set; }
            public string NamaIbukotaProvinsi { get; set; }
            public string NamaProvinsi { get; set; }
        }

        // model kota
        private class Hr_RefKota
        {
            public int IDRefKota { get; set; }
            public int? IDRefProvinsi { get; set; }
            public string KodeKota { get; set; }
            public string NamaKota { get; set; }
        }
        #endregion

        private class Sengketa
        {
            public int No { get; set; }
            public string NoSengketa { get; set; }
            public string Pemohon { get; set; }
            public string JenisPajak { get; set; }
            public string TahunPajak { get; set; }
            public string JenisPemeriksaan { get; set; }
        }

        private async Task GetAccessToken()
        {
            var accTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken"));
            if (accTokenClaim != null)
            {
                accessToken = accTokenClaim.Value;
            }
            else
            {
                await GetNewAccessToken();
            }
            //bool isValid = await AccessTokenIsValid(accessToken);
            //if (!isValid)
            //{
            //    GetNewAccessToken();
            //}
        }

        private void GetRefreshToken()
        {
            var refreshTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("refreshToken"));
            if (refreshTokenClaim != null)
            {
                refreshToken = refreshTokenClaim.Value;
            }
        }

        private async Task GetNewAccessToken()
        {
            GetRefreshToken();
            string requestBody = "client_id=devapps&client_secret=1234&grant_type=refresh_token&refresh_token=" + refreshToken;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(requestBody, Encoding.UTF8, "application/x-www-form-urlencoded");
                    var response = await client.PostAsync(sSOUrl + "/oauth/token", content);
                    var data = await response.Content.ReadAsStringAsync();
                    var dict = JsonConvert.DeserializeObject<OauthToken>(data);
                    // update access token
                    accessToken = dict.access_token;
                    //((ClaimsIdentity)User.Identity).RemoveClaim(User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")));
                    ((ClaimsIdentity)User.Identity).AddClaim(new Claim("accessToken", accessToken));
                }
                catch (Exception e)
                {
                    var message = e.Message;
                }
            }
        }

        private async Task<bool> AccessTokenIsValid(string paramAccessToken)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", paramAccessToken);
                var response = await client.GetAsync("http://api.kemenkeu.go.id/api/Values/Get");
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        private class OauthToken
        {
            public string access_token { get; set; }
            public string expires_in { get; set; }
            public string refresh_token { get; set; }
        }

    }


}