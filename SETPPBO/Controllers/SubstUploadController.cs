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

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/SubstUpload")]
    public class SubstUploadController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private IFileProvider _fileProvider;

        public SubstUploadController(IHostingEnvironment hostingEnvironment, MainDbContext context)
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

                        string locationfoldertahun = "ftp://10.242.77.90/setpp/" + currentYear;
                        WebRequest requesttahun = WebRequest.Create(locationfoldertahun);

                        requesttahun.Method = "MKD";
                        requesttahun.Method = WebRequestMethods.Ftp.MakeDirectory;
                        requesttahun.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
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

                        string locationfoldertahun = "ftp://10.242.77.90/setpp/" + currentYear + '/' + pemohonid;
                        WebRequest requesttahun = WebRequest.Create(locationfoldertahun);

                        requesttahun.Method = "MKD";
                        requesttahun.Method = WebRequestMethods.Ftp.MakeDirectory;
                        requesttahun.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
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
                        string locationfolder = "ftp://10.242.77.90/setpp/" + currentYear + '/' + pemohonid + '/' + permohonanId;
                        WebRequest request = WebRequest.Create(locationfolder);
                        request.Method = "MKD";
                        request.Method = WebRequestMethods.Ftp.MakeDirectory;
                        request.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                        Stream ftpStream = response.GetResponseStream();

                        ftpStream.Close();
                        response.Close();
                    }
                    catch (Exception e) { Console.WriteLine(e); }
                    try
                    {
                        string locationfolder = "ftp://10.242.77.90/setpp/" + currentYear + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas;
                        WebRequest request = WebRequest.Create(locationfolder);
                        request.Method = "MKD";
                        request.Method = WebRequestMethods.Ftp.MakeDirectory;
                        request.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                        Stream ftpStream = response.GetResponseStream();

                        ftpStream.Close();
                        response.Close();
                    }
                    catch (Exception e) { Console.WriteLine(e); }
                    try
                    {
                        string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string ext = fileName.Substring(fileName.LastIndexOf('.'));
                        string location = "ftp://10.242.77.90/setpp/" + currentYear + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas + '/' + fileName;
                        WebRequest ftpRequest = WebRequest.Create(location);
                        ftpRequest.Method = WebRequestMethods.Ftp.UploadFile;
                        ftpRequest.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        Stream requestStream = ftpRequest.GetRequestStream();
                        file.CopyTo(requestStream);

                        string fullPath = Path.Combine(newPath, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {

                            file.CopyTo(stream);
                        }

                        requestStream.Close();
                    }
                    catch (Exception e) { Console.WriteLine(e); }

                }
                return Json("Upload Success");
            }
            catch (System.Exception e)
            {
                Console.WriteLine(e);
                return Ok("Upload Failed: " + e.Message);
            }
        }

        [Route("DownloadFileSubst/{filePath}/{fileName}")]
        [DisableRequestSizeLimit]
        public ActionResult DownloadFileSubst([FromRoute] string fileName, [FromRoute] string filePath)
        {
            try
            {

                // Get the object used to communicate with the server.  
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://10.242.77.90/setpp/" + filePath.Replace('.', '/') + fileName);
                request.Method = WebRequestMethods.Ftp.DownloadFile;

                // This example assumes the FTP site uses anonymous logon.
                request.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                Stream responseStream = response.GetResponseStream();

                return File(responseStream, "application/octet-stream", fileName);

            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }
                
    }
}