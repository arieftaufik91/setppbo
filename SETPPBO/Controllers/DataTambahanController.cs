using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
//using Microsoft.Office.Interop.Word;
using System.Net;
using Pusintek.AspNetcore.DocIO;
using SETPPBO.Utility;
using System.Security.Claims;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using System.Dynamic;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/DataTambahan")]
    public class DataTambahanController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private DocumentService documentService;
        private String substPath = "wwwroot/assets/template/";
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
        public DataTambahanController(IHostingEnvironment hostingEnvironment,MainDbContext context, IHostingEnvironment env)
        {
            _hostingEnvironment = hostingEnvironment;
            _env = env;
            _context = context;
        }

        // GET: api/DataTambahan
        [HttpGet]


        public IEnumerable<DataTambahan> GetDataTambahan()
        {
            return _context.DataTambahan;
        }

        // GET: api/DataTambahan/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDataTambahan([FromRoute] string id)
        {
            var dataTambahan = await _context.SuratPengantar.Where(x => x.PermohonanId == id)
                                     .ToListAsync();


            if (dataTambahan == null)
            {
                return NotFound();
            }

            return Ok(dataTambahan);
        }

        // GET: api/DataTambahan/5
        [HttpGet("Detail/{suratPengantarId}")]
        public async Task<IActionResult> GetDetailDataTambahan([FromRoute] string suratPengantarId)
        {
            var permohonan = await _context.Permohonan
                .Where(
                    p => p.PermohonanId.Equals(_context.SuratPengantar.FirstOrDefault(s => s.SuratPengantarId.Equals(suratPengantarId)).PermohonanId)
                )
                .Select(
                    p => new
                    {
                        TahunMasuk = p.TglTerimaPermohonan.Value.Year,
                        p.PemohonId,
                        p.PermohonanId,
                    }
                )
                .FirstOrDefaultAsync();

            var dataTambahan = await _context.DataTambahan
                .Where(d => d.SuratPengantarId.Equals(suratPengantarId))
                .Select(
                    d => new
                    {
                        d.Uraian,
                        d.FileId,
                        d.Keterangan,
                        CreatedDate = d.CreatedDate.Value.ToShortDateString()
                    }
                )
                .ToListAsync();

            if (dataTambahan == null)
            {
                return NotFound();
            }

            return Ok(new { path = string.Concat(permohonan.TahunMasuk, ".", permohonan.PemohonId, ".", permohonan.PermohonanId, ".Data%20Tambahan."), dataTambahan });
        }

      
        // POST: api/DataTambahan
        [HttpPost]
        public async Task<IActionResult> PostDataTambahan([FromBody] DataTambahanEntry dataTambahanEntry)
        {
            string suratpengantar;
            DateTime now = DateTime.Now;
            SuratPengantar suratPengantar = new SuratPengantar();
            System.Guid suratPengantarId = System.Guid.NewGuid();
            suratPengantar.SuratPengantarId = suratPengantarId.ToString();
            suratpengantar = suratPengantarId.ToString();
            suratPengantar.PermohonanId = dataTambahanEntry.PermohonanId;
            suratPengantar.NoSuratPengantar = dataTambahanEntry.NoSuratPengantar;
            suratPengantar.RefCaraKirimId = dataTambahanEntry.RefCaraKirimID;
            suratPengantar.TglKirim = dataTambahanEntry.TglKirim;
            suratPengantar.TglSuratPengantar = dataTambahanEntry.TglSuratPengantar;
            suratPengantar.TglTerima = dataTambahanEntry.TglTerima;
           
            _context.SuratPengantar.Add(suratPengantar);
            await _context.SaveChangesAsync();
            for (var i = 0; i < dataTambahanEntry.FileId.Length; i++)
            {
                if(dataTambahanEntry.Uraian[i].ToString() == "Failed")
                {

                }
                else
                {
                    DataTambahan dataTambahan = new DataTambahan();
                    System.Guid dataTambahanID = System.Guid.NewGuid();
                    dataTambahan.DataTambahanId = dataTambahanID.ToString();
                    dataTambahan.PermohonanId = dataTambahanEntry.PermohonanId;
                    dataTambahan.SuratPengantarId = suratPengantarId.ToString();
                    string uraian = dataTambahanEntry.Uraian[i].ToString();
                    string fileid = dataTambahanEntry.FileId[i].ToString();
                    string fileid2 = fileid.Substring(fileid.LastIndexOf('\\') + 1);
                    dataTambahan.Uraian = uraian;
                    dataTambahan.FileId = fileid2;
                    dataTambahan.Valid = true;
                    dataTambahan.TglValidasi = now;
                    dataTambahan.Keterangan = dataTambahanEntry.Keterangan[i].ToString();
                    _context.DataTambahan.Add(dataTambahan);
                    await _context.SaveChangesAsync();
                }
            }
            return Ok(suratpengantar);
        }

        // DELETE: api/DataTambahan/5
        [HttpDelete("{id}")]
        public IActionResult DeleteDataTambahan([FromRoute] string id)
        {
            string permohonanId = _context.SuratPengantar.Where(d => d.SuratPengantarId == id).Select(x=> x.PermohonanId).SingleOrDefault().ToString();
            string pemohonid = _context.Permohonan.Where(d => d.PermohonanId == permohonanId).Select(x => x.PemohonId).SingleOrDefault().ToString();
            DateTime currentyeartime = Convert.ToDateTime(_context.SuratPengantar.Where(d => d.SuratPengantarId == id).Select(x => x.TglTerima).SingleOrDefault().ToString());
            string currentyear = currentyeartime.Year.ToString();
            string jenisberkas = "Data Tambahan";
            var filenames = _context.DataTambahan.Where(d => d.SuratPengantarId == id).Select(x => x.FileId).ToList();
            foreach( var filename in filenames)
            {
                try
                {
                    FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + currentyear + '/' + pemohonid + '/' + permohonanId + '/' + jenisberkas + '/' + filename);
                    request.Method = WebRequestMethods.Ftp.DeleteFile;
                    request.Credentials = new NetworkCredential(FtpUser(), FtpPassword());
                    FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                }
                catch
                {
                    
                }
               
            }
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dataTambahan =  _context.DataTambahan.Where(m => m.SuratPengantarId == id).ToList();
            var suratpengantar = _context.SuratPengantar.SingleOrDefault(x => x.SuratPengantarId == id);
            if (dataTambahan == null)
            {
                return NotFound();
            }
            foreach(var data in dataTambahan)
            {
                _context.DataTambahan.Remove(data);
            }
            _context.SuratPengantar.Remove(suratpengantar);

          
            _context.SaveChanges();

            return Ok(dataTambahan);
        }

        private bool DataTambahanExists(string id)
        {
            return _context.DataTambahan.Any(e => e.DataTambahanId == id);
        }

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
                                           a.CreatedDate,
                                           a.NoSengketa
                                       }).ToListAsync();

            result.Data = query.Skip(paging.Offset * paging.Limit).Take(paging.Limit); //for pagination
            result.Count = query.Count(); //total All Data
            return Ok(result);
        }

        [HttpGet]
        [Route("/api/DataTambahan/Permohonan")]
        public async Task<IActionResult> GetPermohonan()
        {
            var AllPermohonan = await (from a in _context.Permohonan
                                       join b in _context.RefJenisPermohonan
                                       on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                       join c in _context.Pemohon
                                       on a.PemohonId equals c.PemohonId
                                       join d in _context.RefJenisPajak
                                       on a.RefJenisPajakId equals d.RefJenisPajakId
                                       join e in _context.RefCaraKirim
                                       on a.RefCaraKirimPermohonanId equals e.RefCaraKirimId
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
                                           a.CreatedDate,
                                           a.NoSengketa
                                       }).ToListAsync();
            return Ok(AllPermohonan);
        }

        private IHostingEnvironment _env;

        public IActionResult Index()
        {
            var webRoot = _env.WebRootPath;
            var file = System.IO.Path.Combine(webRoot, "test.txt");
            System.IO.File.WriteAllText(file, "Hello World!");
            return View();
        }

        [HttpGet("/api/datatambahan/cetak/{id}")]
        //      [Route("/api/datatambahan/cetaktt/{id}")]
        //       [HttpGet("{id}")]
        public async Task<IActionResult> CetakTT(string id)
        {
            var AllPermohonan = await (from a in _context.Permohonan
                                       join b in _context.SuratPengantar
                                       on a.PermohonanId equals b.PermohonanId

                                       select new
                                       {
                                           b.SuratPengantarId,
                                           a.NoSengketa,
                                           a.NoSuratPermohonan,
                                           b.NoSuratPengantar,
                                           b.TglSuratPengantar

                                       }).SingleOrDefaultAsync(m => m.SuratPengantarId == id);
            return Ok(AllPermohonan);
        }


        //[HttpGet("/api/datatambahan/cetaktt/{id}")]
        //public async Task<IActionResult> Cetak(string id)
        //{


        //    var webRoot = _env.WebRootPath;


        //    byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template\\TTDataTambahan.docx"));
        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            var DataTambahan =
        //            (
        //                 from a in _context.SuratPengantar
        //                 join b in _context.Permohonan on a.PermohonanId equals b.PermohonanId
        //                 join c in _context.Pemohon on b.PemohonId equals c.PemohonId
        //                 where a.SuratPengantarId == id
        //                 select new { a, b, c }
        //                  ).FirstOrDefault();
        //            string varNama = DataTambahan.c.Nama;
        //            string varNPWP = DataTambahan.c.Npwp;
        //            string varNoSengketa = DataTambahan.b.NoSengketa.ToString().Substring(0, 6) + "." +
        //                                DataTambahan.b.NoSengketa.ToString().Substring(6, 2) + "/" +
        //                                DataTambahan.b.NoSengketa.ToString().Substring(8, 4) + "/PP";
        //            string varNoSuratBanding = DataTambahan.b.NoSuratPermohonan;
        //            string varTglSuratBanding = DateTime.Parse(DataTambahan.b.TglSuratPermohonan.ToString()).ToString("dd-MM-yyyy");
        //            string varNoSuratDataTambahan = DataTambahan.a.NoSuratPengantar;
        //            string varTglSuratDataTambahan = DateTime.Parse(DataTambahan.a.TglSuratPengantar.ToString()).ToString("dd-MM-yyyy");
        //            string docText = null;
        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            Regex regexNama = new Regex("VarNama");
        //            Regex regexNPWP = new Regex("VarNPWP");
        //            Regex regexNoSengketa = new Regex("VarNoSengketa");
        //            Regex regexNoSuratBanding = new Regex("VarNoSuratBanding");
        //            Regex regexTglSuratBanding = new Regex("VarTglSuratBanding");
        //            Regex regexNoSuratDataTambahan = new Regex("VarNoSuratDataTambahan");
        //            Regex regexTglSuratDataTambahan = new Regex("VarTglSuratDataTambahan");

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
        //            docText = regexNoSuratBanding.Replace(docText, varNoSuratBanding);
        //            docText = regexTglSuratBanding.Replace(docText, varTglSuratBanding);
        //            docText = regexNoSuratDataTambahan.Replace(docText, varNoSuratDataTambahan);
        //            docText = regexTglSuratDataTambahan.Replace(docText, varTglSuratDataTambahan);


        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);

        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\Template1\\pdf4.docx")).Close();

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
        //    DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\Template1"));
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

        //    byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\Template1\\pdf4.pdf"));
        //    return File(fileBytes, "application/pdf", "Tanda Terima Data Tambahan.pdf");




        //}

        //[HttpGet("/api/datatambahan/cetak/{id}")]
        ////      [Route("/api/datatambahan/cetaktt/{id}")]
        ////       [HttpGet("{id}")]
        //public async Task<IActionResult> CetakTT(string id)
        //{
        //    var AllPermohonan = await (from a in _context.Permohonan
        //                               join b in _context.SuratPengantar
        //                               on a.PermohonanId equals b.PermohonanId

        //                               select new
        //                               {
        //                                   b.SuratPengantarId,
        //                                   a.NoSengketa,
        //                                   a.NoSuratPermohonan,
        //                                   b.NoSuratPengantar,
        //                                   b.TglSuratPengantar

        //                               }).SingleOrDefaultAsync(m => m.SuratPengantarId == id);
        //    return Ok(AllPermohonan);
        //}


        [Route("DaftarDataTambahanForValidasi")]
        public async Task<IActionResult> GetDaftarDataTambahanForValidasi()
        {

            var AllPermohonan = await (from a in _context.Permohonan
                                       join b in _context.SuratPengantar
                                       on a.PermohonanId equals b.PermohonanId
                                       join c in _context.Pemohon
                                       on a.PemohonId equals c.PemohonId
                                       join d in _context.DataTambahan
                                       on b.SuratPengantarId equals d.SuratPengantarId
                                       where d.TglValidasi == null
                                       select  new
                                       {
                                           b.SuratPengantarId,
                                           a.NoSengketa,
                                           a.NoSuratPermohonan,
                                           b.NoSuratPengantar,
                                           b.TglSuratPengantar,
                                           b.TglKirim,
                                           b.TglTerima,
                                           TglValidasi = d.TglValidasi.HasValue ? d.TglValidasi.Value.ToString("dd-MM-yyyy") : null,
                                           c.Nama
                                           

                                       }).Distinct().ToListAsync();
            return Ok(AllPermohonan);
        }


        [Route("UpdateDataTambahan/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDataTambahan([FromRoute] string id, [FromBody] DataTambahanEntry dataTambahanEntry)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           
            SuratPengantar sp = new SuratPengantar();
            sp.SuratPengantarId = id;
            _context.SuratPengantar.Attach(sp);
            sp.NoSuratPengantar = dataTambahanEntry.NoSuratPengantar;
            sp.TglSuratPengantar = dataTambahanEntry.TglSuratPengantar;
            sp.TglTerima = dataTambahanEntry.TglTerima;
            sp.TglKirim = dataTambahanEntry.TglKirim;

            _context.Entry(sp).Property("NoSuratPengantar").IsModified = true;
            _context.Entry(sp).Property("TglSuratPengantar").IsModified = true;
            _context.Entry(sp).Property("TglTerima").IsModified = true;
            _context.Entry(sp).Property("TglKirim").IsModified = true;

            var dtlist = _context.DataTambahan.Where(m => m.SuratPengantarId == id).ToList();

            foreach(DataTambahan i in dtlist)
            {
                _context.DataTambahan.Attach(i);
                i.TglValidasi = DateTime.Now;
                i.UpdatedDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }
         
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("/api/datatambahan/cetaktt/{id}")]
        public IActionResult PrintDataTambahan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var DataTambahan =
                   (
                         from a in _context.SuratPengantar
                         join b in _context.Permohonan on a.PermohonanId equals b.PermohonanId
                         join c in _context.Pemohon on b.PemohonId equals c.PemohonId
                         where a.SuratPengantarId == id
                         select new { a, b, c }
                          ).FirstOrDefault();

            if (DataTambahan == null)
            {
                return NotFound();
            }



            documentService = new DocumentService(substPath + "TandaTerimaDataTambahan.docx");

            Dictionary<string, string> DataTambahanList = new Dictionary<string, string>() {
                {"VarNama", DataTambahan.c.Nama },
                {"VarNPWP", DataTambahan.c.Npwp },
                {"VarNoSengketa", Util.GetFormatNomorSengketa(DataTambahan.b.NoSengketa)},
                {"VarNoSuratBanding", DataTambahan.b.NoSuratPermohonan},
                {"VarTglSuratBanding", DateTime.Parse(DataTambahan.b.TglSuratPermohonan.ToString()).ToString("dd-MM-yyyy") },
                {"VarNoSuratDataTambahan", DataTambahan.a.NoSuratPengantar},
                {"VarTglSuratDataTambahan", DateTime.Parse(DataTambahan.a.TglSuratPengantar.ToString()).ToString("dd-MM-yyyy") },
                {"VarTglTandaTerima", DateTime.Parse(DataTambahan.a.TglTerima.ToString()).ToString("dd-MM-yyyy") }

            };


            documentService.Data = new DataField()
            {
                Data = DataTambahanList
            };


            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", DataTambahan.b.NoSengketa + " Data Tambahan " + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

        private ClaimsPrincipal GetUser()
        {
            return User;
        }

        private bool PermohonanExists(string id)
        {
            return _context.Permohonan.Any(e => e.PermohonanId == id);
        }

        [Route("/api/UploadFileDT")]
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile(string param)
        {
            string permohonanId = param.Split("/")[0];
            string jenisBerkas = param.Split("/")[1];
            string FileId = param.Split("/")[2];
            Console.WriteLine(permohonanId);
            Console.WriteLine(jenisBerkas);
            Console.WriteLine(FileId);

            DateTime tahunmasuk = _context.Permohonan.Where(x => x.PermohonanId == permohonanId).Select(x => x.TglTerimaPermohonan).FirstOrDefault().Value;
            string tahunmasuk2 = tahunmasuk.Year.ToString();
            string pemohonid = _context.Permohonan.Where(x => x.PermohonanId == permohonanId).Select(x => x.PemohonId).FirstOrDefault();

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
                        string fileName = FileId;
                        //string ext = fileName.Substring(fileName.LastIndexOf('.'));
                        string location = FtpServer() + currentYear + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas + '/' + fileName;
                        WebRequest ftpRequest = WebRequest.Create(location);
                        ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;
                        ftpRequest.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        Stream requestStream = ftpRequest.GetRequestStream();
                        file.CopyTo(requestStream);

                        string fullPath = Path.Combine(newPath, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {

                            file.CopyTo(stream);
                        }

                        requestStream.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        return Json("Upload Failed");
                    }

                }
                return Json("Upload Success");
            }
            catch (System.Exception ex)
            {
                return Ok("Upload Failed: " + ex.Message);
            }
        
    }

        [Route("GetBaseURL")]
        [HttpGet]
        public async Task<string> GetBaseURL()
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
                var BO_BASEURL = await _context.RefConfig.FirstOrDefaultAsync(a => a.ConfigKey == "FO_BASEURL");
                baseUrl = BO_BASEURL.ConfigValue.ToString();
            }

            //var baseUrl = await _context.RefConfig.Where(r => r.ConfigKey == "BO_BASEURL").FirstOrDefaultAsync().ConfigValue;
            return baseUrl;
        }


    }


}