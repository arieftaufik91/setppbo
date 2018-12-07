using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;
//using DocumentFormat.OpenXml.Packaging;
//using System.Text.RegularExpressions;
using Pusintek.AspNetcore.DocIO;
//using Microsoft.Office.Interop.Word;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using Newtonsoft.Json;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

//~ !!! Bantahan Only, use SELECT

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Bantahan")]
    public class BantahanController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private DocumentService documentService;
        //private String bantahanPath = "wwwroot/assets/Template/";

        public BantahanController(MainDbContext context,IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        private string GetTemplatePath()
        {
            return _context.RefConfig.Where(c => c.ConfigKey == "TEMPLATE_PATH").Select(c => c.ConfigValue).FirstOrDefault();
        }
        // GET: api/Bantahan
        [HttpGet]
        public IEnumerable<Permohonan> GetPermohonan()
        {
            return _context.Permohonan;
        }

        // GET: api/Bantahan/5
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

        // PUT: api/Bantahan/5
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

        // POST: api/Bantahan
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
        
        [Route("DaftarBantahan")]
        public async Task<IActionResult> GetBantahan()
        {
            var includedStatus = new int[3] { 401, 411, 321 };
            var daftarbantahan = await _context.Permohonan
            .Where(a => includedStatus.Contains(a.RefStatusId.Value))
            //.Where (p=> p.RefStatusId == 411 || p.RefStatusId == 321)
            .Select(p => new { 
                NoSengketa =p.NoSengketa,
                PemohonId =p.PemohonId,
                NoPendaftaran=p.NoPendaftaran,
                TahunMasuk = p.TglTerimaPermohonan.Value.Year,
                NoSuratPermohonan =p.NoSuratPermohonan,
                NoSubSt =p.NoSubSt,
                TglSubSt =p.TglSubSt,
                NoSuratBantahan =p.NoSuratBantahan,
                TglSuratBantahan =p.TglSuratBantahan,
                ValidatorBantahanId =p.ValidatorBantahanId,
                TglValidasiBantahan =p.TglValidasiBantahan,
                PermohonanId =p.PermohonanId,
                TglKirimBantahan =p.TglKirimBantahan,
                FilePdfBantahan =p.FilePdfBantahan,
                FileDocBantahan =p.FileDocBantahan,
                UraianCaraKirimBantahan =p.RefCaraKirimBantahan.Uraian,
                RefCaraKirimBantahanId =p.RefCaraKirimBantahanId,
                TglTerimaAbgBantahan =p.TglTerimaAbgBantahan,
                TglTerimaBantahan =p.TglTerimaBantahan}).ToListAsync();
            return Ok(daftarbantahan);
        }
        // DELETE: api/Bantahan/5
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

        [Route("Validasi/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutValidasi([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            p.TglValidasiBantahan = DateTime.Now;
            p.RefStatusId = 411;

            _context.Entry(p).Property("TglValidasiBantahan").IsModified = true;
            _context.Entry(p).Property("RefStatusId").IsModified = true;

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

        [Route("DaftarBantahanValidasi")]
        public async Task<IActionResult> GetDaftarBantahanValidasi()
        {
            var daftar = await _context.Permohonan.Where(p=> p.RefStatusId == 401)
            .Select(p => new {
                p.NoSengketa,
                p.NoSuratPermohonan,
                p.NoSubSt,
                p.TglSubSt,
                p.NoSuratBantahan,
                p.TglSuratBantahan,
                p.ValidatorBantahanId,
                p.TglValidasiBantahan,
                p.PermohonanId,
                p.FilePdfBantahan,
                p.FileDocBantahan,
                p.RefCaraKirimBantahanId,
                p.TglTerimaAbgBantahan,
                p.TglTerimaBantahan
            }).ToListAsync();
            return Ok(daftar);
        }
    
        // Get Detail Permohonan: api/Permohonan/DetailPermohonan/5
        [Route("DetailPermohonan/{id}")]
        public async Task<IActionResult> GetDetailPermohonan([FromRoute] string id)
        {

            var role = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role).Value;
            var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;

            if (role.Equals("Administrator"))
            {
                var daftar = await _context.Permohonan.Where(p => p.PermohonanId.Equals(id))
                    .Select(p => new {
                    NoSengketa =p.NoSengketa,
                    PemohonId =p.PemohonId,
                    TahunMasuk = p.TglTerimaPermohonan.Value.Year,
                    NoSuratPermohonan =p.NoSuratPermohonan,
                    NoSubSt =p.NoSubSt,
                    TglSubSt =p.TglSubSt,
                    NoSuratBantahan =p.NoSuratBantahan,
                    TglSuratBantahan =p.TglSuratBantahan,
                    ValidatorBantahanId =p.ValidatorBantahanId,
                    TglValidasiBantahan =p.TglValidasiBantahan,
                    PermohonanId =p.PermohonanId,
                    FilePdfBantahan =p.FilePdfBantahan,
                    FileDocBantahan =p.FileDocBantahan,
                    UraianCaraKirimBantahan =p.RefCaraKirimBantahan.Uraian,
                    RefCaraKirimBantahanId =p.RefCaraKirimBantahanId,
                    TglTerimaAbgBantahan =p.TglTerimaAbgBantahan,
                    TglTerimaBantahan =p.TglTerimaBantahan 
                    }).SingleOrDefaultAsync();
                return Ok(daftar);
            }
            else
            {
                var daftar = await _context.Permohonan.Where(p => p.PermohonanId.Equals(id))
                    .Select(p => new {
                    NoSengketa =p.NoSengketa,
                    PemohonId =p.PemohonId,
                    TahunMasuk = p.TglTerimaPermohonan.Value.Year,
                    NoSuratPermohonan =p.NoSuratPermohonan,
                    NoSubSt =p.NoSubSt,
                    TglSubSt =p.TglSubSt,
                    NoSuratBantahan =p.NoSuratBantahan,
                    TglSuratBantahan =p.TglSuratBantahan,
                    ValidatorBantahanId =p.ValidatorBantahanId,
                    TglValidasiBantahan =p.TglValidasiBantahan,
                    PermohonanId =p.PermohonanId,
                    FilePdfBantahan =p.FilePdfBantahan,
                    FileDocBantahan =p.FileDocBantahan,
                    UraianCaraKirimBantahan =p.RefCaraKirimBantahan.Uraian,
                    RefCaraKirimBantahanId =p.RefCaraKirimBantahanId,
                    TglTerimaAbgBantahan =p.TglTerimaAbgBantahan,
                    TglTerimaBantahan =p.TglTerimaBantahan
                    }).SingleOrDefaultAsync();
                return Ok(daftar);
            }
        }

  // PUT: api/Permohonan/UpdateBantahan/5
        [Route("UpdateBantahan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBantahan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {

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
            perm.NoSuratBantahan = permohonan.NoSuratBantahan;
            perm.TglSuratBantahan = permohonan.TglSuratBantahan;
            perm.TglTerimaBantahan = permohonan.TglTerimaBantahan;
            perm.RefCaraKirimBantahanId = permohonan.RefCaraKirimBantahanId;
            perm.TglTerimaAbgBantahan = permohonan.TglTerimaAbgBantahan;
            perm.FilePdfBantahan = permohonan.FilePdfBantahan;
            perm.FileDocBantahan = permohonan.FileDocBantahan;
            perm.TglKirimBantahan = permohonan.TglKirimBantahan;
            perm.RefStatusId = 411;
            
            //perm.PerekamBantahanId = userID
            //perm.ValidatorBantahanId = userID
            perm.TglValidasiBantahan = DateTime.Now;
            perm.UpdatedDate = DateTime.Now;
            //perm.UpdatedBy = userid;         
            _context.Entry(perm).Property("NoSuratBantahan").IsModified = true;
            _context.Entry(perm).Property("TglSuratBantahan").IsModified = true;
            _context.Entry(perm).Property("TglTerimaBantahan").IsModified = true;
            _context.Entry(perm).Property("RefCaraKirimBantahanId").IsModified = true;
            _context.Entry(perm).Property("TglTerimaAbgBantahan").IsModified = true;
            _context.Entry(perm).Property("FilePdfBantahan").IsModified = true;
            _context.Entry(perm).Property("FileDocBantahan").IsModified = true;
            _context.Entry(perm).Property("TglValidasiBantahan").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;  
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
            _context.Entry(perm).Property("TglKirimBantahan").IsModified = true;
            //_context.Entry(perm).Property("PerekamBantahanId").IsModified = true;
            //_context.Entry(perm).Property("ValidatorBantahanId").IsModified = true;
            //_context.Entry(perm).State = EntityState.Modified;


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

        [Route("DeleteBantahan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> DeleteBantahan([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            p.TglValidasiBantahan = null;
            p.NoSuratBantahan = null;
            p.TglSuratBantahan = null;
            p.TglTerimaBantahan = null;
            p.RefCaraKirimBantahanId = null;
            p.TglKirimBantahan = null;
            p.TglTerimaAbgBantahan = null;
            //p.TglTandaTerimaBantahan = null;
            p.FileDocBantahan = null;
            p.FilePdfBantahan = null;
            p.RefStatusId = 321;

            //_context.Entry(permohonan).Property(x => x.PerekamBantahan).IsModified = true;
            _context.Entry(p).Property("TglValidasiBantahan").IsModified = true;
            _context.Entry(p).Property("NoSuratBantahan").IsModified = true;
            _context.Entry(p).Property("TglSuratBantahan").IsModified = true;
            _context.Entry(p).Property("TglTerimaBantahan").IsModified = true;
            _context.Entry(p).Property("RefCaraKirimBantahanId").IsModified = true;
            //_context.Entry(p).Property("TglTandaTerimaBantahan").IsModified = true;
            _context.Entry(p).Property("TglTerimaAbgBantahan").IsModified = true;
            _context.Entry(p).Property("FilePdfBantahan").IsModified = true;
            _context.Entry(p).Property("FileDocBantahan").IsModified = true;
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

    [HttpGet("CetakTandaTerimaBantahan/{id}")]
        public async Task<IActionResult> PrintBantahan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var permohonan = await _context.Permohonan
                .Where(a => a.PermohonanId == id)
                .Select(a => new
                {
                    a.PermohonanId,
                    a.NoSengketa,
                    a.NoSubSt,
                    a.Npwp,
                    a.Pemohon.Nama,
                    a.NoSuratBantahan,
                    a.TglSuratBantahan,
                    a.FileDocBantahan,
                    a.FilePdfBantahan,
                    a.TglTerimaBantahan
                }).FirstOrDefaultAsync();

            if (permohonan == null)
            {
                return NotFound();
            }

            documentService = new DocumentService(GetTemplatePath() + "TandaTerimaBantahan.docx");
            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"Nama", permohonan.Nama },
                {"Npwp", permohonan.Npwp },
                {"NoSengketa", permohonan.NoSengketa },
                {"NoSubSt", permohonan.NoSubSt },
                {"NoSuratBantahan", permohonan.NoSuratBantahan },
                {"TglSuratBantahan", DateTime.Parse(permohonan.TglSuratBantahan.ToString()).ToString("dd-MM-yyyy")},
                {"TglTandaTerima", DateTime.Now.ToString("dd-MM-yyyy") },
                {"FileDocBantahan", !string.IsNullOrEmpty(permohonan.FileDocBantahan) ? permohonan.FileDocBantahan : ""},
                {"FilePdfBantahan", !string.IsNullOrEmpty(permohonan.FilePdfBantahan) ? permohonan.FilePdfBantahan : ""},
            };


            documentService.Data = new DataField() {
                Data = DataPermohonan
            };

           
            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa+permohonan.NoSuratBantahan+DateTime.Now.ToString("yyyyMMddHHmmss")+".pdf");
        }
        

        //[Route("CetakTandaTerimaBantahan/{id}")]
        //[HttpGet]
        //public async Task<IActionResult> Cetak([FromRoute] string id)
        //{

        //    var permohonan = await _context.Permohonan
        //        .Where(a => a.PermohonanId == id)
        //        .Select(a => new
        //        {
        //            a.PermohonanId,
        //            a.NoSengketa,
        //            a.NoSubSt,
        //            a.Npwp,
        //            a.Pemohon.Nama,
        //            a.NoSuratBantahan,
        //            a.TglSuratBantahan,
        //            a.FileDocBantahan,
        //            a.FilePdfBantahan
        //        }).FirstOrDefaultAsync();
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var templateURL = "assets\\Template\\TandaTerimaBantahan.docx";
        //    var tempFolder = "TempTandaTerimaBantahan";
        //    byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, templateURL));
            
        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            //string varNama = permohonan.Pemohon.Nama;
        //            string varNama = permohonan.Nama;
        //            string varNPWP = permohonan.Npwp;
        //            string varNoSengketa = permohonan.NoSengketa;
        //            string varNoSubSt = permohonan.NoSubSt;
        //            string varTglSuratBantahan = DateTime.Parse(permohonan.TglSuratBantahan.ToString()).ToString("dd-MM-yyyy");
        //            string varNoSuratBantahan = permohonan.NoSuratBantahan;
        //            string varFilePdfBantahan = permohonan.FilePdfBantahan;
        //            string varFileDocBantahan = permohonan.FileDocBantahan;
        //            string varTglTandaTerima = DateTime.Now.ToString("dd-MM-yyyy");

        //            string docText = null;

        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            Regex regexNama = new Regex("{Nama}");
        //            Regex regexNPWP = new Regex("{NPWP}");
        //            Regex regexNoSengketa = new Regex("{NoSengketa}");
        //            Regex regexNoSubSt = new Regex("{NoSubSt}");
        //            Regex regexTglSuratBantahan = new Regex("{TglSuratBantahan}");
        //            Regex regexNoSuratBantahan = new Regex("{NoSuratBantahan}");
        //            Regex regexFilePdfBantahan = new Regex("{FilePdfBantahan}");
        //            Regex regexFileDocBantahan = new Regex("{FileDocBantahan}");
        //            Regex regexTglTandaTerima = new Regex("{TglTandaTerima}");

        //            docText = regexNama.Replace(docText, varNama);
        //            docText = regexNPWP.Replace(docText, varNPWP);
        //            if (varNoSengketa == null)
        //            {
        //                docText = regexNoSengketa.Replace(docText, "");
        //            }
        //            else
        //            {
        //                docText = regexNoSengketa.Replace(docText, varNoSengketa);
        //            }
        //            docText = regexNoSubSt.Replace(docText, varNoSubSt);
        //            docText = regexTglSuratBantahan.Replace(docText, varTglSuratBantahan);
        //            docText = regexNoSuratBantahan.Replace(docText, varNoSuratBantahan);
        //            docText = regexFilePdfBantahan.Replace(docText, varFilePdfBantahan);
        //            docText = regexFileDocBantahan.Replace(docText, varFileDocBantahan);
        //            docText = regexTglTandaTerima.Replace(docText, varTglTandaTerima);

        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);
        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\TempTandaTerimaBantahan\\TempFile.docx")).Close();

        //            //PdfMetamorphosis p = new PdfMetamorphosis();
        //            //string docxPath = System.IO.Path.Combine(webRoot, "assets\\Template\\pdf1.docx");
        //            //string pdfPath = System.IO.Path.Combine(webRoot, "assets\\Template\\data.pdf");

        //            //p.DocxToPdfConvertFile(docxPath, pdfPath);
        //        }
        //    }
        //    Application word = new Application();

        //    // C# doesn't have optional arguments so we'll need a dummy value
        //    object oMissing = System.Reflection.Missing.Value;

        //    // Get list of Word files in specified directory
        //    DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\TempTandaTerimaBantahan"));
        //    FileInfo[] wordFiles = dirInfo.GetFiles("*.doc");

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
        //    byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\TempTandaTerimaBantahan\\TempFile.pdf"));
        //    return File(fileBytes, "application/pdf", "TandaTerimaBantahan.pdf");
    
        //    return null;
        //}        

        // PUT: api/Permohonan/KirimBantahan/5
        [Route("kirimbantahan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKirimBantahan([FromRoute] string id, [FromBody] Permohonan permohonan)
        {

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
           
            perm.TglKirimBantahan = DateTime.Now;

       
            // perm.UpdatedDate = DateTime.Now;
            //perm.UpdatedBy = userid;

      
            _context.Entry(perm).Property("TglKirimBantahan").IsModified = true; //

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

    }
    
}