using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using SETPPBO.Utility;
using Microsoft.AspNetCore.Authorization;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/RefTemplate")]
    public class RefTemplateController : Controller
    {
        private readonly MainDbContext _context;
        private IFileProvider _fileProvider;

        public RefTemplateController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _context = context;
            _fileProvider = hostingEnvironment.ContentRootFileProvider;
        }

        private string GetTemplatePath()
        {
            return _context.RefConfig.Where(c => c.ConfigKey == "TEMPLATE_PATH").Select(c => c.ConfigValue).FirstOrDefault();
        }

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

        // GET: api/RefTemplate
        [HttpGet]
        public IEnumerable<RefTemplate> GetRefTemplate()
        {
            return _context.RefTemplate;
        }

        // GET: api/RefTemplate/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRefTemplate([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await CheckTemplate(id))
            {
                var refTemplate = await _context.RefTemplate.SingleOrDefaultAsync(m => m.RefTemplateId == id);

                if (refTemplate == null)
                {
                    return NotFound();
                }

                return Ok(refTemplate);
            }
            else
            {
                return Json("Failed");
            }


        }

        // PUT: api/RefTemplate/5
        [HttpPut("{id}/{oldFileName}")]
        public async Task<IActionResult> PutRefTemplate([FromRoute] int id, [FromBody] RefTemplate refTemplate, [FromRoute] string oldFileName)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refTemplate.RefTemplateId)
            {
                return BadRequest();
            }
            _context.Entry(refTemplate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                if (oldFileName != refTemplate.FileId)
                {
                    DeleteFile(oldFileName);
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefTemplateExists(id))
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

        // POST: api/RefTemplate
        [HttpPost]
        public async Task<IActionResult> PostRefTemplate([FromBody] RefTemplate refTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RefTemplate.Add(refTemplate);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefTemplateExists(refTemplate.RefTemplateId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRefTemplate", new { id = refTemplate.RefTemplateId }, refTemplate);
        }
        /* NOT USED
        // POST: api/RefTemplate/Upload
        [Route("Upload")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/assets/template", file.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return NoContent();
        }*/

        // DELETE: api/RefTemplate/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefTemplate([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var refTemplate = await _context.RefTemplate.SingleOrDefaultAsync(m => m.RefTemplateId == id);
            if (refTemplate == null)
            {
                return NotFound();
            }

            if (DeleteFile(refTemplate.FileId))
            {
                _context.RefTemplate.Remove(refTemplate);
                await _context.SaveChangesAsync();

                return Ok(refTemplate);
            }

            return NoContent();
        }

        private bool RefTemplateExists(int id)
        {
            return _context.RefTemplate.Any(e => e.RefTemplateId == id);
        }

        private Boolean DeleteFile(string fileName)
        {
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer()+"template/" + fileName);
            request.Method = WebRequestMethods.Ftp.DeleteFile;
            request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

            using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
            {
                if (response.StatusDescription == "250 File deleted successfully")
                {
                    return true;
                }
            }

            return false;
        }

        // return true jika file local dan file server berbeda
        // return false jika nama file dan last modified file antara local dan server sama
        /*public Boolean IsTemplateDifferent(string fileName)
        {
            // cek lastmodified file template local
            var path = Path.Combine("wwwroot/assets/template", fileName);
            Console.WriteLine("FileName di dalam fungsi IsTemplateDifferent: " + fileName);
            // cek file local ada atau sama dengan filename dari db
            var isExist = _fileProvider.GetFileInfo(path).Exists;
            if (isExist)
            {
                DateTimeOffset modifiedDate = _fileProvider.GetFileInfo(path).LastModified;
                // cek lastmodified file template yang ada di ftp pakai file name dari DB
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://10.242.77.90/setpp/template/" + fileName);
                request.Method = WebRequestMethods.Ftp.GetDateTimestamp;
                request.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                FtpWebResponse response = (FtpWebResponse)request.GetResponse();

                if (modifiedDate.UtcDateTime == response.LastModified)
                {
                    return false;
                }
            }

            //return Content(modifiedDate.UtcDateTime + " | "+path+" | " +isExist+" | "+ response.LastModified);
            return true;
        }*/

        // cek file template local dengan server
        [Route("CheckTemplate/{refTemplateId}")]
        [HttpGet("{refTemplateId}")]
        public async Task<Boolean> CheckTemplate([FromRoute] int refTemplateId)
        {
            try
            {
                var isDifferent = true;
                DateTime serverLastModified = new DateTime(1,1,1);
                //Console.WriteLine("refTemplateId dari parameter API CheckTemplate: " + refTemplateId);
                var refTemplate = await _context.RefTemplate.Where(a => a.RefTemplateId == refTemplateId).FirstOrDefaultAsync();
                string fileName = refTemplate.FileId;
                //Console.WriteLine("fileName diambil dari db di dalam API CheckTemplate: " + fileName);

                // cek lastmodified file template local
                var path = Path.Combine(GetTemplatePath(), fileName);
                //Console.WriteLine("Path template local: "+path);
                //Console.WriteLine("FileName di dalam fungsi IsTemplateDifferent: " + fileName);
                // cek file local ada atau sama dengan filename dari db
                var isExist = _fileProvider.GetFileInfo(path).Exists;
                if (isExist)
                {
                    DateTimeOffset modifiedDate = _fileProvider.GetFileInfo(path).LastModified;
                    // cek lastmodified file template yang ada di ftp pakai file name dari DB
                    FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + "template/" + fileName);
                    request.Method = WebRequestMethods.Ftp.GetDateTimestamp;
                    request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                    FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                    serverLastModified = response.LastModified;
                    //Console.WriteLine("Date from response: "+response.LastModified);
                    //Console.WriteLine("Date from local file: UTC= " + modifiedDate.UtcDateTime + " | Non-UTC= " + modifiedDate.DateTime+" | Local= "+modifiedDate.LocalDateTime);
                    if (modifiedDate.LocalDateTime == response.LastModified)
                    {
                        isDifferent = false;
                    }
                }
                
                if (isDifferent)
                {
                    // Get the object used to communicate with the server.  
                    FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + "template/" + fileName);
                    //Console.WriteLine("ftp://10.242.77.90/setpp/template/" + fileName);
                    request.Method = WebRequestMethods.Ftp.DownloadFile;
                    //Console.WriteLine("Masuk ke kondisi IsTemplateDifferent(fileName)");
                    // This example assumes the FTP site uses anonymous logon.
                    request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

                    FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                    Stream responseStream = response.GetResponseStream();

                    //var path = Path.Combine("wwwroot/assets/template", fileName);
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        responseStream.CopyTo(stream);
                    }
                    responseStream.Close();

                    //var localFilePath = Path.Combine("wwwroot/assets/template", fileName);
                    //Console.WriteLine("Date serverLastModified: " + serverLastModified);
                    System.IO.File.SetLastWriteTime(path, serverLastModified);

                }
                // return value jika pengecekan sukses
                //return Json("Success");
                return true;

            }
            catch (Exception ex)
            {
                // return value jika pengecekan gagal
                //Console.WriteLine("Catching: "+ex.Message);
                //Console.WriteLine("Trace: " + ex.StackTrace);
                //return Json("Failed");
                return false;
            }
        }
    }
}