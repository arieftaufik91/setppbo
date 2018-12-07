using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using System.IO;
//using DocumentFormat.OpenXml.Packaging;
//using System.Text.RegularExpressions;
using Pusintek.AspNetcore.DocIO;
using Microsoft.AspNetCore.Authorization;

//~ !!! SUB/ST Only, use SELECT

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/SubSt")]
    public class SubStController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly MainDbContext _context;
        private DocumentService documentService;

        public SubStController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
        }

        private string GetTemplatePath()
        {
            return _context.RefConfig.Where(c => c.ConfigKey == "TEMPLATE_PATH").Select(c => c.ConfigValue).FirstOrDefault();
        }

        // GET: api/SubSt
        [HttpGet]
        public async Task<IActionResult> GetSubSt()
        {

            var includedStatus = new int[4] { 203, 210, 211, 311 };
            var AllSubSt = await _context.Permohonan
                         .Where(a => includedStatus.Contains(a.RefStatusId.Value))
                         .Join(
                            _context.RefKodeTermohon,
                            a => a.NamaTermohon,
                            t => t.UraianJabatan,
                            (a,t) => new
                            {
                                PermohonanId = a.PermohonanId,
                                RefJenisPermohonanId = a.RefJenisPermohonanId,
                                TextRefJenisPermohonanUr = a.RefJenisPermohonan.Uraian,
                                PemohonId = a.PemohonId,
                                TextPemohonName = a.Pemohon.Nama,
                                NoSuratPermohonan = a.NoSuratPermohonan,
                                TglSuratPermohonan = a.TglSuratPermohonan,
                                NoSubSt = a.NoSubSt,
                                PegawaiId = a.PegawaiId,
                                NoSengketa = a.NoSengketa,
                                TglSubSt = a.TglSubSt,
                                TglTerimaSubSt = a.TglTerimaSubSt,
                                TextRefCaraKirimSubStUr = a.RefCaraKirimSubSt.Uraian,
                                RefCaraKirimSubStId = a.RefCaraKirimSubStId,
                                TglKirimSubSt = a.TglKirimSubSt,
                                NamaTermohon = a.NamaTermohon,
                                OrganisasiId = t.OrganisasiId,
                                NamaUpTermohon = a.NamaUpTermohon,
                                AlamatTermohon = a.AlamatTermohon,
                                KotaTermohon = a.KotaTermohon,
                                PerekamSubStId = a.PerekamSubStId,
                                NamaPengirimSubSt = a.NamaPengirimSubSt,
                                AlamatPengirimSubSt = a.AlamatPengirimSubSt,
                                KotaPengirimSubSt = a.KotaPengirimSubSt,
                                KodePosPengirimSubSt = a.KodePosPengirimSubSt,
                                TglTerimaAbgSubSt = a.TglTerimaAbgSubSt,
                                TglTandaTerimaSubSt = a.TglTandaTerimaSubSt,
                                FilePdfSubSt = a.FilePdfSubSt,
                                FileDocSubSt = a.FileDocSubSt,
                                TahunMasuk = a.TglTerimaPermohonan.Value.Year,
                                RefStatusId = a.RefStatusId
                            }
                         )
                         .ToListAsync();

            return Ok(AllSubSt);

        }

        [HttpGet("PengirimSubst/{OrganisasiIndukId}")]
        public async Task<IActionResult> GetPengirimSubst([FromRoute] int OrganisasiIndukId)
        {
            var pengirimSubst = await _context.RefKodeTermohon
                .Where(t => 
                    t.IndukOrganisasiId.Equals(OrganisasiIndukId)
                )
                .Select(t => new {
                    t.UraianOrganisasi,
                    t.Alamat,
                    t.Kota,
                    t.KodePos
                }).ToListAsync();

            return Ok(pengirimSubst);
        }

        // GET: api/SubSt
        [HttpGet("DaftarValidasi")]
        public async Task<IActionResult> DaftarValidasiSubSt()
        {
            var AllSubSt = await _context.Permohonan
                         .Where(a => a.RefStatusId.Value == 203)
                         .Join(
                            _context.RefKodeTermohon,
                            a => a.NamaTermohon,
                            t => t.UraianJabatan,
                            (a, t) => new
                            {
                                PermohonanId = a.PermohonanId,
                                RefJenisPermohonanId = a.RefJenisPermohonanId,
                                TextRefJenisPermohonanUr = a.RefJenisPermohonan.Uraian,
                                PemohonId = a.PemohonId,
                                TextPemohonName = a.Pemohon.Nama,
                                NoSuratPermohonan = a.NoSuratPermohonan,
                                TglSuratPermohonan = a.TglSuratPermohonan,
                                NoSubSt = a.NoSubSt,
                                PegawaiId = a.PegawaiId,
                                NoSengketa = a.NoSengketa,
                                TglSubSt = a.TglSubSt,
                                TglTerimaSubSt = a.TglTerimaSubSt,
                                TextRefCaraKirimSubStUr = a.RefCaraKirimSubSt.Uraian,
                                RefCaraKirimSubStId = a.RefCaraKirimSubStId,
                                TglKirimSubSt = a.TglKirimSubSt,
                                NamaTermohon = a.NamaTermohon,
                                OrganisasiId = t.OrganisasiId,
                                NamaUpTermohon = a.NamaUpTermohon,
                                AlamatTermohon = a.AlamatTermohon,
                                KotaTermohon = a.KotaTermohon,
                                PerekamSubStId = a.PerekamSubStId,
                                NamaPengirimSubSt = a.NamaPengirimSubSt,
                                AlamatPengirimSubSt = a.AlamatPengirimSubSt,
                                KotaPengirimSubSt = a.KotaPengirimSubSt,
                                KodePosPengirimSubSt = a.KodePosPengirimSubSt,
                                TglTerimaAbgSubSt = a.TglTerimaAbgSubSt,
                                TglTandaTerimaSubSt = a.TglTandaTerimaSubSt,
                                FilePdfSubSt = a.FilePdfSubSt,
                                FileDocSubSt = a.FileDocSubSt,
                                TahunMasuk = a.TglTerimaPermohonan.Value.Year,
                                RefStatusId = a.RefStatusId,
                                Status = "Belum Divalidasi"
                            }
                         )
                         .ToListAsync();

            return Ok(AllSubSt);

        }

        // GET: api/SubSt/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubSt([FromRoute] string id)
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

        [HttpGet("CetakTandaTerimaSubSt/{id}")]
        public async Task<IActionResult> PrintSubSt([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var permohonan = await _context.Permohonan.Include(p => p.RefCaraKirimSubSt).SingleOrDefaultAsync(m => m.PermohonanId == id);

            if (permohonan == null)
            {
                return NotFound();
            }

            //documentService = new DocumentService(substPath + "detail_subst.docx");
            documentService = new DocumentService(GetTemplatePath() + "TandaTerimaSub.docx");

            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"Nama", permohonan.NamaTermohon },
                {"NoSengketa", permohonan.NoSengketa },
                {"NoSuratPermohonan", permohonan.NoSuratPermohonan },
                {"NomorSubSt", permohonan.NoSubSt },
                {"TglSubSt", permohonan.TglSubSt.Value.ToString("dd-MM-yyyy") },
                {"FilePdfSubSt", !string.IsNullOrEmpty(permohonan.FilePdfSubSt) ? permohonan.FilePdfSubSt : "" },
                {"FileDocSubSt", !string.IsNullOrEmpty(permohonan.FileDocSubSt) ? permohonan.FileDocSubSt : "" },
                {"TglTandaTerima", permohonan.TglTerimaSubSt.Value.ToString("dd-MM-yyyy") },
            };

            documentService.Data = new DataField() {
                Data = DataPermohonan
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa+permohonan.NoSubSt+DateTime.Now.ToString("yyyyMMddHHmmss")+".pdf");
        }


        [Route("AddSubSt/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> AddSubSt([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            int PegawaiID = Convert.ToInt32(GetUser().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }

            Permohonan p = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(p);

            p.TglValidasiSubSt = DateTime.Now;
            p.ValidatorSubStId = PegawaiID;
            p.NoSubSt = permohonan.NoSubSt;
            p.TglSubSt = permohonan.TglSubSt;
            p.TglTerimaSubSt = permohonan.TglTerimaSubSt;
            p.RefCaraKirimSubStId = permohonan.RefCaraKirimSubStId;
            p.TglKirimSubSt = permohonan.TglKirimSubSt;
            p.NamaPengirimSubSt = permohonan.NamaPengirimSubSt;
            p.AlamatPengirimSubSt = permohonan.AlamatPengirimSubSt;
            p.KotaPengirimSubSt = permohonan.KotaPengirimSubSt;
            p.KodePosPengirimSubSt = permohonan.KodePosPengirimSubSt;
            p.TglTerimaAbgSubSt = permohonan.TglTerimaAbgSubSt;
            p.TglTandaTerimaSubSt = DateTime.Now;
            p.FileDocSubSt = permohonan.FileDocSubSt;
            p.FilePdfSubSt = permohonan.FilePdfSubSt;
            p.RefStatusId = 211;
            p.UpdatedBy = PegawaiID;
            p.UpdatedDate = DateTime.Now;

            //_context.Entry(permohonan).Property(x => x.PerekamSubStId).IsModified = true;
            _context.Entry(p).Property("TglValidasiSubSt").IsModified = true;
            _context.Entry(p).Property("ValidatorSubStId").IsModified = true;
            _context.Entry(p).Property("NoSubSt").IsModified = true;
            _context.Entry(p).Property("TglSubSt").IsModified = true;
            _context.Entry(p).Property("TglTerimaSubSt").IsModified = true;
            _context.Entry(p).Property("RefCaraKirimSubStId").IsModified = true;
            _context.Entry(p).Property("TglKirimSubSt").IsModified = true;
            _context.Entry(p).Property("NamaPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("AlamatPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("KotaPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("KodePosPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("TglTandaTerimaSubSt").IsModified = true;
            _context.Entry(p).Property("TglTerimaAbgSubSt").IsModified = true;
            _context.Entry(p).Property("FilePdfSubSt").IsModified = true;
            _context.Entry(p).Property("FileDocSubSt").IsModified = true;
            _context.Entry(p).Property("RefStatusId").IsModified = true;
            _context.Entry(p).Property("UpdatedBy").IsModified = true;
            _context.Entry(p).Property("UpdatedDate").IsModified = true;
            //_context.Entry(p).State = EntityState.Modified;

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

        [Route("DeleteSubst/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> DeleteSubst([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }

            Permohonan p = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(p);

            p.TglValidasiSubSt = null;
            p.NoSubSt = null;
            p.TglSubSt = null;
            p.TglTerimaSubSt = null;
            p.RefCaraKirimSubStId = null;
            p.TglKirimSubSt = null;
            p.NamaPengirimSubSt = null;
            p.AlamatPengirimSubSt = null;
            p.KotaPengirimSubSt = null;
            p.KodePosPengirimSubSt = null;
            p.TglTerimaAbgSubSt = null;
            p.TglTandaTerimaSubSt = null;
            p.FileDocSubSt = null;
            p.FilePdfSubSt = null;
            p.RefStatusId = 311;

            //_context.Entry(permohonan).Property(x => x.PerekamSubStId).IsModified = true;
            _context.Entry(p).Property("TglValidasiSubSt").IsModified = true;
            _context.Entry(p).Property("NoSubSt").IsModified = true;
            _context.Entry(p).Property("TglSubSt").IsModified = true;
            _context.Entry(p).Property("TglTerimaSubSt").IsModified = true;
            _context.Entry(p).Property("RefCaraKirimSubStId").IsModified = true;
            _context.Entry(p).Property("NamaPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("AlamatPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("KotaPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("KodePosPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("TglTandaTerimaSubSt").IsModified = true;
            _context.Entry(p).Property("TglTerimaAbgSubSt").IsModified = true;
            _context.Entry(p).Property("FilePdfSubSt").IsModified = true;
            _context.Entry(p).Property("FileDocSubSt").IsModified = true;
            _context.Entry(p).Property("RefStatusId").IsModified = true;
            //_context.Entry(p).State = EntityState.Modified;

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

        [Route("UpdateSubSt/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubSt([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            int PegawaiID = Convert.ToInt32(GetUser().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }

            Permohonan p = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(p);

            //p.TglValidasiSubSt = DateTime.Now;
            p.NoSubSt = permohonan.NoSubSt;
            p.TglSubSt = permohonan.TglSubSt;
            p.TglTerimaSubSt = permohonan.TglTerimaSubSt;
            p.RefCaraKirimSubStId = permohonan.RefCaraKirimSubStId;
            p.TglKirimSubSt = permohonan.TglKirimSubSt;
            p.NamaPengirimSubSt = permohonan.NamaPengirimSubSt;
            p.AlamatPengirimSubSt = permohonan.AlamatPengirimSubSt;
            p.KotaPengirimSubSt = permohonan.KotaPengirimSubSt;
            p.KodePosPengirimSubSt = permohonan.KodePosPengirimSubSt;
            p.TglTerimaAbgSubSt = permohonan.TglTerimaAbgSubSt;
            p.TglTandaTerimaSubSt = DateTime.Now;
            if (!string.IsNullOrEmpty(permohonan.FileDocSubSt)) p.FileDocSubSt = permohonan.FileDocSubSt;
            if (!string.IsNullOrEmpty(permohonan.FilePdfSubSt)) p.FilePdfSubSt = permohonan.FilePdfSubSt;
            if (permohonan.RefStatusId == 210) p.RefStatusId = 211;
            p.UpdatedBy = PegawaiID;
            p.UpdatedDate = DateTime.Now;

            //_context.Entry(permohonan).Property(x => x.PerekamSubStId).IsModified = true;
            //_context.Entry(p).Property("TglValidasiSubSt").IsModified = true;
            _context.Entry(p).Property("NoSubSt").IsModified = true;
            _context.Entry(p).Property("TglSubSt").IsModified = true;
            _context.Entry(p).Property("TglTerimaSubSt").IsModified = true;
            _context.Entry(p).Property("RefCaraKirimSubStId").IsModified = true;
            _context.Entry(p).Property("NamaPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("AlamatPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("KotaPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("KodePosPengirimSubSt").IsModified = true;
            _context.Entry(p).Property("TglTandaTerimaSubSt").IsModified = true;
            _context.Entry(p).Property("TglTerimaAbgSubSt").IsModified = true;
            _context.Entry(p).Property("FilePdfSubSt").IsModified = true;
            _context.Entry(p).Property("FileDocSubSt").IsModified = true;
            if (permohonan.RefStatusId == 210) _context.Entry(p).Property("RefStatusId").IsModified = true;
            _context.Entry(p).Property("UpdatedBy").IsModified = true;
            _context.Entry(p).Property("UpdatedDate").IsModified = true;
            //_context.Entry(p).State = EntityState.Modified;

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

        [Route("Validasi/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutValidasi([FromRoute] string id, [FromBody] Permohonan permohonan)
        {
            int PegawaiID = Convert.ToInt32(GetUser().Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != permohonan.PermohonanId)
            {
                return BadRequest();
            }

            Permohonan p = new Permohonan
            {
                PermohonanId = permohonan.PermohonanId
            };
            _context.Permohonan.Attach(p);

            p.ValidatorSubStId = PegawaiID;
            p.TglValidasiSubSt = DateTime.Now;
            p.RefStatusId = 210;
            p.UpdatedBy = PegawaiID;
            p.UpdatedDate = DateTime.Now;

            _context.Entry(p).Property("TglValidasiSubSt").IsModified = true;
            _context.Entry(p).Property("RefStatusId").IsModified = true;
            _context.Entry(p).Property("UpdatedBy").IsModified = true;
            _context.Entry(p).Property("UpdatedDate").IsModified = true;

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

        private ClaimsPrincipal GetUser()
        {
            return User;
        }

        private bool PermohonanExists(string id)
        {
            return _context.Permohonan.Any(e => e.PermohonanId == id);
        }

    }
}


