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
using Microsoft.EntityFrameworkCore;

namespace SETPPBO.Controllers
{
    [Produces("application/json")]
    [Route("api/KelengkapanPermohonan")]
    public class KelengkapanPermohonanController : Controller
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

        public KelengkapanPermohonanController(IHostingEnvironment hostingEnvironment, MainDbContext context)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
            _fileProvider = hostingEnvironment.ContentRootFileProvider;
        }
        
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult KelengkapanPermohonan(string param)
        {
            string permohonanId = param.Split("/")[0];
            string jenisBerkas = param.Split("/")[1];
            Permohonan permohonan = _context.Permohonan.Find(permohonanId);
            DateTime dtTahunMasuk = permohonan.TglTerimaPermohonan.Value;
            string strTahunMasuk = dtTahunMasuk.Year.ToString();
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
                    // Create Folder Tahun
                    try
                    {
                        string locTahunMasuk = "ftp://10.242.77.90/setpp/" + strTahunMasuk;
                        WebRequest reqTahunMasuk = WebRequest.Create(locTahunMasuk);

                        reqTahunMasuk.Method = "MKD";
                        reqTahunMasuk.Method = WebRequestMethods.Ftp.MakeDirectory;
                        reqTahunMasuk.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        FtpWebResponse respTahunMasuk = (FtpWebResponse)reqTahunMasuk.GetResponse();
                        Stream ftpStreamTahunMasuk = respTahunMasuk.GetResponseStream();

                        ftpStreamTahunMasuk.Close();
                        ftpStreamTahunMasuk.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                    // Create Folder Tahun / PemohonId
                    try
                    {

                        string locPemohon = "ftp://10.242.77.90/setpp/" + strTahunMasuk + '/' + pemohonid;
                        WebRequest reqPemohon = WebRequest.Create(locPemohon);

                        reqPemohon.Method = "MKD";
                        reqPemohon.Method = WebRequestMethods.Ftp.MakeDirectory;
                        reqPemohon.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        FtpWebResponse respPemohon = (FtpWebResponse)reqPemohon.GetResponse();
                        Stream ftpStreamPemohon = respPemohon.GetResponseStream();

                        ftpStreamPemohon.Close();
                        respPemohon.Close();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                    // Create Folder Tahun / PemohonId / PermohonanId
                    try
                    {
                        string locPermohonan = "ftp://10.242.77.90/setpp/" + strTahunMasuk + '/' + pemohonid + '/' + permohonanId;
                        WebRequest reqPermohonan = WebRequest.Create(locPermohonan);
                        reqPermohonan.Method = "MKD";
                        reqPermohonan.Method = WebRequestMethods.Ftp.MakeDirectory;
                        reqPermohonan.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        FtpWebResponse respPermohonan = (FtpWebResponse)reqPermohonan.GetResponse();
                        Stream ftpStreamPermohonan = respPermohonan.GetResponseStream();

                        ftpStreamPermohonan.Close();
                        respPermohonan.Close();
                    }
                    catch (Exception e) { Console.WriteLine(e); }

                    try
                    {
                        string locJenisBerkas = "ftp://10.242.77.90/setpp/" + strTahunMasuk + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas;
                        WebRequest reqJenisBerkas = WebRequest.Create(locJenisBerkas);
                        reqJenisBerkas.Method = "MKD";
                        reqJenisBerkas.Method = WebRequestMethods.Ftp.MakeDirectory;
                        reqJenisBerkas.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        FtpWebResponse respJenisBerkas = (FtpWebResponse)reqJenisBerkas.GetResponse();
                        Stream ftpStreamJenisBerkas = respJenisBerkas.GetResponseStream();

                        ftpStreamJenisBerkas.Close();
                        respJenisBerkas.Close();
                    }
                    catch (Exception e) { Console.WriteLine(e); }

                    try
                    {
                        string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string ext = fileName.Substring(fileName.LastIndexOf('.'));
                        string locJenisBerkas = "ftp://10.242.77.90/setpp/" + strTahunMasuk + '/' + pemohonid + '/' + permohonanId + '/' + jenisBerkas + '/' + fileName;
                        WebRequest reqJenisBerkas = WebRequest.Create(locJenisBerkas);
                        reqJenisBerkas.Method = WebRequestMethods.Ftp.UploadFile;
                        reqJenisBerkas.Credentials = new NetworkCredential("ftpuser", "ftpP@ssw0rd");
                        Stream strJenisBerkas = reqJenisBerkas.GetRequestStream();
                        file.CopyTo(strJenisBerkas);

                        string fullPath = Path.Combine(newPath, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {

                            file.CopyTo(stream);
                        }

                        strJenisBerkas.Close();


                        Int16 intJenisBerkas = 0;

                        if (jenisBerkas == "DocSuratBG")
                        {
                            intJenisBerkas = 101;
                        }
                        else if (jenisBerkas == "PdfSuratBG")
                        {
                            permohonan.FilePdfSuratPermohonan = fileName;
                            intJenisBerkas = 102;
                        }
                        else if (jenisBerkas == "SalinanObjekSengketa")
                        {
                            intJenisBerkas = 103;
                        }
                        else if (jenisBerkas == "SalinanSKP")
                        {
                            intJenisBerkas = 104;
                        }
                        else if (jenisBerkas == "SalinanBuktiBayar")
                        {
                            intJenisBerkas = 105;
                        }
                        else if (jenisBerkas == "SuratKuasaKhusus")
                        {
                            intJenisBerkas = 106;
                        }

                        Console.WriteLine(intJenisBerkas);
                        _context.Entry(permohonan).State = EntityState.Modified;

                        _context.SaveChangesAsync();
                    }
                    catch (Exception e) { Console.WriteLine(e); }

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