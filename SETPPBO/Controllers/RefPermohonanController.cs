using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pusintek.AspNetcore.DocIO;
using SETPPBO.Models;

namespace SETPPBO.Controllers
{

    [Authorize]
  
    [Route("api/RefPermohonan")]
    public class RefPermohonanController : Controller
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

        public RefPermohonanController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

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
                                       ).Where(x=> x.RefStatusId != 100
                                                && x.RefStatusId != 110
                                                && x.RefStatusId != 120
                                                && x.RefStatusId != 121
                                                && x.RefStatusId != 130
                                                && x.RefStatusId != 131).ToListAsync();
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
                               join f in _context.RefStatus
                               on a.RefStatusId equals f.RefStatusId
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
                                   a.MasaPajakAwalBulan,
                                   a.MasaPajakAkhirBulan,
                                   a.MasaPajakAwalTahun,
                                   a.TglTerimaPermohonan,
                                   a.TglKirimPermohonan,
                                   a.RefCaraKirimPermohonanId,
                                   RefCaraKirimPermohonanUr = e.Uraian,
                                   a.Npwp,
                                   a.RefPembagianBerkasId,
                                   a.RefJenisPemeriksaanId,
                                   a.NoSengketa,
                                   FormatNoSengketa = a.NoSengketa.Substring(0, 6) + "/" + a.NoSengketa.Substring(6, 2) + "/" + a.NoSengketa.Substring(8, 4),
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
                                   UrRole = role,
                                   RefStatus = f.Uraian,
                                   a.Checklist1,
                                   a.Checklist2,
                                   a.Checklist3,
                                   a.Checklist4,
                               } ).Where(x => x.RefStatusId != 100
                                                && x.RefStatusId != 110
                                                && x.RefStatusId != 120
                                                && x.RefStatusId != 121
                                                && x.RefStatusId != 130
                                                && x.RefStatusId != 131).ToListAsync();

            result.Data = query.Skip(paging.Offset * paging.Limit).Take(paging.Limit); //for pagination
            result.Count = query.Count(); //total All Data
            return Ok(result);
        }


      
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPermohonan([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            Permohonan perm = new Permohonan();
            perm.PermohonanId = permohonan.PermohonanId;
            _context.Permohonan.Attach(perm);
            perm.PemohonId = permohonan.PemohonId;
            perm.NoSengketa = permohonan.NoSengketa;
            perm.RefJenisPajakId = permohonan.RefJenisPajakId;
            perm.NoKep = permohonan.NoKep;
            perm.TglKep = permohonan.TglKep;
            perm.NoSkp = permohonan.NoSkp;
            perm.TglSkp = permohonan.TglSkp;
            perm.NoSuratPermohonan = permohonan.NoSuratPermohonan;
            perm.TglSuratPermohonan = permohonan.TglSuratPermohonan;
            perm.RefJenisPermohonanId = permohonan.RefJenisPermohonanId;
            perm.RefCaraKirimPermohonanId = permohonan.RefCaraKirimPermohonanId;
            perm.RefStatusId = permohonan.RefStatusId;
            perm.TglTerimaPermohonan = permohonan.TglTerimaPermohonan;
            perm.MasaPajakAwalBulan = permohonan.MasaPajakAwalBulan;
            perm.MasaPajakAkhirBulan = permohonan.MasaPajakAkhirBulan;
            perm.MasaPajakAwalTahun = permohonan.MasaPajakAwalTahun;
            perm.RefPembagianBerkasId = permohonan.RefPembagianBerkasId;
            perm.RefJenisPemeriksaanId = permohonan.RefJenisPemeriksaanId;
            perm.Checklist1 = permohonan.Checklist1;
            perm.Checklist2 = permohonan.Checklist2;
            perm.Checklist3 = permohonan.Checklist3;
            perm.Checklist4 = permohonan.Checklist4;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("PemohonId").IsModified = true;
            _context.Entry(perm).Property("NoSengketa").IsModified = true;
            _context.Entry(perm).Property("RefJenisPajakId").IsModified = true;
            _context.Entry(perm).Property("NoKep").IsModified = true;
            _context.Entry(perm).Property("TglKep").IsModified = true;
            _context.Entry(perm).Property("NoSkp").IsModified = true;
            _context.Entry(perm).Property("TglSkp").IsModified = true;
            _context.Entry(perm).Property("NoSuratPermohonan").IsModified = true;
            _context.Entry(perm).Property("TglSuratPermohonan").IsModified = true;
            _context.Entry(perm).Property("RefJenisPermohonanId").IsModified = true;
            _context.Entry(perm).Property("RefCaraKirimPermohonanId").IsModified = true;
            _context.Entry(perm).Property("TglTerimaPermohonan").IsModified = true;
            _context.Entry(perm).Property("MasaPajakAwalBulan").IsModified = true;
            _context.Entry(perm).Property("MasaPajakAkhirBulan").IsModified = true;
            _context.Entry(perm).Property("MasaPajakAwalTahun").IsModified = true;
            _context.Entry(perm).Property("RefPembagianBerkasId").IsModified = true;
            _context.Entry(perm).Property("RefJenisPemeriksaanId").IsModified = true;
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
            _context.Entry(perm).Property("Checklist1").IsModified = true;
            _context.Entry(perm).Property("Checklist2").IsModified = true;
            _context.Entry(perm).Property("Checklist3").IsModified = true;
            _context.Entry(perm).Property("Checklist4").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;


            await _context.SaveChangesAsync();
         
            

            return NoContent();
        }

    }



}