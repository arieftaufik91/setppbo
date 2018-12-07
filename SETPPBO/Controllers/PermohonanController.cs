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
using Microsoft.AspNetCore.Hosting;
using System.Text.RegularExpressions;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Dynamic;
using System.Net;
using SETPPBO.Utility;
using Microsoft.AspNetCore.Authorization;
using Pusintek.AspNetcore.DocIO;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Permohonan")]
    public class PermohonanController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private DocumentService documentService;

        public string FtpServer()
        {
            string ftp = _context.RefConfig.Where(x => x.ConfigKey == "FTP_LOCATION").Select(x => x.ConfigValue).FirstOrDefault();
            return ftp;
        }
        public string FtpUser()
        {
            string ftp = _context.RefConfig.Where(x => x.ConfigKey == "FTP_USERNAME").Select(x => x.ConfigValue).FirstOrDefault();
            return ftp;
        }

        public string FtpPassword()
        {
            string ftp = _context.RefConfig.Where(x => x.ConfigKey == "FTP_PASSWORD").Select(x => x.ConfigValue).FirstOrDefault();
            return ftp;
        }

        public PermohonanController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Permohonan
        [HttpGet]
        public async Task<IActionResult> GetPermohonan()
        {
            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            var AllPermohonan = await (from a in _context.Permohonan
                                       join b in _context.RefJenisPermohonan
                                       on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                       join c in _context.Pemohon
                                       on a.PemohonId equals c.PemohonId
                                       join d in _context.RefJenisPajak
                                       on a.RefJenisPajakId equals d.RefJenisPajakId
                                       join e in _context.RefCaraKirim
                                       on a.RefCaraKirimPermohonanId equals e.RefCaraKirimId
                                       orderby a.CreatedDate descending
                                       select new
                                       {
                                           a.PermohonanId,
                                           a.RefJenisPermohonanId,
                                           RefJenisPermohonanUr = b.Uraian,
                                           a.PemohonId,
                                           a.PegawaiId,
                                           PemohonName = c.Nama,
                                           PemohonNPWP = c.Npwp,
                                           a.NoSuratPermohonan,
                                           a.TglSuratPermohonan,
                                           a.RefJenisPajakId,
                                           RefJenisPajakUr = d.Uraian,
                                           a.NoKep,
                                           a.TglKep,
                                           a.TglTerimaKep,
                                           a.NoSkp,
                                           a.TglSkp,
                                           a.TglTerimaPermohonan,
                                           a.TglKirimPermohonan,
                                           a.RefCaraKirimPermohonanId,
                                           a.TglPos,
                                           RefCaraKirimPermohonanUr = e.Uraian,
                                           a.Npwp,
                                           a.NoSengketa,
                                           a.NoPendaftaran,
                                           a.RefStatusId,
                                           a.Sdtk,
                                           UrRole = role,
                                           a.FilePdfSuratPermohonan,
                                           isFilePdfSuratPermohonan = (a.FilePdfSuratPermohonan == null) ? false : true,
                                           a.FileDocSuratPermohonan,
                                           isFileDocSuratPermohonan = (a.FileDocSuratPermohonan == null) ? false : true,
                                           a.FilePdfObjekSengketa,
                                           isFilePdfObjekSengketa = (a.FilePdfObjekSengketa == null) ? false : true,
                                           a.FilePdfBuktiBayar,
                                           isFilePdfBuktiBayar = (a.FilePdfBuktiBayar == null) ? false : true,
                                           a.FilePdfSkk,
                                           isFilePdfSkk = (a.FilePdfSkk == null) ? false : true,
                                           a.FilePdfSkp,
                                           isFilePdfSkp = (a.FilePdfSkp == null) ? false : true,
                                           a.AktaPerusahaan,
                                       }
                                       ).ToListAsync();
            return Ok(AllPermohonan);
        }
        
        // Menu Permohonan 

        [HttpPost("Paging")] //Buat API request menjadi Post
        public async Task<IActionResult> GetPermohonanPaging([FromBody] Paging paging) //Buat Parameter seperti disamping
        {
            dynamic result = new ExpandoObject(); //buat object ini.

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            var query = await (from a in _context.Permohonan
                               join b in _context.RefJenisPermohonan
                               on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                               join c in _context.Pemohon
                               on a.PemohonId equals c.PemohonId
                               join d in _context.RefJenisPajak
                               on a.RefJenisPajakId equals d.RefJenisPajakId
                               join e in _context.RefCaraKirim
                               on a.RefCaraKirimPermohonanId equals e.RefCaraKirimId
                               where ( //for searching parameters
                                        b.Uraian.Contains(paging.Search) ||
                                        c.Nama.Contains(paging.Search) ||
                                        c.Npwp.Contains(paging.Search) ||
                                        d.Uraian.Contains(paging.Search) ||
                                        a.NoKep.Contains(paging.Search) ||
                                        a.NoSkp.Contains(paging.Search) ||
                                        e.Uraian.Contains(paging.Search) ||
                                        a.Npwp.Contains(paging.Search) ||
                                        a.NoSengketa.Contains(paging.Search) ||
                                        a.NoPendaftaran.Contains(paging.Search) ||
                                        a.NoSuratPermohonan.Contains(paging.Search)
                                     )
                               orderby a.CreatedDate descending
                               select new
                               {
                                   a.PermohonanId,
                                   a.RefJenisPermohonanId,
                                   RefJenisPermohonanUr = b.Uraian,
                                   a.PemohonId,
                                   a.PegawaiId,
                                   PemohonName = c.Nama,
                                   PemohonNPWP = c.Npwp,
                                   a.NoSuratPermohonan,
                                   a.TglSuratPermohonan,
                                   a.RefJenisPajakId,
                                   RefJenisPajakUr = d.Uraian,
                                   a.NoKep,
                                   a.TglKep,
                                   a.TglTerimaKep,
                                   a.NoSkp,
                                   a.TglSkp,
                                   a.TglTerimaPermohonan,
                                   a.TglKirimPermohonan,
                                   a.RefCaraKirimPermohonanId,
                                   RefCaraKirimPermohonanUr = e.Uraian,
                                   a.Npwp,
                                   a.NoSengketa,
                                   FormatNoSengketa = a.NoSengketa.Substring(0,6)+"/"+ a.NoSengketa.Substring(6, 2)+"/"+ a.NoSengketa.Substring(8, 4),
                                   a.NoPendaftaran,
                                   a.RefStatusId,
                                   a.TglPos,
                                   a.FilePdfSuratPermohonan,
                                   isFilePdfSuratPermohonan = (a.FilePdfSuratPermohonan == null) ? false : true,
                                   a.FileDocSuratPermohonan,
                                   isFileDocSuratPermohonan = (a.FileDocSuratPermohonan == null) ? false : true,
                                   a.FilePdfObjekSengketa,
                                   isFilePdfObjekSengketa = (a.FilePdfObjekSengketa == null) ? false : true,
                                   a.FilePdfBuktiBayar,
                                   isFilePdfBuktiBayar = (a.FilePdfBuktiBayar == null) ? false : true,
                                   a.FilePdfSkk,
                                   isFilePdfSkk = (a.FilePdfSkk == null) ? false : true,
                                   a.FilePdfSkp,
                                   isFilePdfSkp = (a.FilePdfSkp == null) ? false : true,
                                   UrRole = role
                               }).ToListAsync();

            result.Data = query.Skip(paging.Offset * paging.Limit).Take(paging.Limit); //for pagination
            result.Count = query.Count(); //total All Data
            return Ok(result);
        }
        
        // Menu Pemeriksaan Awal

        [HttpPost("PemeriksaanAwal")] //Buat API request menjadi Post
        public async Task<IActionResult> GetPemeriksaanPaging([FromBody] Paging paging) //Buat Parameter seperti disamping
        {
            dynamic result = new ExpandoObject(); //buat object ini.

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            int[] status = { 121, 130, 131 };

            var query = await (from a in _context.Permohonan
                               join b in _context.RefJenisPermohonan
                               on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                               join c in _context.Pemohon
                               on a.PemohonId equals c.PemohonId
                               join d in _context.RefJenisPajak
                               on a.RefJenisPajakId equals d.RefJenisPajakId
                               join e in _context.RefCaraKirim
                               on a.RefCaraKirimPermohonanId equals e.RefCaraKirimId
                               where ( //for searching parameters
                                        (b.Uraian.Contains(paging.Search) ||
                                        c.Nama.Contains(paging.Search) ||
                                        c.Npwp.Contains(paging.Search) ||
                                        d.Uraian.Contains(paging.Search) ||
                                        a.NoKep.Contains(paging.Search) ||
                                        a.NoSkp.Contains(paging.Search) ||
                                        e.Uraian.Contains(paging.Search) ||
                                        a.Npwp.Contains(paging.Search) ||
                                        a.NoSengketa.Contains(paging.Search) ||
                                        a.NoPendaftaran.Contains(paging.Search) ||
                                        a.NoSuratPermohonan.Contains(paging.Search)) && (a.RefStatusId == 121 || a.RefStatusId == 130 || a.RefStatusId == 131)
                                     ) 
                               orderby a.CreatedDate descending
                               select new
                               {
                                   a.PermohonanId,
                                   a.RefJenisPermohonanId,
                                   RefJenisPermohonanUr = b.Uraian,
                                   a.PemohonId,
                                   a.PegawaiId,
                                   PemohonName = c.Nama,
                                   PemohonNPWP = c.Npwp,
                                   a.NoSuratPermohonan,
                                   a.TglSuratPermohonan,
                                   a.RefJenisPajakId,
                                   RefJenisPajakUr = d.Uraian,
                                   a.NoKep,
                                   a.TglKep,
                                   a.TglTerimaKep,
                                   a.NoSkp,
                                   a.TglSkp,
                                   a.TglTerimaPermohonan,
                                   a.TglKirimPermohonan,
                                   a.RefCaraKirimPermohonanId,
                                   RefCaraKirimPermohonanUr = e.Uraian,
                                   a.Npwp,
                                   a.NoSengketa,
                                   FormatNoSengketa = a.NoSengketa.Substring(0, 6) + "/" + a.NoSengketa.Substring(6, 2) + "/" + a.NoSengketa.Substring(8, 4),
                                   a.NoPendaftaran,
                                   a.RefStatusId,
                                   a.FilePdfSuratPermohonan,
                                   isFilePdfSuratPermohonan = (a.FilePdfSuratPermohonan == null) ? false : true,
                                   a.FileDocSuratPermohonan,
                                   isFileDocSuratPermohonan = (a.FileDocSuratPermohonan == null) ? false : true,
                                   a.FilePdfObjekSengketa,
                                   isFilePdfObjekSengketa = (a.FilePdfObjekSengketa == null) ? false : true,
                                   a.FilePdfBuktiBayar,
                                   isFilePdfBuktiBayar = (a.FilePdfBuktiBayar == null) ? false : true,
                                   a.FilePdfSkk,
                                   isFilePdfSkk = (a.FilePdfSkk == null) ? false : true,
                                   a.FilePdfSkp,
                                   isFilePdfSkp = (a.FilePdfSkp == null) ? false : true,
                                   UrRole = role
                               }).ToListAsync();

            result.Data = query.Skip(paging.Offset * paging.Limit).Take(paging.Limit); //for pagination
            result.Count = query.Count(); //total All Data
            return Ok(result);
        }

        [HttpPost("ValidasiPermohonan")] //Buat API request menjadi Post
        public async Task<IActionResult> GetValidasiPaging([FromBody] Paging paging) //Buat Parameter seperti disamping
        {
            dynamic result = new ExpandoObject(); //buat object ini.

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            int[] status = { 121, 130, 131 };

            var query = await (from a in _context.Permohonan
                               join b in _context.RefJenisPermohonan
                               on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                               join c in _context.Pemohon
                               on a.PemohonId equals c.PemohonId
                               join d in _context.RefJenisPajak
                               on a.RefJenisPajakId equals d.RefJenisPajakId
                               join e in _context.RefCaraKirim
                               on a.RefCaraKirimPermohonanId equals e.RefCaraKirimId
                               where ( //for searching parameters
                                        (b.Uraian.Contains(paging.Search) ||
                                        c.Nama.Contains(paging.Search) ||
                                        c.Npwp.Contains(paging.Search) ||
                                        d.Uraian.Contains(paging.Search) ||
                                        a.NoKep.Contains(paging.Search) ||
                                        a.NoSkp.Contains(paging.Search) ||
                                        e.Uraian.Contains(paging.Search) ||
                                        a.Npwp.Contains(paging.Search) ||
                                        a.NoSengketa.Contains(paging.Search) ||
                                        a.NoPendaftaran.Contains(paging.Search) ||
                                        a.NoSuratPermohonan.Contains(paging.Search)) && (a.RefStatusId == 110 || a.RefStatusId == 120)
                                     )
                               orderby a.CreatedDate descending
                               select new
                               {
                                   a.PermohonanId,
                                   a.RefJenisPermohonanId,
                                   RefJenisPermohonanUr = b.Uraian,
                                   a.PemohonId,
                                   a.PegawaiId,
                                   PemohonName = c.Nama,
                                   PemohonNPWP = c.Npwp,
                                   a.NoSuratPermohonan,
                                   a.TglSuratPermohonan,
                                   a.RefJenisPajakId,
                                   RefJenisPajakUr = d.Uraian,
                                   a.NoKep,
                                   a.TglKep,
                                   a.TglTerimaKep,
                                   a.NoSkp,
                                   a.TglSkp,
                                   a.TglTerimaPermohonan,
                                   a.TglKirimPermohonan,
                                   a.RefCaraKirimPermohonanId,
                                   RefCaraKirimPermohonanUr = e.Uraian,
                                   a.Npwp,
                                   a.NoSengketa,
                                   FormatNoSengketa = a.NoSengketa.Substring(0, 6) + "/" + a.NoSengketa.Substring(6, 2) + "/" + a.NoSengketa.Substring(8, 4),
                                   a.NoPendaftaran,
                                   a.RefStatusId,
                                   a.FilePdfSuratPermohonan,
                                   isFilePdfSuratPermohonan = (a.FilePdfSuratPermohonan == null) ? false : true,
                                   a.FileDocSuratPermohonan,
                                   isFileDocSuratPermohonan = (a.FileDocSuratPermohonan == null) ? false : true,
                                   a.FilePdfObjekSengketa,
                                   isFilePdfObjekSengketa = (a.FilePdfObjekSengketa == null) ? false : true,
                                   a.FilePdfBuktiBayar,
                                   isFilePdfBuktiBayar = (a.FilePdfBuktiBayar == null) ? false : true,
                                   a.FilePdfSkk,
                                   isFilePdfSkk = (a.FilePdfSkk == null) ? false : true,
                                   a.FilePdfSkp,
                                   isFilePdfSkp = (a.FilePdfSkp == null) ? false : true,
                                   UrRole = role
                               }).ToListAsync();

            result.Data = query.Skip(paging.Offset * paging.Limit).Take(paging.Limit); //for pagination
            result.Count = query.Count(); //total All Data
            return Ok(result);
        }

        // GET: api/Permohonan/5
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

        // Menu Permohonan , Menu Pemeriksaan Awal
        // GET: api/Permohonan/Kelengkapan/5
        [HttpGet("{id}")]
        [Route("PermohonanKelengkapan/{id}")]

        public async Task<IActionResult> GetPermohonanKelengkapan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                //var permohonan = await _context.Permohonan.SingleOrDefaultAsync(m => m.PermohonanId == id);
                var varPermohonan = await (from a in _context.Permohonan
                                           join c in _context.RefJenisPermohonan
                                           on a.RefJenisPermohonanId equals c.RefJenisPermohonanId
                                           join d in _context.Pemohon
                                           on a.PemohonId equals d.PemohonId
                                           join e in _context.RefJenisPajak
                                           on a.RefJenisPajakId equals e.RefJenisPajakId
                                           where a.PermohonanId == id
                                           select new
                                           {
                                               a.PermohonanId,
                                               a.RefJenisPermohonanId,
                                               RefJenisPermohonanUr = c.Uraian,
                                               a.PemohonId,
                                               a.PegawaiId,
                                               PemohonName = d.Nama,
                                               PemohonNPWP = d.Npwp,
                                               a.NoSuratPermohonan,
                                               a.TglSuratPermohonan,
                                               a.RefJenisPajakId,
                                               RefJenisPajakUr = e.Uraian,
                                               a.NoKep,
                                               a.TglKep,
                                               a.TglTerimaKep,
                                               a.NoSkp,
                                               a.TglSkp,
                                               a.TglTerimaPermohonan,
                                               a.TglKirimPermohonan,
                                               a.RefCaraKirimPermohonanId,
                                               RefCaraKirimPermohonanUr = e.Uraian,
                                               TglPos = (a.TglPos==null) ? a.TglTerimaPermohonan : a.TglPos.Value,
                                               a.Npwp,
                                               a.NoSengketa,
                                               a.NoPendaftaran,
                                               a.MasaPajakAkhirBulan,
                                               a.MasaPajakAwalBulan,
                                               a.MasaPajakAwalTahun,
                                               a.RefStatusId,
                                               RefJenisPemeriksaanId=(a.RefJenisPemeriksaanId==null)?2:a.RefJenisPemeriksaanId,
                                               a.RefPembagianBerkasId,
                                               Sdtk= (a.Sdtk==null)? 0 : 1,
                                               FilePdfSuratPermohonan = (a.FilePdfSuratPermohonan == null) ? "" : a.FilePdfSuratPermohonan,
                                               FileDocSuratPermohonan = (a.FileDocSuratPermohonan == null) ? "" : a.FileDocSuratPermohonan,
                                               FilePdfObjekSengketa = (a.FilePdfObjekSengketa == null) ? "" : a.FilePdfObjekSengketa,
                                               FilePdfBuktiBayar = (a.FilePdfBuktiBayar == null) ? "" : a.FilePdfBuktiBayar,
                                               FilePdfSkk = (a.FilePdfSkk == null) ? "" : a.FilePdfSkk,
                                               FilePdfSkp = (a.FilePdfSkp == null) ? "" : a.FilePdfSkp,

                                               isFilePdfSuratPermohonan = (a.FilePdfSuratPermohonan == null) ? false : true,
                                               isFileDocSuratPermohonan = (a.FileDocSuratPermohonan == null) ? false : true,
                                               isFilePdfObjekSengketa = (a.FilePdfObjekSengketa == null) ? false : true,
                                               isFilePdfBuktiBayar = (a.FilePdfBuktiBayar == null) ? false : true,
                                               isFilePdfSkk = (a.FilePdfSkk == null) ? false : true,
                                               isFilePdfSkp = (a.FilePdfSkp == null) ? false : true,
                                               a.AktaPerusahaan,
                                               
                                               isSyarat1 = (a.Checklist1!=null) ? 1 : 0,
                                               isSyarat2 = (a.Checklist2!= null) ? 1 : 0,
                                               isSyarat3 = (a.Checklist3!= null) ? 1 : 0,
                                               isSyarat4 = (a.Checklist4!= null) ? 1 : 0,
                                               a.SyaratFormal
                                           }).FirstOrDefaultAsync();

                if (varPermohonan == null)
                {
                    return NotFound();
                }

                return Ok(varPermohonan);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Ok();
            }

        }

        // Menu Permohonan (Tab Data Permohonan), Menu Pemeriksaan Awal (Tab Data Permohonan)
        // PUT: api/Permohonan/5
        [Route("UpdatePermohonan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpdatePermohonan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }


            try
            {
                Permohonan varPermohonan = _context.Permohonan.Find(id);
                varPermohonan.RefJenisPermohonanId = permohonan.RefJenisPermohonanId;
                varPermohonan.NoSuratPermohonan = permohonan.NoSuratPermohonan;
                varPermohonan.TglSuratPermohonan = permohonan.TglSuratPermohonan;
                varPermohonan.TglTerimaPermohonan = permohonan.TglTerimaPermohonan;
                varPermohonan.RefCaraKirimPermohonanId = permohonan.RefCaraKirimPermohonanId;
                varPermohonan.RefJenisPajakId = permohonan.RefJenisPajakId;
                varPermohonan.NoKep = permohonan.NoKep;
                varPermohonan.TglKep = permohonan.TglKep;
                varPermohonan.TglTerimaKep = permohonan.TglTerimaKep;
                varPermohonan.NoSkp = permohonan.NoSkp;
                varPermohonan.MasaPajakAwalBulan = permohonan.MasaPajakAwalBulan;
                varPermohonan.MasaPajakAkhirBulan = permohonan.MasaPajakAkhirBulan;
                varPermohonan.MasaPajakAwalTahun = permohonan.MasaPajakAwalTahun;
                varPermohonan.PemohonId = permohonan.PemohonId;
                varPermohonan.RefStatusId = permohonan.RefStatusId;
                varPermohonan.UpdatedBy = PegawaiID;
                varPermohonan.UpdatedDate = DateTime.Now;

                if (varPermohonan.RefJenisPermohonanId == 1) // Permohonan Banding
                {
                    RefNormaWaktu refNormaWaktu = _context.RefNormaWaktu.Where(a => a.RefJenisPermohonanId == 1 && a.RefJenisNormaWaktuId == 9).FirstOrDefault();
                    // Add Months
                    varPermohonan.TglJatuhTempoSiapSidang = permohonan.TglTerimaPermohonan.Value.AddMonths(refNormaWaktu.Bulan);
                    // Add Days
                    varPermohonan.TglJatuhTempoSiapSidang = varPermohonan.TglJatuhTempoSiapSidang.Value.AddDays(refNormaWaktu.Hari);
                }
                else
                {
                    RefNormaWaktu refNormaWaktu = _context.RefNormaWaktu.Where(a => a.RefJenisPermohonanId == 2 && a.RefJenisNormaWaktuId == 9).FirstOrDefault();
                    // Add Months
                    varPermohonan.TglJatuhTempoSiapSidang = permohonan.TglTerimaPermohonan.Value.AddMonths(refNormaWaktu.Bulan);
                    // Add Days
                    varPermohonan.TglJatuhTempoSiapSidang = varPermohonan.TglJatuhTempoSiapSidang.Value.AddDays(refNormaWaktu.Hari);
                }

                _context.Entry(varPermohonan).Property("RefJenisPermohonanId").IsModified = true;
                _context.Entry(varPermohonan).Property("NoSuratPermohonan").IsModified = true;
                _context.Entry(varPermohonan).Property("TglSuratPermohonan").IsModified = true;
                _context.Entry(varPermohonan).Property("TglTerimaPermohonan").IsModified = true;
                _context.Entry(varPermohonan).Property("RefCaraKirimPermohonanId").IsModified = true;
                _context.Entry(varPermohonan).Property("RefJenisPajakId").IsModified = true;
                _context.Entry(varPermohonan).Property("NoKep").IsModified = true;
                _context.Entry(varPermohonan).Property("TglKep").IsModified = true;
                _context.Entry(varPermohonan).Property("TglTerimaKep").IsModified = true;
                _context.Entry(varPermohonan).Property("NoSkp").IsModified = true;
                _context.Entry(varPermohonan).Property("MasaPajakAwalBulan").IsModified = true;
                _context.Entry(varPermohonan).Property("MasaPajakAkhirBulan").IsModified = true;
                _context.Entry(varPermohonan).Property("MasaPajakAwalTahun").IsModified = true;
                _context.Entry(varPermohonan).Property("RefStatusId").IsModified = true;
                _context.Entry(varPermohonan).Property("PemohonId").IsModified = true;
                _context.Entry(varPermohonan).Property("TglJatuhTempoSiapSidang").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedBy").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedDate").IsModified = true;

                _context.Entry(varPermohonan).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
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

        // Menu Permohonan (Tab Kelengkapan), Menu Pemeriksaan Awal (Tab Kelengkapan)
        // PUT: api/Permohonan/5
        [Route("UpdateKelengkapan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpdateKelengkapan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }


            try
            {
                Permohonan varPermohonan = _context.Permohonan.Find(id);
                varPermohonan.AktaPerusahaan = permohonan.AktaPerusahaan;
                varPermohonan.RefStatusId = permohonan.RefStatusId;
                varPermohonan.UpdatedBy = PegawaiID;
                varPermohonan.UpdatedDate = DateTime.Now;

                _context.Entry(varPermohonan).Property("AktaPerusahaan").IsModified = true;
                _context.Entry(varPermohonan).Property("RefStatusId").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedBy").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedDate").IsModified = true;

                _context.Entry(varPermohonan).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
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


        // Menu Pemeriksaan Awal (Tab Jenis Pemeriksaan)
        // PUT: api/Permohonan/5
        [Route("UpdateJenisPemeriksaan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpdateJenisPemeriksaan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }


            try
            {
                Permohonan varPermohonan = _context.Permohonan.Find(id);
                varPermohonan.RefJenisPemeriksaanId = permohonan.RefJenisPemeriksaanId;
                varPermohonan.RefPembagianBerkasId = permohonan.RefPembagianBerkasId;
                varPermohonan.Sdtk = permohonan.Sdtk;
                varPermohonan.RefStatusId = 130;
                varPermohonan.SyaratFormal = 4;
                varPermohonan.UpdatedBy = PegawaiID;
                varPermohonan.UpdatedDate = DateTime.Now;

                _context.Entry(varPermohonan).Property("RefJenisPemeriksaanId").IsModified = true;
                _context.Entry(varPermohonan).Property("TglPemeriksaan").IsModified = true;
                _context.Entry(varPermohonan).Property("PemeriksaId").IsModified = true;
                _context.Entry(varPermohonan).Property("SyaratFormal").IsModified = true;
                _context.Entry(varPermohonan).Property("RefStatusId").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedBy").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedDate").IsModified = true;

                _context.Entry(varPermohonan).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
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

        // PUT: api/Permohonan/5
        [Route("UpdatePembagianBerkas/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpdatePembagianBerkas([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }


            try
            {
                Permohonan varPermohonan = _context.Permohonan.Find(id);
                varPermohonan.RefPembagianBerkasId = permohonan.RefPembagianBerkasId;
                varPermohonan.TglPemeriksaan = DateTime.Now;
                varPermohonan.PemeriksaId = PegawaiID;
                varPermohonan.RefStatusId = 130;
                varPermohonan.UpdatedBy = PegawaiID;
                varPermohonan.UpdatedDate = DateTime.Now;

                _context.Entry(varPermohonan).Property("RefPembagianBerkasId").IsModified = true;
                _context.Entry(varPermohonan).Property("TglPemeriksaan").IsModified = true;
                _context.Entry(varPermohonan).Property("PemeriksaId").IsModified = true;
                _context.Entry(varPermohonan).Property("RefStatusId").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedBy").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedDate").IsModified = true;

                _context.Entry(varPermohonan).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
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
        // PUT: api/Permohonan/5
        [Route("Update/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPermohonan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }


            try
            {
                Permohonan varPermohonan = _context.Permohonan.Find(id);
                RefJenisPajak varJenisPajak = _context.RefJenisPajak.Find(varPermohonan.RefJenisPajakId);

                if (role == "Administrator")
                {
                    if (permohonan.RefStatusId == 110) // Draft Permohonan
                    {
                        varPermohonan.RefStatusId = 121;

                        // Generate Nomor Sengketa
                        Penomoran varPenomoran = _context.Penomoran.Where(a => a.RefJenisPenomoranId == 2 && a.Tahun == DateTime.Now.Year).FirstOrDefault();

                        if (varPenomoran == null)
                        {
                            varPenomoran = new Penomoran
                            {
                                RefJenisPenomoranId = 2,
                                Tahun = DateTime.Now.Year,
                                OrganisasiId = 0,
                                KodeOrganisasi = "0",
                                NamaOrganisasi = "-",
                                NomorTerakhir = 1
                            };
                            _context.Add(varPenomoran);
                        }
                        else
                        {
                            varPenomoran.NomorTerakhir = varPenomoran.NomorTerakhir + 1;
                            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;
                            _context.Entry(varPenomoran).State = EntityState.Modified;

                            await _context.SaveChangesAsync();

                            varPermohonan.NoSengketa = varPenomoran.NomorTerakhir.ToString("D6") + varJenisPajak.Kode.ToString() + varPermohonan.TglTerimaPermohonan.Value.Year.ToString();
                            varPermohonan.TglKirimPermohonan = DateTime.Now;
                            _context.Entry(varPermohonan).Property("TglKirimPermohonan").IsModified = true;
                        }
                    }
                    else if (permohonan.RefStatusId == 131) // Kirim Pemeriksaan Awal
                    {
                        varPermohonan.RefStatusId = 131;
                        varPermohonan.TglPemeriksaan = DateTime.Now;
                        varPermohonan.PemeriksaId = PegawaiID;
                        _context.Entry(varPermohonan).Property("TglPemeriksaan").IsModified = true;
                        _context.Entry(varPermohonan).Property("PemeriksaId").IsModified = true;

                    }
                }
                else if (role == "User")
                {
                    varPermohonan.RefStatusId = permohonan.RefStatusId;

                }
                else if (role == "Termohon")
                {
                    varPermohonan.RefStatusId = permohonan.RefStatusId;

                }
                else if (role == "Pemohon")
                {
                    varPermohonan.RefStatusId = permohonan.RefStatusId;

                }

                varPermohonan.UpdatedDate = DateTime.Now;
                varPermohonan.UpdatedBy = PegawaiID;

                _context.Entry(varPermohonan).Property("RefStatusId").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedDate").IsModified = true;
                _context.Entry(varPermohonan).Property("UpdatedBy").IsModified = true;
                _context.Entry(varPermohonan).Property("NoSengketa").IsModified = true;
                _context.Entry(varPermohonan).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
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

        // POST: api/Permohonan
        [HttpPost]
        public async Task<IActionResult> PostPermohonan([FromBody] Permohonan permohonan)
        {
            try
            {
                var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
                Int32 PegawaiID = Convert.ToInt32(varPegawaiID);

                Int32 statusSDTK = 0;

                System.Guid PermohonanID = System.Guid.NewGuid();
                permohonan.PermohonanId = PermohonanID.ToString();
                permohonan.PegawaiId = PegawaiID;
                permohonan.TglObjekSengketa = DateTime.MaxValue;
                permohonan.CreatedBy = PegawaiID;

                var varPemohon = await _context.Pemohon.SingleOrDefaultAsync(m => m.PemohonId == permohonan.PemohonId);
                permohonan.Npwp = varPemohon.Npwp;

                int intNomorTerakhir = 0;


                int intWPJ = permohonan.NoKep.LastIndexOf("WPJ");
                int intWBC = permohonan.NoKep.LastIndexOf("WBC");
              
                if (intWPJ > 0)
                {
                    string strKepWPJ = permohonan.NoKep.Substring(intWPJ, 6);

                    var varWPJ = _context.RefKodeTermohon.Where(a => a.KodeSurat == strKepWPJ).FirstOrDefault();

                    if (varWPJ != null)
                    {
                        statusSDTK = varWPJ.IsSdtk.Value;

                        if (varWPJ.OrganisasiBerkasId == null)
                        {
                            permohonan.RefPembagianBerkasId = 16777;
                        }
                        else
                            permohonan.RefPembagianBerkasId = varWPJ.OrganisasiBerkasId;

                    }
                    else
                        statusSDTK = 0;
                    
                }
                else
                {
                    if (intWBC > 0)
                    {
                       string strKepWBC = permohonan.NoKep.Substring(intWBC, 6);

                        var varSDTK = _context.RefKodeTermohon.Where(a => a.KodeSurat == strKepWBC).FirstOrDefault();

                        permohonan.RefPembagianBerkasId = 16778;

                        if (varSDTK != null)
                            statusSDTK = varSDTK.IsSdtk.Value;
                        else
                            statusSDTK = 0;
                    }

                }

                var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == 1 && m.Tahun == DateTime.Now.Year);

                if (varPenomoran == null)
                {
                    varPenomoran = new Penomoran();
                    intNomorTerakhir = 1;
                    varPenomoran.NomorTerakhir = 1;
                    varPenomoran.OrganisasiId = 0;
                    varPenomoran.KodeOrganisasi = "0";
                    varPenomoran.NamaOrganisasi = "-";
                    varPenomoran.Tahun = DateTime.Now.Year;
                    varPenomoran.RefJenisPenomoranId = 1;
                    _context.Penomoran.Add(varPenomoran);
                }
                else
                {
                    intNomorTerakhir = varPenomoran.NomorTerakhir + 1;
                    varPenomoran.NomorTerakhir = intNomorTerakhir;
                    _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;
                }
                permohonan.RefStatusId = 100; // Draft Permohonan
                permohonan.NoPendaftaran = intNomorTerakhir + "/" + DateTime.Now.Year;
                permohonan.Sdtk = Convert.ToByte(statusSDTK);

                if (permohonan.RefJenisPermohonanId==1) // Permohonan Banding
                {
                    RefNormaWaktu refNormaWaktu = _context.RefNormaWaktu.Where(a => a.RefJenisPermohonanId==1 && a.RefJenisNormaWaktuId==9).FirstOrDefault();
                    // Add Months
                    permohonan.TglJatuhTempoSiapSidang = permohonan.TglTerimaPermohonan.Value.AddMonths(refNormaWaktu.Bulan);
                    // Add Days
                    permohonan.TglJatuhTempoSiapSidang = permohonan.TglJatuhTempoSiapSidang.Value.AddDays(refNormaWaktu.Hari);
                }
                else
                {
                    RefNormaWaktu refNormaWaktu = _context.RefNormaWaktu.Where(a => a.RefJenisPermohonanId == 2 && a.RefJenisNormaWaktuId == 9).FirstOrDefault();
                    // Add Months
                    permohonan.TglJatuhTempoSiapSidang = permohonan.TglTerimaPermohonan.Value.AddMonths(refNormaWaktu.Bulan);
                    // Add Days
                    permohonan.TglJatuhTempoSiapSidang = permohonan.TglJatuhTempoSiapSidang.Value.AddDays(refNormaWaktu.Hari);
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Permohonan.Add(permohonan);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
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

        // DELETE: api/Permohonan/5
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

        [HttpGet]
        [Route("CekKepSkp/{id}")]
        public bool PermohonanDoubleExists(string id)
        {
            Permohonan permohonan = _context.Permohonan.Find(id);

            return _context.Permohonan.Any(e => e.NoKep == permohonan.NoKep && e.NoSkp == permohonan.NoSkp && e.PermohonanId != id);
        }

        //~ get daftar permohonan yang sudah divalidasi
        //~ need filter, and only selected fields
        // GET: api/permohonan/PemeriksaanAwal
        [Route("PemeriksaanAwal")]
        [HttpGet]
        public async Task<IActionResult> GetPemeriksaanAwal()
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;

            int status = 121; //~ permohonan sudah divalidasi

            return Ok(await _context.Permohonan
                .Select(a => new
                {
                    a.PermohonanId,
                    a.NoPendaftaran,
                    a.RefJenisPermohonanId,
                    RefJenisPermohonan = a.RefJenisPermohonan.Uraian,
                    a.NoSuratPermohonan,
                    a.TglTerimaPermohonan,
                    a.RefJenisPemeriksaanId,
                    RefJenisPemeriksaan = a.RefJenisPemeriksaan.Uraian,
                    a.RefPembagianBerkasId,
                    //a.RefPembagianBerkas.Uraian
                    a.RefStatusId,
                    RefStatus = a.RefStatus.Uraian
                })
                .Where(a => a.RefStatusId == status)
                .ToListAsync()
                );
        }

        //~ get detail permohonan yang sudah divalidasi
        //~ need filter and role validation
        // GET: api/permohonan/PemeriksaanAwal/5
        [Route("PemeriksaanAwal/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPemeriksaanAwal([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int status = 121; //~ permohonan sudah divalidasi

            //~ return only selected fields
            var pemohon = await _context.Permohonan
                .Select(a => new
                {
                    a.PermohonanId,
                    a.NoPendaftaran,
                    a.RefJenisPermohonanId,
                    RefJenisPermohonan = a.RefJenisPermohonan.Uraian,
                    a.NoSuratPermohonan,
                    a.TglTerimaPermohonan,
                    a.RefJenisPemeriksaanId,
                    RefJenisPemeriksaan = a.RefJenisPemeriksaan.Uraian,
                    a.RefPembagianBerkasId,
                    //a.RefPembagianBerkas.Uraian
                    //~
                    a.NoObjekSengketa,
                    a.TglObjekSengketa,
                    //~a.TglTerimaObjekSengketa //??? tanggal terima objek sengketa
                    a.NoSkp,
                    a.TglSkp,
                    a.RefJenisPajakId,
                    RefJenisPajak = a.RefJenisPajak.Uraian,
                    a.RefStatusId,
                    RefStatus = a.RefStatus.Uraian,
                })
                .SingleOrDefaultAsync(a => a.PermohonanId == id && a.RefStatusId == status);

            if (pemohon == null)
            {
                return NotFound();
            }

            return Ok(pemohon);
        }

        //get Daftar Berkas Banding dan Gugatan
        [Route("DaftarBandingGugatan")]
        [HttpGet]
        public async Task<IActionResult> GetDaftarBandingGugatan()
        {
            var AllBandingGugatan = await (from a in _context.Permohonan
                                           join b in _context.RefJenisPermohonan
                                           on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                           join c in _context.Pemohon
                                           on a.PemohonId equals c.PemohonId
                                           join d in _context.RefJenisPemeriksaan
                                           on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                           join e in _context.RefJenisPajak
                                           on a.RefJenisPajakId equals e.RefJenisPajakId
                                           select new
                                           {
                                               a.PermohonanId,
                                               a.RefJenisPermohonanId,
                                               RefJenisPermohonanUr = b.Uraian,
                                               a.PemohonId,
                                               a.PegawaiId,
                                               PemohonName = c.Nama,
                                               a.NoSuratPermohonan,
                                               TglSuratPermohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                               TglTerimaPermohonan = a.TglTerimaPermohonan.HasValue ? a.TglTerimaPermohonan.Value.ToShortDateString() : null,
                                               a.NoSengketa,
                                               a.NoPendaftaran,
                                               a.RefJenisPemeriksaanId,
                                               RefJenisPemeriksaanUr = d.Uraian,
                                               a.NoTandaTerimaSubSt,
                                               a.NoSuratPermintaanSubSt,
                                               a.Npwp,
                                               Jenis_pajak = e.Uraian,
                                               Tahun_pajak = a.MasaPajakAwalTahun,
                                               a.RefPembagianBerkasId,
                                               AlamatPemohon = c.Alamat
                                           }).ToListAsync();
            return Ok(AllBandingGugatan);
        }

        //Export selected data to excel file Daftar Banding dan Gugatan
        [Route("DaftarBandingGugatan/DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDaftarCetakBG([FromBody] string[] ids)
        {
            var daftarBG = await (from a in _context.Permohonan
                                  join b in _context.RefJenisPermohonan
                                  on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                  join c in _context.Pemohon
                                  on a.PemohonId equals c.PemohonId
                                  join d in _context.RefJenisPemeriksaan
                                  on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                  where ids.Contains(a.PermohonanId)
                                  select new
                                  {
                                      Jenis_Permohonan = b.Uraian,
                                      No_Surat_permohonan = a.NoSuratPermohonan,
                                      Tanggal_Permohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                      Tanggal_Terima = a.TglTerimaPermohonan.HasValue ? a.TglTerimaPermohonan.Value.ToShortDateString() : null,
                                      Pemohon = c.Nama,
                                      a.NoSengketa,
                                      Jenis_pemeriksaan = d.Uraian,
                                      No_Tanda_Terima = a.NoTandaTerimaSubSt,
                                      No_Permintaan_Sutst = a.NoSuratPermintaanSubSt
                                  }).ToListAsync();
            return Ok(daftarBG);
        }

        //Export selected data to excel file Data Cover Berkas
        [Route("DataCoverBerkas/DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDataCoverCetak([FromBody] string[] ids)
        {
            var dataCover = await (from a in _context.Permohonan
                                   join b in _context.RefJenisPermohonan
                                   on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                   join c in _context.Pemohon
                                   on a.PemohonId equals c.PemohonId
                                   join d in _context.RefJenisPemeriksaan
                                   on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                   join e in _context.RefJenisPajak
                                   on a.RefJenisPajakId equals e.RefJenisPajakId
                                   where ids.Contains(a.PermohonanId)
                                   select new
                                   {
                                       Jenis_Permohonan = b.Uraian,
                                       No_Surat_permohonan = a.NoSuratPermohonan,
                                       Tanggal_Permohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                       Tanggal_Terima = a.TglTerimaPermohonan.HasValue ? a.TglTerimaPermohonan.Value.ToShortDateString() : null,
                                       Pemohon = c.Nama,
                                       No_Sengketa = a.NoSengketa,
                                       Jenis_pemeriksaan = d.Uraian,
                                       No_Tanda_Terima = a.NoTandaTerimaSubSt,
                                       No_Permintaan_Sutst = a.NoSuratPermintaanSubSt,
                                       a.Npwp,
                                       Jenis_pajak = e.Uraian,
                                       Tahun_pajak = a.MasaPajakAwalTahun,
                                       a.RefPembagianBerkasId,
                                       Alamat_Pemohon = c.Alamat
                                   }).ToListAsync();
            return Ok(dataCover);
        }

        //Export selected data to excel file Daftar Berkas Siap Sidang
        [Route("/api/distribusi/DaftarSiapSidang/DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDataSiapSidang([FromBody] string[] ids)
        {
            var refNormaWaktu = _context.RefNormaWaktu.Where(w => w.RefJenisNormaWaktuId.Equals(9)).Select(w => new { w.RefJenisPermohonanId, w.Bulan, w.Hari }).ToList();

            var tglSiapSidangBanding = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Bulan).First());

            var tglSiapSidangGugatan = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Bulan).First());

            var berkasSiapSidang = await _context.Permohonan
                .Where(p =>
                    (
                        p.RefJenisPemeriksaanId.Equals(1) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(1) && DateTime.Compare(p.TglTerimaPermohonan.Value, tglSiapSidangBanding) <= 0) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(2) && DateTime.Compare(p.TglTerimaPermohonan.Value, tglSiapSidangGugatan) <= 0) ||
                        p.TglTerimaBantahan.HasValue
                    )
                    && String.IsNullOrEmpty(p.TglDistribusiBerkas.ToString())
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

                    }
                )
                .ToListAsync();

            return Ok(berkasSiapSidang);
        }


        //get Daftar Tanda Terima Bg dan Permintaan SUB/Tanggapan
        [Route("/Api/KodeTermohon")]
        [HttpGet]
        public async Task<IActionResult> GetDaftarKodeTermohon()
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;

            var daftarTermohon = await _context.RefKodeTermohon
            .Select(p => new
            {
                p.OrganisasiId,
                p.KodeOrganisasi,
                p.UraianOrganisasi,
                p.UraianLengkapOrganisasi,
                p.KodeSatker,
                p.Alamat,
                p.KodeSurat
            }).ToListAsync();
            return Ok(daftarTermohon);
        }

        [Route("CetakPermohonan/{id}")]
        [HttpGet]
        public async Task<IActionResult> CetakBuktiPermohonan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Permohonan permohonan = _context.Permohonan.Find(id);
            Pemohon pemohon = _context.Pemohon.Find(permohonan.PemohonId);

            if (permohonan == null)
            {
                return NotFound();
            }

            //documentService = new DocumentService(substPath + "detail_subst.docx");
            documentService = new DocumentService("wwwroot/assets/Template/BPE.docx");

            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"Nama", pemohon.Nama },
                {"Npwp", pemohon.Npwp },
                {"NoPendaftaran", permohonan.NoPendaftaran },
                {"NoPermohonan", permohonan.NoSuratPermohonan },
                {"TglPermohonan", permohonan.TglSuratPermohonan.Value.ToString("dd-MM-yyyy") },
                {"TglPendaftaran", permohonan.CreatedDate.ToString("dd-MM-yyyy") },
            };

            documentService.Data = new DataField()
            {
                Data = DataPermohonan
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa + permohonan.NoSuratPermohonan + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

        [Route("Uploads/{id}")]
        [HttpPut]
        public async Task<IActionResult> PutUploadKelengkapan([FromRoute] string id, [FromForm] Permohonan permohonan)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }

            Permohonan varPermohonan = _context.Permohonan.Find(id);

            var Dir = "wwwroot/test_upload";
            var Ext = ".pdf, .docx";

            if(permohonan._FilePdfSuratPermohonan != null)
            {
                varPermohonan.FilePdfSuratPermohonan = await Util.UploadFile(permohonan._FilePdfSuratPermohonan, Dir, 20, Ext);
            }
            if (permohonan._FileDocSuratPermohonan != null)
            {
                varPermohonan.FileDocSuratPermohonan = await Util.UploadFile(permohonan._FileDocSuratPermohonan, Dir, 20, Ext);
            }
            if (permohonan._FilePdfObjekSengketa != null)
            {
                varPermohonan.FilePdfObjekSengketa = await Util.UploadFile(permohonan._FilePdfObjekSengketa, Dir, 20, Ext);
            }
            if (permohonan._FilePdfBuktiBayar != null)
            {
                varPermohonan.FilePdfBuktiBayar = await Util.UploadFile(permohonan._FilePdfBuktiBayar, Dir, 20, Ext);
            }
            if (permohonan._FilePdfSkk != null)
            {
                varPermohonan.FilePdfSkk = await Util.UploadFile(permohonan._FilePdfSkk, Dir, 20, Ext);
            }
            if (permohonan._FilePdfSkp != null)
            {
                varPermohonan.FilePdfSkp = await Util.UploadFile(permohonan._FilePdfSkp, Dir, 20, Ext);
            }

            varPermohonan.AktaPerusahaan = permohonan.AktaPerusahaan;

            _context.Entry(varPermohonan).State = EntityState.Modified;

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

        [Route("UploadKelengkapan")]
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadKelengkapan(string param)
        {
            string fullFileName = null;
            string permohonanId = param.Split("/")[0];
            string jenisBerkas = param.Split("/")[1];
            Permohonan permohonan = _context.Permohonan.Find(permohonanId);
            DateTime tahunmasuk = permohonan.TglTerimaPermohonan.Value;
            string tahunmasuk2 = tahunmasuk.Year.ToString();
            string pemohonid = permohonan.PemohonId;
            
            try
            {
                var file = Request.Form.Files[0];
                string folderName = permohonanId;
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string currentYear = tahunmasuk2;
                    try
                    {

                        string locationfoldertahun = FtpServer() + currentYear;
                        WebRequest requesttahun = WebRequest.Create(locationfoldertahun);

                        requesttahun.Method = "MKD";
                        requesttahun.Method = WebRequestMethods.Ftp.MakeDirectory;
                        requesttahun.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        FtpWebResponse responsetahun = (FtpWebResponse)requesttahun.GetResponse();
                        Stream ftpStreamtahun = responsetahun.GetResponseStream();

                        ftpStreamtahun.Close();
                        responsetahun.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                    try
                    {

                        string locationfoldertahun = FtpServer() + currentYear + '/' + pemohonid;
                        WebRequest requesttahun = WebRequest.Create(locationfoldertahun);

                        requesttahun.Method = "MKD";
                        requesttahun.Method = WebRequestMethods.Ftp.MakeDirectory;
                        requesttahun.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        FtpWebResponse responsetahun = (FtpWebResponse)requesttahun.GetResponse();
                        Stream ftpStreamtahun = responsetahun.GetResponseStream();

                        ftpStreamtahun.Close();
                        responsetahun.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }


                    try
                    {
                        string locationfolder = FtpServer() + currentYear + '/' + pemohonid + '/' + permohonanId;
                        WebRequest request = WebRequest.Create(locationfolder);
                        request.Method = "MKD";
                        request.Method = WebRequestMethods.Ftp.MakeDirectory;
                        request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                        Stream ftpStream = response.GetResponseStream();

                        ftpStream.Close();
                        response.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                    try
                    {
                        string locationfolder = FtpServer() + currentYear + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas;
                        WebRequest request = WebRequest.Create(locationfolder);
                        request.Method = "MKD";
                        request.Method = WebRequestMethods.Ftp.MakeDirectory;
                        request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                        Stream ftpStream = response.GetResponseStream();

                        ftpStream.Close();
                        response.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                    try
                    {
                        string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string ext = fileName.Substring(fileName.LastIndexOf('.'));
                        string fileNameGuid = Guid.NewGuid().ToString();
                        fullFileName = fileNameGuid + ext;

                        string location = FtpServer() + currentYear + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas + '/' + fullFileName;
                        WebRequest ftpRequest = WebRequest.Create(location);
                        ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;
                        ftpRequest.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        Stream requestStream = ftpRequest.GetRequestStream();
                        file.CopyTo(requestStream);

                        string fullPath = Path.Combine(newPath, fullFileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {

                            file.CopyTo(stream);
                        }

                        requestStream.Close();

                        if (jenisBerkas == "PdfSuratPermohonan")
                        {
                            permohonan.FilePdfSuratPermohonan = fullFileName;
                            _context.Entry(permohonan).Property("FilePdfSuratPermohonan").IsModified = true;

                        }
                        else if (jenisBerkas == "DocSuratPermohonan")
                        {
                            permohonan.FileDocSuratPermohonan = fullFileName;
                            _context.Entry(permohonan).Property("FileDocSuratPermohonan").IsModified = true;

                        }
                        else if (jenisBerkas == "SalinanObjekSengketa")
                        {
                            permohonan.FilePdfObjekSengketa = fullFileName;
                            _context.Entry(permohonan).Property("FilePdfObjekSengketa").IsModified = true;

                        }
                        else if (jenisBerkas == "SalinanBuktiBayar")
                        {
                            permohonan.FilePdfBuktiBayar = fullFileName;
                            _context.Entry(permohonan).Property("FilePdfBuktiBayar").IsModified = true;

                        }
                        else if (jenisBerkas == "SuratKuasaKhusus")
                        {
                            permohonan.FilePdfSkk = fullFileName;
                            _context.Entry(permohonan).Property("FilePdfSkk").IsModified = true;

                        }
                        else if (jenisBerkas == "SalinanBuktiBayar")
                        {
                            permohonan.FilePdfSkp = fullFileName;
                            _context.Entry(permohonan).Property("FilePdfSkp").IsModified = true;

                        }

                        _context.Entry(permohonan).State = EntityState.Modified;

                        _context.SaveChanges();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        return Json("Upload Failed");
                    }

                }
                return Json("Upload Success");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Ok("Upload Failed: " + e.Message);
            }
        }
        //private FileContentResult convertToPdf(string webRoot, string tempFolder, string returnFileName)
        //{
        //    Application word = new Application();

        //    // C# doesn't have optional arguments so we'll need a dummy value
        //    object oMissing = System.Reflection.Missing.Value;

        //    // Get list of Word files in specified directory
        //    DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder));
        //    FileInfo[] wordFiles = dirInfo.GetFiles("*.docx");

        //    word.Visible = false;
        //    word.ScreenUpdating = false;
        //    try
        //    {
        //        foreach (FileInfo wordFile in wordFiles)
        //        {
        //            // Cast as Object for word Open method
        //            Object filename = (Object)wordFile.FullName;

        //            // Use the dummy value as a placeholder for optional arguments
        //            Document doc = word.Documents.Open(ref filename, ref oMissing,
        //                ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //                ref oMissing, ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //                ref oMissing, ref oMissing, ref oMissing, ref oMissing);
        //            doc.Activate();

        //            object outputFileName = wordFile.FullName.Replace(".docx", ".pdf");
        //            object fileFormat = WdSaveFormat.wdFormatPDF;

        //            // Save document into PDF Format
        //            doc.SaveAs(ref outputFileName,
        //                ref fileFormat, ref oMissing, ref oMissing,
        //                ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //                ref oMissing, ref oMissing, ref oMissing, ref oMissing,
        //                ref oMissing, ref oMissing, ref oMissing, ref oMissing);

        //            // Close the Word document, but leave the Word application open.
        //            // doc has to be cast to type _Document so that it will find the
        //            // correct Close method.                
        //            object saveChanges = WdSaveOptions.wdDoNotSaveChanges;
        //            ((_Document)doc).Close(ref saveChanges, ref oMissing, ref oMissing);
        //            doc = null;
        //        }
        //         ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
        //        word = null;

        //    }
        //    catch
        //    {
        //        ((_Application)word).Quit(ref oMissing, ref oMissing, ref oMissing);
        //        word = null;

        //    }
        //    byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder + "\\TempFile.pdf"));
        //    return File(fileBytes, "application/pdf", returnFileName);
        //}

    }
}