using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using SETPPBO.Models;
using SETPPBO.Utility;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Pemohon")]
    public class PemohonController : Controller
    {
        private readonly MainDbContext _context;
        private IConfiguration Configuration { get; }

        //string baseUrl;

        //~ ftp
        private IHostingEnvironment _hostingEnvironment;
        private readonly IFileProvider _fileProvider;
        private readonly string _webRootPath;

        private ConfigFtp _configFtp;

        private string _ftpAddress;
        private string _ftpUser;
        private string _ftpPassword;
        private NetworkCredential _ftpCredential;

        public PemohonController(MainDbContext context, IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            Configuration = configuration;

            //~ base url is SETPP BO url //??? check again
            //baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            //~ ftp
            _hostingEnvironment = hostingEnvironment;
            _context = context;
            _fileProvider = hostingEnvironment.ContentRootFileProvider;
            _webRootPath = _hostingEnvironment.WebRootPath;
        }

        //~ get all pemohon
        //~ need filter, and only selected fields
        // GET: api/Pemohon
        [HttpGet]
        public async Task<IEnumerable<object>> GetPemohon()
        {
            return await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Nama,
                    a.Npwp,
                    a.Status,
                    a.TglKodeVerifikasi, //~ as verfication flag,
                    a.CreatedBy, //~ as registered user flag,
                    HasKodeVerifikasi = a.KodeVerifikasi != null, //~ if has kode verifikasi, means, already verified by Setpp
                    HasPassword = a.Password != null, //~ if has password, means, already activated by Pemohon,
                    HasNpwpFile = a.NpwpfileId != null, //~ if has npwp file //~ passive should not have any
                    Ereg = a.CreatedBy == null ? "eReg" : "non eReg"//~ show if ereg or non ereg, 20181127
                })
                .ToListAsync();
        }

        //~ get pemohons which need verification, except setpp generated user
        //~ need filter, and only selected fields
        // GET: api/Pemohon/Verification
        [Route("Verification")]
        [HttpGet]
        public async Task<IEnumerable<object>> GetPemohonVerification()
        {
            return await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Nama,
                    a.Npwp,
                    a.Status,
                    a.KodeVerifikasi,
                    a.TglKodeVerifikasi,
                    a.CreatedBy
                })
                .Where(a => a.KodeVerifikasi == null && a.TglKodeVerifikasi == null && a.CreatedBy == null)
                .Select(a => new
                {
                    a.PemohonId,
                    a.Nama,
                    a.Npwp,
                    a.Status
                })
                .ToListAsync();
        }

        // GET: api/Pemohon/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPemohon([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //~ return only selected fields
            var pemohon = await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Nama,
                    a.Npwp,
                    a.ContactPerson,
                    a.Alamat,
                    a.Kota,
                    a.KodePos,
                    a.Email,
                    a.Status,
                    a.TglKodeVerifikasi, //~ as verfication flag,
                    HasNpwpFile = a.NpwpfileId != null //~ if has npwp file //~ passive should not have any
                })
                .SingleOrDefaultAsync(m => m.PemohonId == id);

            if (pemohon == null)
            {
                return NotFound();
            }

            return Ok(pemohon);
        }

        //~ get file npwp pemohon
        // GET: api/Pemohon/npwp/v/5
        [HttpGet("npwp/v/{id}")]
        [RequestSizeLimit(bytes: 52_428_800)]
        //public async Task<HttpResponseMessage> GetPemohonNpwpFile([FromRoute] string id)
        public async Task<ActionResult> GetPemohonNpwpFile([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
                //return null;
            }

            //~ return only selected fields
            var pemohon = await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Npwp,
                    a.NpwpfileId
                })
                .SingleOrDefaultAsync(m => m.PemohonId == id && m.NpwpfileId != null);

            if (pemohon == null)
            {
                return NotFound();
                //return null;
            }

            //~ START - get npwp file from ftp server
            string filename = pemohon.NpwpfileId; // filename
            string filenameExt = GetFileExtension(filename);

            string folderName = "npwp";

            //~ get refconfig
            GetRefConfigFtp();

            //~ check directory, if not then create
            string fullFtpDirPath = Path.Combine(_ftpAddress, folderName); //~ ftp dir location
            string fullFtpFilePath = Path.Combine(fullFtpDirPath, filename); //~ ftp file location


            try
            {
                // Get the object used to communicate with the server.  
                WebRequest ftpRequest = GetFtpRequestDownload(fullFtpFilePath);
                WebResponse ftpResponse = ftpRequest.GetResponse();

                Stream ftpStream = ftpResponse.GetResponseStream();

                return File(ftpStream, "application/octet-stream", pemohon.Npwp + "." + filenameExt);

                //MemoryStream ms = new MemoryStream();

                //await ftpStream.CopyToAsync(ms);
                //ftpStream.Close();
                //ms.Position = 0;

                ////~ get file stream
                //HttpResponseMessage response = new HttpResponseMessage();
                //response.StatusCode = HttpStatusCode.OK;
                //response.Content = new StreamContent(ms);
                //response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                //response.Content.Headers.ContentDisposition.FileName = pemohon.Npwp + "." + filenameExt;
                ////response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                ////return response;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return new NotFoundResult();
                //return null;
            }
            //~ END - get npwp file

            //return Ok(pemohon);
        }

        //~ filter role only helpdesk
        //~ update profile
        // PUT: api/Pemohon/Update/5
        [Route("Update/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            //~ filter npwp input into numbers only
            pemohon.Npwp = Util.GetNumbers(pemohon.Npwp);

            //~ validate npwp
            bool valid = true;
            if (!valid)
            {
                return BadRequest(ModelState);
            }

            //~ email is mandatory
            if (pemohon.Email == null)
            {
                return BadRequest();
            }

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            _context.Entry(pemohon).Property("Nama").IsModified = true;
            _context.Entry(pemohon).Property("ContactPerson").IsModified = true;
            _context.Entry(pemohon).Property("Alamat").IsModified = true;
            _context.Entry(pemohon).Property("RefKotaId").IsModified = true; //~ need to have value
            _context.Entry(pemohon).Property("Kota").IsModified = true;
            _context.Entry(pemohon).Property("KodePos").IsModified = true;
            _context.Entry(pemohon).Property("Email").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PemohonExists(id))
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

        //~ deactivate pemohon status
        //~ ! filter authorization !
        [Route("Deactivate/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeactivatePemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            pemohon.Status = false;

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            _context.Entry(pemohon).Property("Status").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PemohonExists(id))
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

        //~ activate pemohon status
        //~ ! filter authorization !
        [Route("Activate/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivatePemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            pemohon.Status = true;

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            _context.Entry(pemohon).Property("Status").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PemohonExists(id))
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

        //~ register (passive) - created and registered by helpdesk
        // no verification code, password, and status false
        // POST: api/Pemohon
        [HttpPost]
        public async Task<IActionResult> PostPemohon([FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //~ filter npwp input into numbers only
            pemohon.Npwp = Util.GetNumbers(pemohon.Npwp);

            //~ check if verified pemohon exists; cannot register with existing npwp 
            if (PemohonNPWPExists(pemohon.Npwp))
            {
                return BadRequest(ModelState);
            }

            //~ generate pemohonID
            pemohon.PemohonId = Guid.NewGuid().ToString();

            pemohon.Status = false;
            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.CreatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID

            //~ nullified - fail safe measure
            pemohon.Password = null;
            pemohon.KodeVerifikasi = null;
            pemohon.TglKodeVerifikasi = null;

            _context.Pemohon.Add(pemohon);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PemohonExists(pemohon.PemohonId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            //return NoContent();

            return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        }

        //~ REGISTER (datang langsung)
        //~ registered by Helpdesk
        //~ need to upload npwp file
        //~ no need npwp verification
        // generate verification code and email it (?email?)
        // input: register form
        // POST: api/Pemohon
        [Route("Register")]
        [HttpPost]
        [RequestSizeLimit(bytes: 10_485_760)]
        //public async Task<IActionResult> PostRegisterPemohon([FromBody] Pemohon pemohon)
        public async Task<IActionResult> PostRegisterPemohon()
        {
            var reqForm = Request.Form;
            var pemohon = JsonConvert.DeserializeObject<Pemohon>(reqForm["data"]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //~ filter npwp input into numbers only
            pemohon.Npwp = Util.GetNumbers(pemohon.Npwp);

            //~ validate npwp
            bool valid = true;
            if (!valid)
            {
                return BadRequest(ModelState);
            }

            //~ check if verified pemohon exists; cannot register with existing npwp 
            if (PemohonNPWPExists(pemohon.Npwp))
            {
                return BadRequest(ModelState);
            }

            //~ upload npwp file here
            try
            {
                //~ uploaded file
                var fileNpwp = Request.Form.Files[0];
                //~ if file is illegal, then return false
                string fileType = fileNpwp.ContentType;
                //string fileExt = fileNpwp.FileName.Substring(fileNpwp.FileName.LastIndexOf('.') + 1); //~ ext w/o dot
                string fileExt = GetFileExtension(fileNpwp.FileName); //~ ext w/o dot

                //~ check file mime and filename extension
                if (!CheckFile(fileType) || !CheckFileExt(fileExt))
                {
                    throw new FormatException("File format is not acceptable");
                }

                var uploadResult = UploadFileNpwp(fileNpwp);
                pemohon.NpwpfileId = uploadResult ?? throw new AccessViolationException("File cannot be uploaded");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return StatusCode(StatusCodes.Status415UnsupportedMediaType);
            }
            //~ end upload

            //~ generate pemohonID
            pemohon.PemohonId = Guid.NewGuid().ToString();

            pemohon.Status = false;

            //~ nullified - fail safe measure
            pemohon.Password = null;

            //~ generate kode verifikasi - and email - default is verified (registered by helpdesk)
            pemohon.KodeVerifikasi = Guid.NewGuid().ToString().Substring(0, 8);
            pemohon.TglKodeVerifikasi = DateTime.Now;

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.CreatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID //~ MANDATORY

            pemohon.Kota = pemohon.Kota.Trim(); //~ strip clean

            //~ alamat korespondensi = alamat on insert only --- meeting 20181127 - ref sasvia
            pemohon.AlamatKoresponden = pemohon.Alamat;
            pemohon.KodePosKoresponden = pemohon.KodePos;
            pemohon.RefKotaKorespondenId = pemohon.RefKotaId;
            pemohon.KotaKoresponden = pemohon.Kota;

            _context.Pemohon.Add(pemohon);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                Console.WriteLine(e);
                if (PemohonExists(pemohon.PemohonId))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        }

        //~ get file extension from filename (without dot; e.g. filename.jpg --> jpg)
        private string GetFileExtension(string fileName)
        {
            try
            {
                return fileName.Split('.').Last();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
            //fileNpwp.FileName.Substring(fileNpwp.FileName.LastIndexOf('.') + 1); //~ ext w/o dot
        }

        //~ --- --- CHECK FILES START - BLACK/WHITE LIST --- ---

        //~ return true if safe
        // check the uploaded file extension if blacklisted
        private bool CheckFile(string contentType)
        {
            List<string> blackList = new List<string>() {
                "application/octet-stream",
                "application/x-msdos-program",
                "application/x-msi"
            };

            //~ white list npwp
            List<string> whiteList = new List<string>() {
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/bmp",
                "application/pdf"
            };

            return (!blackList.Contains(contentType) && whiteList.Contains(contentType));
        }

        private bool CheckFileExt(string ext)
        {
            //~ white list extenstion
            List<string> whiteListExt = new List<string>() {
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "pdf"
            };

            return (whiteListExt.Contains(ext.ToLower()));
        }
        //~ --- --- CHECK FILES END --- ---

        //~ verification of user online registration
        // generate verification code and email it
        // POST: api/Verify/{id}
        [Route("Verify/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVerifyPemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {

            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            //~ return only selected fields
            var _pemohon = await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Email
                })
                .SingleOrDefaultAsync(m => m.PemohonId == id);

            //~ check email for email notification, 
            if (_pemohon.Email == null)
            {
                return BadRequest();
            }

            //~ validate npwp ? should be done previously on registration process
            bool valid = true;
            if (!valid)
            {
                return BadRequest(ModelState);
            }

            //~ generate kode verifikasi - and email
            pemohon.KodeVerifikasi = Guid.NewGuid().ToString().Substring(0, 8);
            pemohon.TglKodeVerifikasi = DateTime.Now; //~ verification date

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            _context.Entry(pemohon).Property("KodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("TglKodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                if (await _context.SaveChangesAsync() > 0)
                {
                    //~ generate link to be mailed
                    //~ method used for email link

                    //~ verification code generation date, expired after 1 month after
                    DateTime timeLimit = pemohon.TglKodeVerifikasi.Value.AddMonths(1);

                    //~ generate encoded link
                    //~ encrypted key will be validated on AccountController ValidateActivationCode();
                    string encAct = GetEncodedLink("ActivationCode", pemohon.KodeVerifikasi, timeLimit);

                    string baseUrl = await GetBaseUrl();

                    //~ get app location from settings
                    //string appUrl = Configuration["Authentication:KemenkeuID:ClientUrl"] + "/Activate?k=";
                    string appUrl = baseUrl + "/Account/Activate?k=";

                    //~ send EMAIL notification
                    string msgSubject = "Kode Verifikasi SETPP [No Reply]";
                    string msgBody = "Akun Anda telah di verifikasi, dengan kode verifikasi: " +
                        "<br />" +
                        "<strong>" + pemohon.KodeVerifikasi.ToUpper() + "</strong>" +
                        "<br />" +
                        "silahkan mengaktifkan melalui link berikut ini: " +
                        "<a href='" + appUrl + encAct + "'>" + appUrl + encAct + "</a>" +
                        "<br />" +
                        "<br />" +
                        "Batas waktu aktivasi sebelum " +
                        //pemohon.TglKodeVerifikasi.Value.AddMonths(1).ToString("dd/MM/yyyy HH:mm");
                        timeLimit.ToString("dd/MM/yyyy HH:mm");

                    //~ get smtp config
                    ConfigSmtp configSmtp = await GetRefConfigSmtp();

                    //~ send email (return boolean)
                    if (!Util.SendNotification(configSmtp, _pemohon.Email, msgSubject, msgBody))
                    {
                        //~ failed, rollback
                        pemohon.KodeVerifikasi = null;
                        pemohon.TglKodeVerifikasi = null;

                        pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
                        pemohon.UpdatedDate = DateTime.Now;

                        _context.Entry(pemohon).Property("KodeVerifikasi").IsModified = true;
                        _context.Entry(pemohon).Property("TglKodeVerifikasi").IsModified = true;
                        _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
                        _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;

                        await _context.SaveChangesAsync();

                        throw new Exception();
                    }
                }
                else
                {
                    return NotFound();
                }

            }
            catch (DbUpdateConcurrencyException e)
            {
                Console.WriteLine(e);
                if (PemohonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        }

        //~ generate encoded link to email with time limit
        private string GetEncodedLink(string key, string code, DateTime timeLimit, string separator = "::")
        {
            try
            {
                string activeKey = Util.MD5Hash(key); //~ string padded on url
                string link = activeKey + separator + code + separator + timeLimit;
                return Util.Encrypt(link);
            }
            catch (Exception)
            {
                return "";
            }
        }

        //~ generate verification code for pemohon (passive), and mailed
        //~ need to check if pemohon is petugas generated or pemohon registered
        //~ only for petugas generated account
        //~ no need re-verify by petugas
        // POST: api/SVerify/{id}
        [Route("SVerify/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSVerifyPemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            //~ return only selected fields
            var _pemohon = await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Email,
                    a.Status, //~ to check if this is not an active account yet
                    a.CreatedBy //~ to check if this is petugas generated or not
                })
                .SingleOrDefaultAsync(
                    m =>
                    m.PemohonId == id &&
                    m.Status == false &&
                    m.CreatedBy != null
                );

            //~ check email for email notification, NOT NEEDED for petugas generated
            //if (_pemohon.Email == null)
            //{
            //    return BadRequest();
            //}

            //~ check if petugas generated, IF NOT return bad request
            if (_pemohon.CreatedBy == null)
            {
                return BadRequest();
            }

            //~ check if this is not an active account
            if (_pemohon.Status == true)
            {
                return BadRequest();
            }

            //~ validate npwp ? should be done previously on registration process
            //bool valid = true;
            //if (!valid)
            //{
            //    return BadRequest(ModelState);
            //}

            //~ generate kode verifikasi - and generate link
            string kodeVer = Guid.NewGuid().ToString().Substring(0, 8);
            pemohon.KodeVerifikasi = kodeVer;
            pemohon.TglKodeVerifikasi = DateTime.Now; //~ verification date

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            _context.Entry(pemohon).Property("KodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("TglKodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                if (await _context.SaveChangesAsync() > 0)
                {
                    //~ generate link to be mailed
                    //~ method used for email link

                    //string activeKey = Util.MD5Hash("ActCode"); //~ string padded on url
                    //string activeKey = "SAct"; //~ string padded on url
                    //string act = pemohon.KodeVerifikasi + ":" + activeKey;
                    string act = kodeVer;
                    string encAct = Util.Encrypt(act);
                    //~ encrypted key will be validated on AccountController ValidateActivationCode();

                    string baseUrl = await GetBaseUrl();

                    //~ get app location from settings
                    //string appUrl = Configuration["Authentication:KemenkeuID:ClientUrl"] + "/Activate?k=";
                    string appUrl = baseUrl + "/Account/SActivate?k=";

                    //~ send EMAIL notification
                    //string msgSubject = "Kode Verifikasi SETPP [No Reply]";
                    string msgBody = "Akun Anda telah di verifikasi, dengan kode verifikasi: " +
                        "<strong>" + kodeVer.ToUpper() + "</strong>" +
                        "<br />" +
                        "silahkan mengaktifkan melalui link berikut ini: " +
                        //"<a href='" + appUrl + encAct + "'>" + appUrl + encAct + "</a>" +
                        appUrl + encAct +
                        "<br />" +
                        "Batas waktu aktivasi sebelum " +
                        pemohon.TglKodeVerifikasi.Value.AddMonths(1).ToString("dd/MM/yyyy HH:mm");

                    return Ok(msgBody); //~ return the string and link
                }
                else
                {
                    return NotFound();
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                if (PemohonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            //return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        }

        //~ unverify [Revalidate]
        //~ verification of user online registration
        //~ generate verification date, but note verification code
        // POST: api/Verify/{id}
        [Route("Unverify/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnverifyPemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            //~ return only selected fields
            var _pemohon = await _context.Pemohon
                .Select(a => new
                {
                    a.PemohonId,
                    a.Email
                })
                .SingleOrDefaultAsync(m => m.PemohonId == id);

            //~ check email for email notification, 
            if (_pemohon.Email == null)
            {
                return BadRequest();
            }

            //~ validate npwp ? should be done previously on registration process
            bool valid = true;
            if (!valid)
            {
                return BadRequest(ModelState);
            }

            //~ generate kode verifikasi - and email
            string kodeVer = Guid.NewGuid().ToString().Substring(0, 8);
            pemohon.KodeVerifikasi = kodeVer;
            pemohon.TglKodeVerifikasi = DateTime.Now; //~ verification date

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            _context.Entry(pemohon).Property("KodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("TglKodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                if (await _context.SaveChangesAsync() > 0)
                {
                    //~ generate link to be mailed
                    //~ method used for email link

                    //~ verification code generation date, expired after 1 month after
                    DateTime timeLimit = pemohon.TglKodeVerifikasi.Value.AddMonths(1);

                    //~ generate encoded link
                    //~ encrypted key will be validated on AccountController ValidateActivationCode();
                    string encAct = GetEncodedLink("RevalidateCode", kodeVer, timeLimit);

                    string baseUrl = await GetBaseUrl();

                    //~ get app location from settings
                    //string appUrl = Configuration["Authentication:KemenkeuID:ClientUrl"] + "/Activate?k=";
                    string appUrl = baseUrl + "/Account/Revalidate?k=";

                    //~ send EMAIL notification
                    string msgSubject = "Verifikasi SETPP [No Reply]";
                    string msgBody = "Data NPWP pada Akun Anda tidak dapat diverifikasi, " +
                        "silahkan mengirimkan kembali data NPWP Anda melalui link berikut ini:" +
                        "<br />" +
                        "<a href='" + appUrl + encAct + "'>" + appUrl + encAct + "</a>." +
                        "<br />" +
                        "dengan kode verifikasi: " +
                        "<br />" +
                        "<strong>" + kodeVer.ToUpper() + "</strong>" +
                        "<br />" +
                        "<br />" +
                        "Batas waktu sebelum " +
                        timeLimit.ToString("dd/MM/yyyy HH:mm");

                    //~ get pegawai info
                    ConfigSmtp configSmtp = await GetRefConfigSmtp();

                    //~ send email (return boolean)
                    if (!Util.SendNotification(configSmtp, _pemohon.Email, msgSubject, msgBody))
                    {
                        throw null;
                    }
                }
                else
                {
                    return NotFound();
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                if (PemohonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        }

        //~ get base url, if localhost or else
        private async Task<string> GetBaseUrl()
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
                var FO_BASEURL = await _context.RefConfig.FirstOrDefaultAsync(a => a.ConfigKey == "FO_BASEURL");
                baseUrl = FO_BASEURL.ConfigValue.ToString();
            }

            return baseUrl;
        }

        //~ ??? necessary?
        //~ reset user online registration, status=false
        //~ similar to verify
        // generate verification code and email it
        // POST: api/Verify/{id}
        [Route("Reset/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutResetPemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            //~ validate npwp ? should be done previously on registration process
            bool valid = true;
            if (!valid)
            {
                return BadRequest(ModelState);
            }

            //~ generate kode verifikasi - and email
            pemohon.KodeVerifikasi = Guid.NewGuid().ToString().Substring(0, 8);
            pemohon.TglKodeVerifikasi = DateTime.Now; //~ verification date

            var _pemohonId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            pemohon.UpdatedBy = Convert.ToInt32(_pemohonId); //~ user is Helpdesk pegawaiID
            pemohon.UpdatedDate = DateTime.Now;

            //~ reset status to false, to be able to re-activate
            //pemohon.Status = false; //? necessary ? if set to false, user cant login.

            _context.Entry(pemohon).Property("KodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("TglKodeVerifikasi").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedBy").IsModified = true;
            _context.Entry(pemohon).Property("UpdatedDate").IsModified = true;
            //_context.Entry(pemohon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (PemohonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        }

        // POST: api/Pemohon
        //[HttpPost]
        //public async Task<IActionResult> PostPemohon([FromBody] Pemohon pemohon)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.Pemohon.Add(pemohon);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (PemohonExists(pemohon.PemohonId))
        //        {
        //            return new StatusCodeResult(StatusCodes.Status409Conflict);
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetPemohon", new { id = pemohon.PemohonId }, pemohon);
        //}

        //~ only by admin ? removed temporarily
        // DELETE: api/Pemohon/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeletePemohon([FromRoute] string id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var pemohon = await _context.Pemohon.SingleOrDefaultAsync(m => m.PemohonId == id);
        //    if (pemohon == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Pemohon.Remove(pemohon);
        //    await _context.SaveChangesAsync();

        //    return Ok(pemohon);
        //}

        private bool PemohonExists(string id)
        {
            return _context.Pemohon.Any(e => e.PemohonId == id);
        }

        //~ check if npwp exists
        private bool PemohonNPWPExists(string npwp)
        {
            //npwp = Regex.Replace(npwp, "[^0-9]", ""); //~ clean input string
            return _context.Pemohon.Any(e => e.Npwp == npwp);
        }

        //~ get ref config smtp
        private async Task<ConfigSmtp> GetRefConfigSmtp()
        {
            var _conf = _context.RefConfig
            .Where(a => a.Uraian == "SMTP")
            .Select(a => new
            {
                a.ConfigKey,
                a.ConfigValue
            });

            var SenderAddress = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_ADDRESS");
            var SenderName = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_NAME");
            var SenderSecret = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_SECRET");
            var SenderServer = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_SERVER");
            var SenderDomain = await _conf.FirstOrDefaultAsync(a => a.ConfigKey == "SENDER_DOMAIN");

            ConfigSmtp conf = new ConfigSmtp
            {
                SenderAddress = SenderAddress.ConfigValue,
                SenderName = SenderName.ConfigValue,
                SenderSecret = SenderSecret.ConfigValue,
                SenderServer = SenderServer.ConfigValue,
                SenderDomain = SenderDomain.ConfigValue,
            };

            return conf;
        }

        //~ --- --- UPLOAD START --- ---
        private NetworkCredential GetNetworkCredential()
        {
            if (_ftpCredential == null)
            {
                if (_configFtp == null)
                {
                    GetRefConfigFtp();
                }

                //~ ftp credential
                _ftpCredential = new NetworkCredential(_ftpUser, _ftpPassword);
            }

            return _ftpCredential;
        }


        //~ get ref config ftp
        private void GetRefConfigFtp()
        {
            if (_configFtp == null)
            {
                var _conf = _context.RefConfig
                .Where(a => a.Uraian == "FTP" && (
                    a.ConfigKey == "FTP_LOCATION" ||
                    a.ConfigKey == "FTP_USERNAME" ||
                    a.ConfigKey == "FTP_PASSWORD"
                    ))
                .Select(a => new
                {
                    a.ConfigKey,
                    a.ConfigValue
                });

                var FtpLocation = _conf.FirstOrDefault(a => a.ConfigKey == "FTP_LOCATION");
                var FtpUsername = _conf.FirstOrDefault(a => a.ConfigKey == "FTP_USERNAME");
                var FtpPassword = _conf.FirstOrDefault(a => a.ConfigKey == "FTP_PASSWORD");

                ConfigFtp conf = new ConfigFtp
                {
                    FtpLocation = FtpLocation.ConfigValue,
                    FtpUsername = FtpUsername.ConfigValue,
                    FtpPassword = FtpPassword.ConfigValue,
                };

                //~ set value
                _configFtp = conf;

                _ftpAddress = _configFtp.FtpLocation; //~ get from RefConfig
                _ftpUser = _configFtp.FtpUsername;
                _ftpPassword = Util.Decrypt(_configFtp.FtpPassword); //~ decrypted
            }
        }

        //~ internal file upload
        private string UploadFileNpwp(IFormFile fileNpwp)
        {
            string fullFileName = null;
            try
            {
                string folderName = "npwp";

                //string newPath = Path.Combine(_webRootPath, folderName);
                //if (!CheckCreateDir(newPath))
                //{
                //    throw new FileNotFoundException("Failed create directory: newPath");
                //};

                //~ if file exist, then try upload
                if (fileNpwp.Length > 0)
                {
                    //~ get refconfig
                    GetRefConfigFtp();

                    string npwpFolderLocation = Path.Combine(_ftpAddress, folderName); //~ ftp file location
                    try
                    {
                        MakeDir(npwpFolderLocation);
                        //if (!MakeDir(npwpFolderLocation))
                        //{
                        //    throw new FileNotFoundException("Failed create directory: npwp");
                        //};
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        return null;
                    }

                    try
                    {
                        //string _fileName = ContentDispositionHeaderValue.Parse(fileNpwp.ContentDisposition).FileName.Trim('"');
                        string _fileName = fileNpwp.FileName;
                        string fileNameGuid = Guid.NewGuid().ToString();
                        string fileExt = _fileName.Substring(_fileName.LastIndexOf('.'));
                        fullFileName = fileNameGuid + fileExt;

                        string location = _ftpAddress + folderName + '/' + fileNameGuid + fileExt;

                        WebRequest ftpRequest = GetFtpRequestUpload(location);
                        Stream requestStream = ftpRequest.GetRequestStream();
                        fileNpwp.CopyTo(requestStream);

                        requestStream.Close();

                        FtpWebResponse response = (FtpWebResponse)ftpRequest.GetResponse();

                        response.Close();

                        //string fullPath = Path.Combine(npwpFolderLocation, _fileName); //~ ftp file location
                        //string fullPath = Path.Combine(newPath, _fileName);
                        //using (var stream = new FileStream(fullPath, FileMode.Create))
                        //{
                        //fileNpwp.CopyTo(stream);
                        //}

                        //requestStream.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        return null;
                    }
                }
                return fullFileName;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }

        //~ check directory and create if not exist
        private bool CheckCreateDir(string path)
        {
            try
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }

        //~ create ftp directory
        private bool MakeDir(string location)
        {
            try
            {
                WebRequest ftpRequest = GetFtpRequestMakeDir(location);

                FtpWebResponse ftpResponse = (FtpWebResponse)ftpRequest.GetResponse();
                Stream ftpStream = ftpResponse.GetResponseStream();

                ftpStream.Close();
                ftpResponse.Close();

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }

        //~ create ftp request and add credentials
        private WebRequest CreateFtpRequest(string location)
        {
            WebRequest ftpRequest = WebRequest.Create(location);
            ftpRequest.Credentials = GetNetworkCredential(); //~ get credential
            return ftpRequest;
        }

        //~ return ftp request to make directory based on (dir) location parameter
        private WebRequest GetFtpRequestMakeDir(string location)
        {
            WebRequest ftpRequest = CreateFtpRequest(location);
            ftpRequest.Method = WebRequestMethods.Ftp.MakeDirectory;
            return ftpRequest;
        }

        //~ return ftp request to upload file based on (file) location parameter
        private WebRequest GetFtpRequestUpload(string location)
        {
            WebRequest ftpRequest = CreateFtpRequest(location);
            ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;
            return ftpRequest;
        }

        //~ return ftp request to download file based on (file) location parameter
        private WebRequest GetFtpRequestDownload(string location)
        {
            WebRequest ftpRequest = CreateFtpRequest(location);
            ftpRequest.Method = WebRequestMethods.Ftp.DownloadFile;
            return ftpRequest;
        }

        //~ return ftp request to delete file based on (file) location parameter
        private WebRequest GetFtpRequestDelete(string location)
        {
            WebRequest ftpRequest = CreateFtpRequest(location);
            ftpRequest.Method = WebRequestMethods.Ftp.DeleteFile;
            return ftpRequest;
        }

        //~ return ftp (web) request to download file based on (file) location parameter
        private FtpWebRequest GetFtpWebRequestDownload(string location)
        {
            FtpWebRequest ftpRequest = (FtpWebRequest)WebRequest.Create(location);
            ftpRequest.Method = WebRequestMethods.Ftp.DownloadFile;
            ftpRequest.Credentials = GetNetworkCredential(); //~ get credential
            return ftpRequest;
        }

        //[HttpGet("/api/DownloadFile/{filePath}/{fileName}")]
        //[RequestSizeLimit(bytes: 52_428_800)]
        //public ActionResult DownloadFile([FromRoute] string fileName, [FromRoute] string filePath)
        //{
        //    try
        //    {
        //        string path = _ftpAddress + filePath.Replace('.', '/') + fileName;

        //        // Get the object used to communicate with the server.  
        //        //FtpWebRequest ftpRequest = GetFtpRequestDownload(path);
        //        WebRequest ftpRequest = GetFtpRequestDownload(path);
        //        //FtpWebResponse ftpResponse = (FtpWebResponse)ftpRequest.GetResponse();
        //        WebResponse ftpResponse = ftpRequest.GetResponse();
        //        Stream ftpStream = ftpResponse.GetResponseStream();

        //        return File(ftpStream, "application/octet-stream", fileName);
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(e.Message);
        //    }
        //}
    }
}