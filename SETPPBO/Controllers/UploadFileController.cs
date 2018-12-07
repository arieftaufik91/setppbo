using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Web;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Cors;
using System.Net;
using SETPPBO.Models;
using Microsoft.Extensions.FileProviders;
using SETPPBO.Utility;
using Microsoft.AspNetCore.Authorization;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/UploadFile")]
    public class UploadFileController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private readonly IFileProvider _fileProvider;
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
        public UploadFileController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
            _fileProvider = hostingEnvironment.ContentRootFileProvider;
        }

        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile(string param)
        {
            string permohonanId = param.Split("/")[0];
            string jenisBerkas = param.Split("/")[1];
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
                    catch(Exception e)
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
                        string locationfolder = FtpServer() + currentYear + '/' + pemohonid + '/'  + permohonanId;
                        WebRequest request = WebRequest.Create(locationfolder);
                        request.Method = "MKD";
                        request.Method = WebRequestMethods.Ftp.MakeDirectory;
                        request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                        Stream ftpStream = response.GetResponseStream();

                        ftpStream.Close();
                        response.Close();
                    }
                    catch(Exception e) {
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
                    catch (Exception e) {
                        Console.WriteLine(e);
                    }
                    try
                    {
                        string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string ext = fileName.Substring(fileName.LastIndexOf('.'));
                        string location = FtpServer() + currentYear + '/' +pemohonid +'/' + permohonanId + '/' + jenisBerkas + '/' + fileName;
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
                    catch(Exception e) {
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

        private bool CheckFile(string contentType)
        {
            List<string> blackList = new List<string>() {
                "application/octet-stream",
                "application/x-msdos-program",
                "application/x-msi"
            };

            //~ white list npwp
            List<string> whiteList = new List<string>() {
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/pdf"
            };

            return (!blackList.Contains(contentType) && whiteList.Contains(contentType));
        }

        [HttpPost("UploadSubst"), DisableRequestSizeLimit]
        public ActionResult UploadFileSubst(string param)
        {
            string permohonanId = param.Split("/")[0];
            string jenisBerkas = param.Split("/")[1];
            DateTime tahunmasuk = _context.Permohonan.Where(x => x.PermohonanId == permohonanId).Select(x => x.TglTerimaPermohonan).FirstOrDefault().Value;
            string tahunmasuk2 = tahunmasuk.Year.ToString();
            string pemohonid = _context.Permohonan.Where(x => x.PermohonanId == permohonanId).Select(x => x.PemohonId).FirstOrDefault();

            try
            {
                var file = Request.Form.Files[0];

                string fileType = file.ContentType;

                //~ check file mime and filename extension
                if (!CheckFile(fileType))
                {
                    return Ok("Upload Failed: File format is not acceptable");
                }

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
                        //string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string fileName = permohonanId + "." + file.FileName.Split('.').Last().ToString();
                        string ext = fileName.Substring(fileName.LastIndexOf('.'));
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
                        return Json("Upload Failed: " + e.Message);
                    }

                }
                return Json("Upload Success");
            }
            catch (System.Exception ex)
            {
                return Ok("Upload Failed: " + ex.Message);
            }
        }

[HttpPost("UploadBantahan"), DisableRequestSizeLimit]
        public ActionResult UploadFileBantahan(string param)
        {
            string permohonanId = param.Split("/")[0];
            string jenisBerkas = param.Split("/")[1];
            DateTime tahunmasuk = _context.Permohonan.Where(x => x.PermohonanId == permohonanId).Select(x => x.TglTerimaPermohonan).FirstOrDefault().Value;
            string tahunmasuk2 = tahunmasuk.Year.ToString();
            string pemohonid = _context.Permohonan.Where(x => x.PermohonanId == permohonanId).Select(x => x.PemohonId).FirstOrDefault();

            try
            {
                var file = Request.Form.Files[0];

                string fileType = file.ContentType;

                //~ check file mime and filename extension
                if (!CheckFile(fileType))
                {
                    return Ok("Upload Failed: File format is not acceptable");
                }

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
                        //string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string fileName = permohonanId + "." + file.FileName.Split('.').Last().ToString();
                        string ext = fileName.Substring(fileName.LastIndexOf('.'));
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
                        return Json("Upload Failed: " + e.Message);
                    }

                }
                return Json("Upload Success");
            }
            catch (System.Exception ex)
            {
                return Ok("Upload Failed: " + ex.Message);
            }
        }        

        [HttpGet("/api/DownloadFile/{filePath}/{fileName}")]
        [DisableRequestSizeLimit]
        public ActionResult DownloadFile([FromRoute] string fileName, [FromRoute] string filePath)
        {
            try
            {

                // Get the object used to communicate with the server.  
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + filePath.Replace('.', '/') + fileName);
                request.Method = WebRequestMethods.Ftp.DownloadFile;

                // This example assumes the FTP site uses anonymous logon.
                request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                return File(responseStream, "application/octet-stream", fileName);

            } catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(ex.Message);
            }
        }

        [HttpGet("/api/DownloadSubst/{fileExt}/{fileType}/{id}")]
        [DisableRequestSizeLimit]
        public ActionResult DownloadSubst([FromRoute] string id, [FromRoute] string fileType, [FromRoute] string fileExt)
        {
            try
            {

                var permohonan = _context.Permohonan.Where(x => x.PermohonanId == id)
                    .Select(x => new {
                        x.TglTerimaPermohonan,
                        x.PemohonId,
                        x.FileDocSubSt,
                        x.FilePdfSubSt
                    })
                    .FirstOrDefault();

                // Get the object used to communicate with the server.  
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + permohonan.TglTerimaPermohonan.Value.Year + "/" + permohonan.PemohonId + "/" + id + "/" + fileType + "/" + id + "." + (fileExt.Equals("pdf") ? permohonan.FilePdfSubSt.Split(".").Last().ToString() : permohonan.FileDocSubSt.Split(".").Last().ToString()));
                request.Method = WebRequestMethods.Ftp.DownloadFile;

                // This example assumes the FTP site uses anonymous logon.
                request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                return File(responseStream, "application/octet-stream", (fileExt.Equals("pdf") ? permohonan.FilePdfSubSt : permohonan.FileDocSubSt));

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(ex.Message);
            }
        }

        [HttpGet("/api/DownloadBantahan/{fileExt}/{fileType}/{id}")]
        [DisableRequestSizeLimit]
        public ActionResult DownloadBantahan([FromRoute] string id, [FromRoute] string fileType, [FromRoute] string fileExt)
        {
            try
            {

                var permohonan = _context.Permohonan.Where(x => x.PermohonanId == id)
                    .Select(x => new {
                        x.TglTerimaPermohonan,
                        x.PemohonId,
                        x.FileDocBantahan,
                        x.FilePdfBantahan
                    })
                    .FirstOrDefault();

                // Get the object used to communicate with the server.  
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + permohonan.TglTerimaPermohonan.Value.Year + "/" + permohonan.PemohonId + "/" + id + "/" + fileType + "/" + id + "." + (fileExt.Equals("pdf") ? permohonan.FilePdfBantahan.Split(".").Last().ToString() : permohonan.FileDocBantahan.Split(".").Last().ToString()));
                request.Method = WebRequestMethods.Ftp.DownloadFile;

                // This example assumes the FTP site uses anonymous logon.
                request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                return File(responseStream, "application/octet-stream", (fileExt.Equals("pdf") ? permohonan.FilePdfBantahan : permohonan.FileDocBantahan));

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Json(ex.Message);
            }
        }


        [HttpGet("/api/DownloadFileDT/{filePath}/{fileName}")]
        [DisableRequestSizeLimit]
        public ActionResult DownloadFileDT([FromRoute] string fileName, [FromRoute] string filePath)
        {
            try
            {
                var DataTambahan = _context.DataTambahan.Where(x => x.Uraian == fileName).Select(x => x.FileId).FirstOrDefault();
                // Get the object used to communicate with the server.  
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + filePath.Replace('.', '/') + fileName);
                request.Method = WebRequestMethods.Ftp.DownloadFile;

                // This example assumes the FTP site uses anonymous logon.
                request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                return File(responseStream, "application/octet-stream", DataTambahan);

            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }


        [HttpGet("/api/DeleteFile/{filePath}/{fileName}")]
        [DisableRequestSizeLimit]
        public ActionResult DeleteFile([FromRoute] string fileName, [FromRoute] string filePath)
        {
            try
            {

                // Get the object used to communicate with the server.  
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(FtpServer() + filePath.Replace('.', '/') + fileName);
                request.Method = WebRequestMethods.Ftp.DeleteFile;

                // This example assumes the FTP site uses anonymous logon.
                request.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                return Json("Delete Success");

            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }


        [Route("Template")]
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadTemplate(string param)
        {
            try
            {
                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    try
                    {
                        //string fileName = file.FileName;
                        string location = FtpServer()+"template/" + param;
                        WebRequest ftpRequest = WebRequest.Create(location);
                        ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;
                        ftpRequest.Credentials = new NetworkCredential(FtpUser(), Util.Decrypt(FtpPassword()));
                        Stream requestStream = ftpRequest.GetRequestStream();
                        file.CopyTo(requestStream);
                        requestStream.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        return Json("Upload Failed");
                    }
                }
                else
                {
                    return Content("file not selected");
                }
                return Json("Upload Success");
            }
            catch (System.Exception ex)
            {
                return Ok("Upload Failed: " + ex.Message);
            }
        }
       
    }
}