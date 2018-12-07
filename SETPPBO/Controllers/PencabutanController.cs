using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SETPPBO.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
//using System.IO;
//using DocumentFormat.OpenXml.Packaging;
//using System.Text.RegularExpressions;
//using Microsoft.Office.Interop.Word;
using Pusintek.AspNetcore.DocIO;
using SETPPBO.Utility;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Pencabutan")]
    public class PencabutanController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private DocumentService documentService;
        private String substPath;

        public PencabutanController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            substPath = _context.RefConfig.Where(c => c.ConfigKey == "TEMPLATE_PATH").Select(c => c.ConfigValue).FirstOrDefault();
        }

        // GET: api/Pencabutan
        [HttpGet]
        public IEnumerable<Permohonan> GetPencabutan()
        {
            return _context.Permohonan;
        }

        [Route("DaftarPencabutan")]
        [HttpGet]
        public IActionResult GetDaftarPencabutan()
        {
            var daftar = (from p in _context.Permohonan
                          join detail in _context.RefStatus on p.RefStatusId equals detail.RefStatusId into Details
                          from m in Details.DefaultIfEmpty()
                          select new
                          {
                              p.PemohonId,
                              p.NoSengketa,
                              p.NoKep,
                              p.NoPendaftaran,
                              p.Npwp,
                              p.NoSuratPermohonan,
                              p.TglSuratPermohonan,
                              p.TglTerimaPermohonan,
                              p.Pemohon.Nama,
                              p.PermohonanId,
                              p.ValidatorPencabutanId,
                              p.TglValidasiPencabutan,
                              p.NoSuratPencabutan,
                              p.TglSuratPencabutan,
                              p.TglTerimaPencabutan,
                              p.RefCaraKirimPencabutanId,
                              p.FilePencabutan,
                              m.Uraian
                          });

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
                    .Select(p => new
                    {
                        p.NoPendaftaran,
                        p.NoSuratPermohonan,
                        p.TglSuratPermohonan,
                        p.NoObjekSengketa,
                        p.TglObjekSengketa,
                        p.TglTerimaKep,
                        p.NoSkp,
                        p.TglSkp,
                        MasaPajak = (p.MasaPajakAwalBulan.HasValue && p.MasaPajakAkhirTahun.HasValue ? String.Concat(p.MasaPajakAwalBulan, " ", p.MasaPajakAwalTahun, (p.MasaPajakAkhirTahun.HasValue && p.MasaPajakAkhirBulan.HasValue ? String.Concat(" - ", p.MasaPajakAkhirBulan, " ", p.MasaPajakAkhirTahun) : "")) : (p.MasaPajakAkhirTahun.HasValue && p.MasaPajakAkhirBulan.HasValue ? String.Concat(p.MasaPajakAkhirBulan, " ", p.MasaPajakAkhirTahun) : "-")),
                        p.RefJenisPajak.Kode,
                        p.Npwp,
                        p.Pemohon.Nama,
                        p.Pemohon.Kota,
                        p.TglSubSt,
                        p.TglSuratBantahan,
                        p.NoSuratPencabutan,
                        p.TglSuratPencabutan,
                        p.FilePencabutan,
                        p.TglTerimaPencabutan,
                        p.RefCaraKirimPencabutanId
                    }).SingleOrDefaultAsync();
                return Ok(daftar);
            }
            else
            {
                var daftar = await _context.Permohonan.Where(p => p.PermohonanId.Equals(id))
                    .Select(p => new
                    {
                        p.NoPendaftaran,
                        p.NoSuratPermohonan,
                        p.TglSuratPermohonan,
                        p.NoObjekSengketa,
                        p.TglObjekSengketa,
                        p.TglTerimaKep,
                        p.NoSkp,
                        p.TglSkp,
                        MasaPajak = (p.MasaPajakAwalBulan.HasValue && p.MasaPajakAkhirTahun.HasValue ? String.Concat(p.MasaPajakAwalBulan, " ", p.MasaPajakAwalTahun, (p.MasaPajakAkhirTahun.HasValue && p.MasaPajakAkhirBulan.HasValue ? String.Concat(" - ", p.MasaPajakAkhirBulan, " ", p.MasaPajakAkhirTahun) : "")) : (p.MasaPajakAkhirTahun.HasValue && p.MasaPajakAkhirBulan.HasValue ? String.Concat(p.MasaPajakAkhirBulan, " ", p.MasaPajakAkhirTahun) : "-")),
                        p.RefJenisPajak.Kode,
                        p.Npwp,
                        p.Pemohon.Nama,
                        p.Pemohon.Kota,
                        p.TglSubSt,
                        p.TglSuratBantahan,
                        p.FilePencabutan,
                        p.TglTerimaPencabutan,
                        p.RefCaraKirimPencabutanId
                    }).SingleOrDefaultAsync();
                return Ok(daftar);
            }

        }

        // PUT: api/Permohonan/UpdatePencabutan/5
        [Route("UpdatePencabutan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPencabutan([FromRoute] string id, [FromBody] Permohonan permohonan)
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
            perm.NoSuratPencabutan = permohonan.NoSuratPencabutan;
            perm.TglSuratPencabutan = permohonan.TglSuratPencabutan;
            perm.TglTerimaPencabutan = permohonan.TglTerimaPencabutan;
            perm.TglKirimPencabutan = permohonan.TglKirimPencabutan;
            perm.RefCaraKirimPencabutanId = permohonan.RefCaraKirimPencabutanId;
            perm.FilePencabutan = permohonan.FilePencabutan;
            perm.PerekamPencabutanId = PegawaiID;
            perm.ValidatorPencabutanId = PegawaiID;
            perm.TglValidasiPencabutan = DateTime.Now;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;
            perm.RefStatusId = 611;

            _context.Entry(perm).Property("NoSuratPencabutan").IsModified = true;
            _context.Entry(perm).Property("TglSuratPencabutan").IsModified = true;
            _context.Entry(perm).Property("TglTerimaPencabutan").IsModified = true;
            _context.Entry(perm).Property("TglKirimPencabutan").IsModified = true;
            _context.Entry(perm).Property("RefCaraKirimPencabutanId").IsModified = true;
            _context.Entry(perm).Property("FilePencabutan").IsModified = true;
            _context.Entry(perm).Property("PerekamPencabutanId").IsModified = true; 
            _context.Entry(perm).Property("ValidatorPencabutanId").IsModified = true;
            _context.Entry(perm).Property("TglValidasiPencabutan").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            //_context.Entry(perm).State = EntityState.Modified;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

                if (!PencabutanExists(id))
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

        // PUT: api/Permohonan/UpdatePencabutan/5
        [Route("DeletePencabutan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> DeletePencabutan([FromRoute] string id)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            Permohonan perm = new Permohonan();
            perm.PermohonanId = id;
            _context.Permohonan.Attach(perm);
            perm.NoSuratPencabutan = null;
            perm.TglSuratPencabutan = null;
            perm.TglTerimaPencabutan = null;
            perm.TglKirimPencabutan = null;
            perm.RefCaraKirimPencabutanId = null;
            perm.FilePencabutan = null;
            perm.PerekamPencabutanId = PegawaiID;
            perm.ValidatorPencabutanId = PegawaiID;
            perm.TglValidasiPencabutan = DateTime.Now;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("NoSuratPencabutan").IsModified = true;
            _context.Entry(perm).Property("TglSuratPencabutan").IsModified = true;
            _context.Entry(perm).Property("TglTerimaPencabutan").IsModified = true;
            _context.Entry(perm).Property("TglKirimPencabutan").IsModified = true;
            _context.Entry(perm).Property("RefCaraKirimPencabutanId").IsModified = true;
            _context.Entry(perm).Property("FilePencabutan").IsModified = true;
            _context.Entry(perm).Property("PerekamPencabutanId").IsModified = true;
            _context.Entry(perm).Property("ValidatorPencabutanId").IsModified = true;
            _context.Entry(perm).Property("TglValidasiPencabutan").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            //_context.Entry(perm).State = EntityState.Modified;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

                if (!PencabutanExists(id))
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


        [Route("DaftarPencabutanForValidasi")]
        public async Task<IActionResult> GetDaftarPencabutanForValidasi()
        {

            var daftar = await _context.Permohonan.Where(p => p.NoSuratPencabutan != null && p.TglValidasiPencabutan == null)
            .Select(p => new {
                p.NoSengketa,
                p.NoSuratPermohonan,
                p.TglSuratPermohonan,
                p.TglTerimaPermohonan,
                p.Pemohon.Nama,
                p.PermohonanId,
                p.NoSuratPencabutan,
                p.TglSuratPencabutan,
                p.ValidatorPencabutanId,
                p.TglValidasiPencabutan,
                p.FilePencabutan,
                p.RefStatus.Uraian
            }).ToListAsync();
            return Ok(daftar);
        }

        //[Route("CetakTandaTerimaPencabutan/{id}")]
        //[HttpGet]
        //public async Task<IActionResult> CetakTandaTerimaPencabutan([FromRoute] string id)
        //{

        //    var permohonan = await _context.Permohonan
        //        .Where(a => a.PermohonanId == id)
        //        .Select(a => new
        //        {
        //            a.PermohonanId,
        //            a.NoSengketa,
        //            a.Npwp,
        //            a.Pemohon.Nama,
        //            a.NoSuratPermohonan,
        //            a.TglSuratPermohonan,
        //            a.NoSuratPencabutan,
        //            a.TglSuratPencabutan,
        //            a.FilePencabutan,
        //            a.TglTerimaPencabutan
        //        }).FirstOrDefaultAsync();
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var templateURL = "assets\\Template\\TandaTerimaPencabutan.docx";
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
        //            string varNoSuratBanding = permohonan.NoSuratPermohonan;
        //            string varTglSuratBanding = DateTime.Parse(permohonan.TglSuratPermohonan.ToString()).ToString("dd-MM-yyyy");
        //            string varNoSuratPencabutan = permohonan.NoSuratPencabutan;
        //            string varTglSuratPencabutan = DateTime.Parse(permohonan.TglSuratPencabutan.ToString()).ToString("dd-MM-yyyy");
        //            string varFilePencabutan = permohonan.FilePencabutan;
        //            string varTglTandaTerima = DateTime.Now.ToString("dd-MM-yyyy");

        //            string docText = null;

        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            Regex regexNama = new Regex("{Nama}");
        //            Regex regexNPWP = new Regex("{NPWP}");
        //            Regex regexNoSengketa = new Regex("{NoSengketa}");
        //            Regex regexNoSuratPermohonan = new Regex("{NoSuratPermohonan}");
        //            Regex regexTglSuratPermohonan = new Regex("{TglSuratPermohonan}");
        //            Regex regexNoSuratPencabutan = new Regex("{NoSuratPencabutan}");
        //            Regex regexTglSuratPencabutan = new Regex("{TglSuratPencabutan}");
        //            Regex regexFilePencabutan = new Regex("{FilePencabutan}");
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
        //            docText = regexNoSuratPermohonan.Replace(docText, varNoSuratBanding);
        //            docText = regexTglSuratPermohonan.Replace(docText, varTglSuratBanding);
        //            docText = regexNoSuratPencabutan.Replace(docText, varNoSuratPencabutan);
        //            docText = regexTglSuratPencabutan.Replace(docText, varTglSuratPencabutan);
        //            docText = regexFilePencabutan.Replace(docText, varFilePencabutan);
        //            docText = regexTglTandaTerima.Replace(docText, varTglTandaTerima);

        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);
        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\TempTandaTerimaPencabutan\\TempFile.docx")).Close();

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
        //    DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\TempTandaTerimaPencabutan"));
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
        //    byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\TempTandaTerimaPencabutan\\TempFile.pdf"));
        //    return File(fileBytes, "application/pdf", "TandaTerimaPencabutan.pdf");
        //}

        // GET: api/Pencabutan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPencabutan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var Pencabutan = await _context.Permohonan.SingleOrDefaultAsync(m => m.PermohonanId == id);

            if (Pencabutan == null)
            {
                return NotFound();
            }

            return Ok(Pencabutan);
        }

        // PUT: api/Pencabutan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAllColumnPencabutan([FromRoute] string id, [FromBody] Permohonan Pencabutan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Pencabutan.PermohonanId)
            {
                return BadRequest();
            }

            _context.Entry(Pencabutan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PencabutanExists(id))
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

        // POST: api/Pencabutan
        [HttpPost]
        public async Task<IActionResult> PostPencabutan([FromBody] Permohonan Pencabutan)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // simpan modified by dan date
            var claim = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name);
            var userId = claim.Value;
            Pencabutan.CreatedBy = Int32.Parse(userId);
            Pencabutan.CreatedDate = DateTime.Now;
            _context.Permohonan.Add(Pencabutan);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPencabutan", new { id = Pencabutan.PermohonanId }, Pencabutan);
        }

        // DELETE: api/Pencabutan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePencabutan2([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var Pencabutan = await _context.Permohonan.SingleOrDefaultAsync(m => m.PermohonanId == id);
            if (Pencabutan == null)
            {
                return NotFound();
            }

            _context.Permohonan.Remove(Pencabutan);
            await _context.SaveChangesAsync();

            return Ok(Pencabutan);
        }

        private bool PencabutanExists(string id)
        {
            return _context.Permohonan.Any(e => e.PermohonanId == id);
        }
        [HttpGet("Detail/{PermohonanId}")]
        public async Task<IActionResult> GetDetailPencabutan([FromRoute] string permohonanId)
        {
            var permohonan = await _context.Permohonan
                .Where(
                    p => p.PermohonanId.Equals(permohonanId)
                )
                .Select(
                    p => new
                    {
                        TahunMasuk = p.TglTerimaPermohonan.Value.Year,
                        p.PemohonId,
                        p.PermohonanId,
                        p.FilePencabutan
                    }
                )
                .FirstOrDefaultAsync();

           
            if (permohonan == null)
            {
                return NotFound();
            }

            return Ok(new { path = string.Concat(permohonan.TahunMasuk, ".", permohonan.PemohonId, ".", permohonan.PermohonanId, ".Pencabutan."), permohonan.FilePencabutan });
        }

        [Route("CetakTandaTerimaPencabutan/{id}")]
        [HttpGet]
        public async Task<IActionResult> CetakTandaTerimaPencabutan([FromRoute] string id)
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
                    a.Npwp,
                    a.Pemohon.Nama,
                    a.NoSuratPermohonan,
                    a.TglSuratPermohonan,
                    a.NoSuratPencabutan,
                    a.TglSuratPencabutan,
                    a.FilePencabutan,
                    a.TglTerimaPencabutan
                }).FirstOrDefaultAsync();


            string filepencabutannull = permohonan.FilePencabutan == null ? "" : permohonan.FilePencabutan;
            if (permohonan == null)
            {
                return NotFound();
            }

            documentService = new DocumentService(substPath + "TandaTerimaPencabutan.docx");

            Dictionary<string, string> DataTambahanList = new Dictionary<string, string>() {
                {"VarNama", permohonan.Nama},
                {"VarNPWP", permohonan.Npwp },
                {"VarNoSengketa", Util.GetFormatNomorSengketa(permohonan.NoSengketa)},
                {"VarNoSuratPermohonan", permohonan.NoSuratPermohonan},
                {"VarTglSuratPermohonan", DateTime.Parse(permohonan.TglSuratPermohonan.ToString()).ToString("dd-MM-yyyy")        },
                {"VarNoSuratPencabutan", permohonan.NoSuratPencabutan},
                {"VarTglSuratPencabutan", DateTime.Parse(permohonan.TglSuratPencabutan.ToString()).ToString("dd-MM-yyyy") },
                {"FilePencabutan",filepencabutannull},
                {"VarTglTandaTerima", DateTime.Parse(permohonan.TglTerimaPencabutan.ToString()).ToString("dd-MM-yyyy") }

            };


            documentService.Data = new DataField()
            {
                Data = DataTambahanList
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa + " Pencabutan " + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

    }
}