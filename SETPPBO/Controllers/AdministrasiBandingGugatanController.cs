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
//using Microsoft.Office.Interop.Word;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Security.Claims;
using Pusintek.AspNetcore.DocIO;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;

namespace SETPPBO.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/AdministrasiBandingGugatan")]
    public class AdministrasiBandingGugatanController : Controller
    {
        private readonly MainDbContext _context;
        private IHostingEnvironment _hostingEnvironment;
        private IConfiguration Configuration { get; }
        private DocumentService documentService;
        private string templatePath;
        private string accessToken;
        private string refreshToken;
        private string sSOUrl;

        public AdministrasiBandingGugatanController(IHostingEnvironment hostingEnvironment, MainDbContext context, IConfiguration configuration)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            Configuration = configuration;
            sSOUrl = Configuration["Authentication:KemenkeuID:SSOUrl"];
            templatePath = _context.RefConfig.Where(c => c.ConfigKey == "TEMPLATE_PATH").Select(c => c.ConfigValue).FirstOrDefault();
        }


        [Route("DaftarBandingGugatan/DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDaftarCetakBG([FromBody] string[] ids)
        {
            var daftarBG = await (from a in _context.Permohonan
                                  join b in _context.RefJenisPermohonan
                                  on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                  join c in _context.Pemohon
                                  on a.PemohonId equals c.PemohonId
                                  join d in _context.RefJenisPemeriksaan
                                  on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                  where ids.Contains(a.PermohonanId)
                                  select new
                                  {
                                      JenisPermohonan = b.Uraian,
                                      No_Surat_Permohonan = a.NoSuratPermohonan,
                                      Tanggal_Permohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                      Tanggal_Terima = a.TglTerimaPermohonan.HasValue ? a.TglTerimaPermohonan.Value.ToShortDateString() : null,
                                      Pemohon = c.Nama,
                                      Nomor_Sengketa = a.NoSengketa,
                                      Jenis_pemeriksaan = d.Uraian,
                                      No_Tanda_Terima = a.NoTandaTerimaSubSt,
                                      Tanggal_Tanda_Terima = a.TglTandaTerimaPermintaan,
                                      Nomor_Permintaan_SUB = a.NoSuratPermintaanSubSt,
                                      Tanggal_Permintaan_SuB = a.TglSuratPermintaanSubSt,
                                      Nomor_SUB = a.NoSubSt,
                                      Tanggal_SUB = a.TglSubSt,
                                      Nomor_Surat_Permintaan_Bantahan = a.NoSuratPermintaanBantahan,
                                      Tanggal_Surat_Permintaan_Bantahan = a.TglSuratPermintaanBantahan,
                                      Nomor_Bantahan = a.NoSuratBantahan,
                                      Tanggal_Surat_Bantahan = a.TglSuratBantahan,
                                      PembagianBerkas = (a.RefPembagianBerkasId == 16776) ? "ABG I" : (a.RefPembagianBerkasId == 16777) ? "ABG II" : "ABG III",
                                      Distributsi = (a.RefMajelisPenunjukanId == null) ? " Belum Distribusi" : "Sudah Distribusi",
                                      No_Permintaan_Sutst = a.NoSuratPermintaanSubSt
                                  }).ToListAsync();
            return Ok(daftarBG);
        }

        //Export selected data to excel file Data Cover Berkas
        [Route("DataCoverBerkas/DaftarCetak")]
        [HttpPost]
        public async Task<IActionResult> GetDataCoverCetak([FromBody] string[] ids)
        {
            var dataCover = await (from a in _context.Permohonan
                                   join b in _context.RefJenisPermohonan
                                   on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                   join c in _context.Pemohon
                                   on a.PemohonId equals c.PemohonId
                                   join d in _context.RefJenisPemeriksaan
                                   on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                   join e in _context.RefJenisPajak
                                   on a.RefJenisPajakId equals e.RefJenisPajakId
                                   where ids.Contains(a.PermohonanId)
                                   select new
                                   {
                                       Jenis_Permohonan = b.Uraian,
                                       No_Surat_permohonan = a.NoSuratPermohonan,
                                       Tanggal_Permohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                       Tanggal_Terima = a.TglTerimaPermohonan.HasValue ? a.TglTerimaPermohonan.Value.ToShortDateString() : null,
                                       Pemohon = c.Nama,
                                       No_Sengketa = a.NoSengketa,
                                       Jenis_pemeriksaan = d.Uraian,
                                       No_Tanda_Terima = a.NoTandaTerimaSubSt,
                                       No_Permintaan_Sutst = a.NoSuratPermintaanSubSt,
                                       a.Npwp,
                                       Jenis_pajak = e.Uraian,
                                       Tahun_pajak = a.MasaPajakAwalTahun,
                                       a.RefPembagianBerkasId,
                                       Alamat_Pemohon = c.Alamat
                                   }).ToListAsync();
            return Ok(dataCover);
        }

        [Route("DaftarBandingGugatan")]
        [HttpGet]
        public async Task<IActionResult> GetDaftarBandingGugatan()
        {
            var AllBandingGugatan = await (from a in _context.Permohonan
                                           join b in _context.RefJenisPermohonan
                                           on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                           join c in _context.Pemohon
                                           on a.PemohonId equals c.PemohonId
                                           join d in _context.RefJenisPemeriksaan
                                           on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                           join e in _context.RefJenisPajak
                                           on a.RefJenisPajakId equals e.RefJenisPajakId
                                           select new
                                           {
                                               a.PermohonanId,
                                               a.RefJenisPermohonanId,
                                               RefJenisPermohonanUr = b.Uraian,
                                               a.PemohonId,
                                               a.PegawaiId,
                                               PemohonName = c.Nama,
                                               a.NoSuratPermohonan,
                                               TglSuratPermohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                               a.TglTerimaPermohonan,
                                               a.NoSengketa,
                                               a.NoPendaftaran,
                                               a.RefJenisPemeriksaanId,
                                               RefJenisPemeriksaanUr = d.Uraian,
                                               a.NoTandaTerimaSubSt,
                                               a.NoSuratPermintaanSubSt,
                                               a.Npwp,
                                               Jenis_pajak = e.Uraian,
                                               Tahun_pajak = a.MasaPajakAwalTahun,
                                               a.RefPembagianBerkasId,
                                               AlamatPemohon = c.Alamat
                                           }).ToListAsync();
            return Ok(AllBandingGugatan);
        }
        [Route("DaftarBandingGugatanFilter")]
        [HttpPost]
        public async Task<IActionResult> GetDaftarBandingGugatanFilter([FromBody] DateTime[] Filter)
        {

            var AllBandingGugatan = await (from a in _context.Permohonan
                                           join b in _context.RefJenisPermohonan
                                           on a.RefJenisPermohonanId equals b.RefJenisPermohonanId
                                           join c in _context.Pemohon
                                           on a.PemohonId equals c.PemohonId
                                           join d in _context.RefJenisPemeriksaan
                                           on a.RefJenisPemeriksaanId equals d.RefJenisPemeriksaanId
                                           join e in _context.RefJenisPajak
                                           on a.RefJenisPajakId equals e.RefJenisPajakId
                                           select new
                                           {
                                               a.PermohonanId,
                                               a.RefJenisPermohonanId,
                                               RefJenisPermohonanUr = b.Uraian,
                                               a.PemohonId,
                                               a.PegawaiId,
                                               PemohonName = c.Nama,
                                               a.NoSuratPermohonan,
                                               TglSuratPermohonan = a.TglSuratPermohonan.HasValue ? a.TglSuratPermohonan.Value.ToShortDateString() : null,
                                               a.TglTerimaPermohonan,
                                               a.NoSengketa,
                                               a.NoPendaftaran,
                                               a.RefJenisPemeriksaanId,
                                               RefJenisPemeriksaanUr = d.Uraian,
                                               a.NoTandaTerimaSubSt,
                                               a.NoSuratPermintaanSubSt,
                                               a.Npwp,
                                               Jenis_pajak = e.Uraian,
                                               Tahun_pajak = a.MasaPajakAwalTahun,
                                               a.RefPembagianBerkasId,
                                               AlamatPemohon = c.Alamat
                                           }).Where(x => x.TglTerimaPermohonan > Filter[0] && x.TglTerimaPermohonan < Filter[1]).ToListAsync();
            return Ok(AllBandingGugatan);
        }

        [Route("BerkasSiapSidangABGFilter")]
        [HttpPost]
        public async Task<IActionResult> GetBerkasSiapSidangFilter([FromBody] DateTime[] Filter)
        {

            var refNormaWaktu = _context.RefNormaWaktu.Where(w => w.RefJenisNormaWaktuId.Equals(9)).Select(w => new { w.RefJenisPermohonanId, w.Bulan, w.Hari }).ToList();

            var jatuhTempoBanding = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Bulan).First());

            var jatuhTempoGugatan = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Bulan).First());

            var berkasSiapSidang = await _context.Permohonan
                .Where(p =>
                    (
                        p.RefJenisPemeriksaanId.Equals(1) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(1) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) <= 0) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(2) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) <= 0) 
                    )
                    || p.NoSuratBantahan != null


                )
                .GroupJoin(
                    _context.RefMajelis,
                    p => p.RefMajelisHistoriId,
                    m => m.RefMajelisId,
                    (p, m) => new
                    {
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.TglTerimaPermohonan,
                        p.NamaTermohon,
                        p.TglSuratPermohonan,
                        p.NoSuratPermohonan,
                        p.NoSubSt,
                        p.NoSuratBantahan,
                        p.NoTandaTerimaSubSt,
                        p.NoSuratPermintaanSubSt,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        historiMajelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        PembagianBerkas = (p.RefPembagianBerkasId == 16776) ? "ABG I" : (p.RefPembagianBerkasId == 16777) ? "ABG II" : "ABG III",
                        Distributsi = (p.RefMajelisPenunjukanId == null) ? " Belum Distribusi" : "Sudah Distribusi",
                        jatuhtempo = p.RefJenisPermohonanId == 1 ? jatuhTempoBanding : jatuhTempoGugatan
                    }
                ).Distinct()
                .ToListAsync();

            var berkasSiapSidangFilter = berkasSiapSidang.Where(x => x.TglTerimaPermohonan > Filter[0] && x.TglTerimaPermohonan < Filter[1]).ToList();

            return Ok(berkasSiapSidangFilter);
        }



        [Route("BerkasSiapSidangABG")]
        public async Task<IActionResult> GetBerkasSiapSidang()
        {
            var refNormaWaktu = _context.RefNormaWaktu.Where(w => w.RefJenisNormaWaktuId.Equals(9)).Select(w => new { w.RefJenisPermohonanId, w.Bulan, w.Hari }).ToList();

            Console.WriteLine("tes norma waktu");
            Console.WriteLine(refNormaWaktu);
            var jatuhTempoBanding = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(1)).Select(w => w.Bulan).First());


            Console.WriteLine(jatuhTempoBanding);
            var jatuhTempoGugatan = DateTime.Today
                .AddDays(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Hari).First())
                .AddMonths(-refNormaWaktu.Where(w => w.RefJenisPermohonanId.Equals(2)).Select(w => w.Bulan).First());

            Console.WriteLine(jatuhTempoGugatan);
            var berkasSiapSidang = await _context.Permohonan
                .Where(p =>
                    (
                        p.RefJenisPemeriksaanId.Equals(1) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(1) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoBanding) <= 0) ||
                        (p.TglTerimaPermohonan.HasValue && p.RefJenisPermohonanId.Equals(2) && DateTime.Compare(p.TglTerimaPermohonan.Value, jatuhTempoGugatan) <= 0)
                    )
                    || p.NoSuratBantahan != null
                )
                .GroupJoin(
                    _context.RefMajelis,

                    p => p.RefMajelisHistoriId,
                    m => m.RefMajelisId,

                    (p, m) => new
                    {
                        p.PermohonanId,
                        p.NoSengketa,
                        jenisSengketa = p.RefJenisPermohonan.Uraian,
                        p.Pemohon.Nama,
                        p.TglTerimaPermohonan,
                        p.NamaTermohon,
                        p.TglSuratPermohonan,
                        p.NoSuratPermohonan,
                        p.NoSubSt,
                        p.NoSuratBantahan,
                        p.NoTandaTerimaSubSt,
                        p.NoSuratPermintaanSubSt,
                        jenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                        historiMajelis = m.Select(x => x.Majelis).SingleOrDefault(),
                        p.MasaPajakAkhirTahun,
                        p.RefJenisPajakId,
                        p.RefJenisPemeriksaanId,
                        p.PemohonId,
                        PembagianBerkas = (p.RefPembagianBerkasId == 16776) ? "ABG I" : (p.RefPembagianBerkasId == 16777) ? "ABG II" : "ABG III",
                        Distributsi = (p.RefMajelisPenunjukanId == null) ? " Belum Distribusi" : "Sudah Distribusi",
                        jatuhtempo = p.RefJenisPermohonanId == 1 ? jatuhTempoBanding : jatuhTempoGugatan
                    }
                ).Distinct()
                .ToListAsync();

            return Ok(berkasSiapSidang);
        }

        //[Route("TestFunction")]
        //[HttpGet]
        //public string TestFunction()
        //{
        //    //string organisasi = User.Claims.FirstOrDefault(x => x.Type.Equals("organisasiID")).Value;
        //    string organisasi = " & nama: "+ User.Claims.FirstOrDefault(x => x.Type.Equals("organisasiNama")).Value;
        //    //    string organisasi = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;
        //    return organisasi;
        //}

        // GET: api/AdministrasiBandingGugatan
        [Route("{jenisPermohonan}")]
        [HttpGet("{jenisPermohonan}")]
        public async Task<IActionResult> GetAdmBandingGugatan([FromRoute] int jenisPermohonan)
        {
            
            var admBandingGugatan = await _context.Permohonan
            .Where(p => p.RefJenisPermohonanId == jenisPermohonan // get Data Permohonan hanya yang berjenis 1:Banding / 2:Gugatan
            && 
            p.NoSengketa!=null // get Data Permohonan hanya untuk yang sudah dapat NoSengketa
            &&
            p.RefJenisPemeriksaanId != null
            )
            .Select(p => new
            {
                p.PermohonanId,
                p.Pemohon.Nama,
                p.NoTandaTerimaSubSt,
                p.NoSuratPermintaanSubSt,
                p.NoSuratPermohonan,
                p.TglSuratPermohonan,
                p.NoSubSt,
                p.NoSuratPermintaanBantahan,
                p.NoSuratBantahan,
                p.NoSuratPermintaanSalinan,
                //NPWP = p.Pemohon.Npwp,
                //p.PemohonId,
                p.NoSengketa,
                JenisPemeriksaan = p.RefJenisPemeriksaan.Uraian,
                PembagianBerkas = p.RefPembagianBerkasId == 16776? "ABG I": (p.RefPembagianBerkasId == 16777? "ABG II": "ABG III")
                //JenisKetetapan = p.RefJenisKetetapan.Uraian,
                //p.RefJenisKetetapanId,
                //p.NamaTermohon,
                //p.NamaUpTermohon,
                //p.AlamatTermohon,
                //p.KotaTermohon,
                //AlamatPemohon = p.Pemohon.Alamat,
                //KotaPemohon = p.Pemohon.Kota,
                //p.NoKep,
                //p.TglKep,
                //JenisPajakId = p.RefJenisPajakId,
                //JenisPajak = p.RefJenisPajak.Uraian,
                //p.MasaPajakAkhirBulan,
                //p.MasaPajakAkhirTahun,
                //p.MasaPajakAwalBulan,
                //p.MasaPajakAwalTahun,
                //p.NoSkp,
                //p.TglSkp,
            }).ToListAsync();
            return Ok(admBandingGugatan);
        }

        //get Daftar Tanda Terima Bg dan Permintaan SUB/Tanggapan
        [Route("DaftarTandaTerimaSubSt/{jenisPermohonan}")]
        //[HttpGet("{jenisPermohonan}")]
        public async Task<IActionResult> GetDaftarTandaterimaSubst([FromRoute] int jenisPermohonan)
        {
            var nama = User.Claims.FirstOrDefault(x => x.Type.Equals("nama")).Value;

            var daftar = await _context.Permohonan
                .Where(p => p.RefJenisPermohonanId == jenisPermohonan)// get Data Permohonan hanya yang berjenis Banding
            .Select(p => new
            {
                NamaPemohon = p.Pemohon.Nama,
                p.PemohonId,
                p.NoSengketa,
                p.NoSuratPermohonan,
                p.TglSuratPermohonan,
                p.NoTandaTerimaSubSt,
                p.TglTandaTerimaSubSt,
                p.NoSuratPermintaanSubSt,
                p.TglSuratPermintaanSubSt,
                p.NoSubSt,
                p.NoSuratPermintaanBantahan,
                p.NoSuratBantahan,
                p.NoSuratPermintaanSalinan,
                NPWP = p.Pemohon.Npwp,
                p.PermohonanId,
                JenisKetetapan = p.RefJenisKetetapan.Uraian,
                p.RefJenisKetetapanId,
                //Penandatangan = p.RefConfig.ConfigValue
                p.RefTermohonId,
                p.NamaTermohon,
                p.RefUpTermohonId,
                p.NamaUpTermohon,
                p.AlamatTermohon,
                p.KotaTermohon,
                AlamatPemohon = p.Pemohon.Alamat,
                KotaPemohon = p.Pemohon.Kota,
                p.NoKep,
                p.TglKep,
                JenisPajakId = p.RefJenisPajakId,
                JenisPajak = p.RefJenisPajak.Uraian,
                p.MasaPajakAkhirBulan,
                p.MasaPajakAkhirTahun,
                p.MasaPajakAwalBulan,
                p.MasaPajakAwalTahun,
                p.NoSkp,
                p.TglSkp
            }).ToListAsync();
            return Ok(daftar);
        }

        //get Detail Tanda Terima BG dan Permintaan SUB/Tanggapan
        [Route("DaftarTandaTerimaSubStById/{id}")]
        //[HttpGet("{id}")]
        public async Task<IActionResult> GetDaftarTandaterimaSubstById([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var pemohon = await _context.Permohonan
            .Select(p => new
            {
                p.Pemohon.Nama,
                p.PemohonId,
                p.NoSengketa,
                p.NoSuratPermohonan,
                p.TglSuratPermohonan,
                p.NoTandaTerimaSubSt,
                p.TglTandaTerimaSubSt,
                p.NoSuratPermintaanSubSt,
                p.TglSuratPermintaanSubSt,
                NPWP = p.Pemohon.Npwp,
                p.PermohonanId,
                JenisKetetapan = p.RefJenisKetetapan.Uraian,
                p.RefJenisKetetapanId,
                //Penandatangan = p.RefConfig.ConfigValue
                p.RefTermohonId,
                p.NamaTermohon,
                p.RefUpTermohonId,
                p.NamaUpTermohon,
                p.AlamatTermohon,
                p.KotaTermohon,
                AlamatPemohon = p.Pemohon.Alamat,
                KotaPemohon = p.Pemohon.Kota,
                p.Pemohon.KodePos,
                p.Pemohon.RefKotaId,
                p.Pemohon.RefKotaKorespondenId,
                p.Pemohon.AlamatKoresponden,
                p.Pemohon.KotaKoresponden,
                p.Pemohon.KodePosKoresponden,
                p.NoKep,
                p.TglKep,
                JenisPajakId = p.RefJenisPajakId,
                JenisPajak = p.RefJenisPajak.Uraian,
                p.MasaPajakAkhirBulan,
                p.MasaPajakAkhirTahun,
                p.MasaPajakAwalBulan,
                p.MasaPajakAwalTahun,
                p.NoSkp,
                p.TglSkp,
                p.RefTtdTandaTerimaId,
                p.RefTtdPermintaanSubStId,
                p.RefStatusId,
                p.TglTerimaAbgPermohonan
            })
            .SingleOrDefaultAsync(p => p.PermohonanId == id);

            if (pemohon == null)
            {
                return NotFound();
            }
            return Ok(pemohon);
        }

        // PUT: api/AdministrasiBandingGugatan/UpdateDataPermohonanAbg/5
        // untuk Update data Pemohon di Administrasi Banding dan Gugatan pada bagian input & pencetakan tanda terima dan permintaan SUB/Tanggapan
        [Route("UpdateTandaTerimaAbg/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAbgTandaTerima([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            string strNomorTerakhir = permohonan.NoTandaTerimaSubSt.Split("/")[0];
            int intNomorTerakhir = Convert.ToInt32(strNomorTerakhir.Split("-")[1]);
            string tipePermohonan = strNomorTerakhir.Split("-")[0];
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipePermohonan.Equals("T") ? 6 : 7) && m.Tahun == DateTime.Now.Year);
            varPenomoran.NomorTerakhir = intNomorTerakhir;
            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;

            perm.NoTandaTerimaSubSt = permohonan.NoTandaTerimaSubSt;
            perm.TglTandaTerimaSubSt = permohonan.TglTandaTerimaSubSt;
            perm.TglTerimaAbgPermohonan = permohonan.TglTerimaAbgPermohonan;
            perm.RefTtdTandaTerimaId = permohonan.RefTtdTandaTerimaId;
            perm.RefStatusId = permohonan.RefStatusId;
            perm.RefJenisKetetapanId = permohonan.RefJenisKetetapanId;
            perm.PerekamTandaTerimaPermintaanId = PegawaiID;
            perm.TglTandaTerimaPermintaan = DateTime.Now;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("NoTandaTerimaSubSt").IsModified = true;
            _context.Entry(perm).Property("TglTandaTerimaSubSt").IsModified = true;
            _context.Entry(perm).Property("RefTtdTandaTerimaId").IsModified = true;
            _context.Entry(perm).Property("RefJenisKetetapanId").IsModified = true;
            _context.Entry(perm).Property("PerekamTandaTerimaPermintaanId").IsModified = true;
            _context.Entry(perm).Property("TglTandaTerimaPermintaan").IsModified = true;
            _context.Entry(perm).Property("TglTerimaAbgPermohonan").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true; 
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
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

        // PUT: api/AdministrasiBandingGugatan/UpdateDataPermohonanAbg/5
        // untuk Update data Pemohon di Administrasi Banding dan Gugatan pada bagian input & pencetakan tanda terima dan permintaan SUB/Tanggapan
        [Route("UpdatePermintaanAbg/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermintaanAbg([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            string strNomorTerakhir = permohonan.NoSuratPermintaanSubSt.Split("/")[0];
            int intNomorTerakhir = Convert.ToInt32(strNomorTerakhir.Split("-")[1]);
            string tipePermohonan = strNomorTerakhir.Split("-")[0];
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipePermohonan.Equals("U") ? 8 : 9) && m.Tahun == DateTime.Now.Year);
            varPenomoran.NomorTerakhir = intNomorTerakhir;
            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;

            perm.NoSuratPermintaanSubSt = permohonan.NoSuratPermintaanSubSt;
            perm.TglSuratPermintaanSubSt = permohonan.TglSuratPermintaanSubSt;
            perm.RefTermohonId = permohonan.RefTermohonId;
            perm.NamaTermohon = permohonan.NamaTermohon;
            perm.RefUpTermohonId = permohonan.RefUpTermohonId;
            perm.NamaUpTermohon = permohonan.NamaUpTermohon;
            perm.AlamatTermohon = permohonan.AlamatTermohon;
            perm.KotaTermohon = permohonan.KotaTermohon;
            perm.RefTtdPermintaanSubStId = permohonan.RefTtdPermintaanSubStId;
            perm.PerekamTandaTerimaPermintaanId = PegawaiID;
            perm.TglTandaTerimaPermintaan = DateTime.Now;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;
            perm.RefStatusId = permohonan.RefStatusId;

            _context.Entry(perm).Property("NoSuratPermintaanSubSt").IsModified = true;
            _context.Entry(perm).Property("TglSuratPermintaanSubSt").IsModified = true;
            _context.Entry(perm).Property("RefTermohonId").IsModified = true;
            _context.Entry(perm).Property("NamaTermohon").IsModified = true;
            _context.Entry(perm).Property("RefUpTermohonId").IsModified = true;
            _context.Entry(perm).Property("NamaUpTermohon").IsModified = true;
            _context.Entry(perm).Property("AlamatTermohon").IsModified = true;
            _context.Entry(perm).Property("KotaTermohon").IsModified = true;
            _context.Entry(perm).Property("RefTtdPermintaanSubStId").IsModified = true;
            _context.Entry(perm).Property("PerekamTandaTerimaPermintaanId").IsModified = true;
            _context.Entry(perm).Property("TglTandaTerimaPermintaan").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
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

        // PUT: api/AdministrasiBandingGugatan/UpdateDataPermohonanAbg/5
        // untuk Update data permohonan di Administrasi Banding dan Gugatan pada bagian input & pencetakan tanda terima dan permintaan SUB/Tanggapan
        [Route("UpdateDataPermohonanAbg/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAbgPermohonan([FromRoute] string id, [FromBody] Permohonan permohonan)
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
            perm.NoSuratPermohonan = permohonan.NoSuratPermohonan;
            perm.TglSuratPermohonan = permohonan.TglSuratPermohonan;
            perm.NoKep = permohonan.NoKep;
            perm.TglKep = permohonan.TglKep;
            perm.RefJenisPajakId = permohonan.RefJenisPajakId;
            perm.MasaPajakAwalBulan = permohonan.MasaPajakAwalBulan;
            perm.MasaPajakAwalTahun = permohonan.MasaPajakAwalTahun;
            perm.MasaPajakAkhirBulan = permohonan.MasaPajakAkhirBulan;
            perm.NoSkp = permohonan.NoSkp;
            perm.TglSkp = permohonan.TglSkp;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("NoSuratPermohonan").IsModified = true;
            _context.Entry(perm).Property("TglSuratPermohonan").IsModified = true;
            _context.Entry(perm).Property("NoKep").IsModified = true;
            _context.Entry(perm).Property("TglKep").IsModified = true;
            _context.Entry(perm).Property("RefJenisPajakId").IsModified = true;
            _context.Entry(perm).Property("MasaPajakAwalBulan").IsModified = true;
            _context.Entry(perm).Property("MasaPajakAwalTahun").IsModified = true;
            _context.Entry(perm).Property("MasaPajakAkhirBulan").IsModified = true;
            _context.Entry(perm).Property("NoSkp").IsModified = true;
            _context.Entry(perm).Property("TglSkp").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
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

        // PUT: api/AdministrasiBandingGugatan/UpdateDataPermohonanAbg/5
        // untuk Update data Pemohon di Administrasi Banding dan Gugatan pada bagian input & pencetakan tanda terima dan permintaan SUB/Tanggapan
        [Route("UpdateDataPemohonAbg/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAbgPemohon([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            Pemohon perm = new Pemohon();
            perm.PemohonId = pemohon.PemohonId;
            _context.Pemohon.Attach(perm);
            perm.Nama = pemohon.Nama;
            perm.Npwp = pemohon.Npwp;
            perm.Alamat = pemohon.Alamat;
            perm.Kota = pemohon.Kota;
            perm.RefKotaId = pemohon.RefKotaId;
            perm.KodePos = pemohon.KodePos;
            perm.AlamatKoresponden = pemohon.AlamatKoresponden;
            perm.KotaKoresponden = pemohon.KotaKoresponden;
            perm.RefKotaKorespondenId = pemohon.RefKotaKorespondenId;
            perm.KodePosKoresponden = pemohon.KodePosKoresponden;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("Nama").IsModified = true;
            _context.Entry(perm).Property("Npwp").IsModified = true;
            _context.Entry(perm).Property("Alamat").IsModified = true;
            _context.Entry(perm).Property("Kota").IsModified = true;
            _context.Entry(perm).Property("RefKotaId").IsModified = true;
            _context.Entry(perm).Property("KodePos").IsModified = true;
            _context.Entry(perm).Property("AlamatKoresponden").IsModified = true;
            _context.Entry(perm).Property("KotaKoresponden").IsModified = true;
            _context.Entry(perm).Property("RefKotaKorespondenId").IsModified = true;
            _context.Entry(perm).Property("KodePosKoresponden").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
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

        // PUT: api/AdministrasiBandingGugatan/PenyampaianSalinan/UpdateDataTermohonAbg/5
        // untuk Update data termohon di Administrasi Banding dan Gugatan pada bagian input & pencetakan penyampaian salinan bantahan
        [Route("PenyampaianSalinan/UpdateDataTermohonAbg/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAbgTermohon([FromRoute] string id, [FromBody] Permohonan permohonan)
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
            perm.NoSuratPermohonan = permohonan.NoSuratPermohonan;
            perm.TglSuratPermohonan = permohonan.TglSuratPermohonan;
            perm.RefTermohonId = permohonan.RefTermohonId;
            perm.RefUpTermohonId = permohonan.RefUpTermohonId;
            perm.NamaTermohon = permohonan.NamaTermohon;
            perm.NamaUpTermohon = permohonan.NamaUpTermohon;
            perm.AlamatTermohon = permohonan.AlamatTermohon;
            perm.RefKotaTermohonId = permohonan.RefKotaTermohonId;
            perm.KotaTermohon = permohonan.KotaTermohon;
            perm.NoSuratBantahan = permohonan.NoSuratBantahan;
            perm.TglSuratBantahan = permohonan.TglSuratBantahan;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("NoSuratPermohonan").IsModified = true;
            _context.Entry(perm).Property("TglSuratPermohonan").IsModified = true;
            _context.Entry(perm).Property("RefTermohonId").IsModified = true;
            _context.Entry(perm).Property("RefUpTermohonId").IsModified = true;
            _context.Entry(perm).Property("NamaTermohon").IsModified = true;
            _context.Entry(perm).Property("NamaUpTermohon").IsModified = true;
            _context.Entry(perm).Property("AlamatTermohon").IsModified = true;
            _context.Entry(perm).Property("RefKotaTermohonId").IsModified = true;
            _context.Entry(perm).Property("KotaTermohon").IsModified = true;
            _context.Entry(perm).Property("NoSuratBantahan").IsModified = true;
            _context.Entry(perm).Property("TglSuratBantahan").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
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

        [Route("PermintaanBantahan/{id}")]
        //[HttpGet("{id}")]
        public async Task<IActionResult> GetPermintaanBantahan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var permintaanBantahan = await _context.Permohonan
                        .Where(p => p.PermohonanId == id)
                        .Select(p => new
                        {
                            p.PermohonanId,
                            p.NoSengketa,
                            p.NoSuratPermintaanBantahan,
                            p.TglSuratPermintaanBantahan,
                            p.RefTtdPermintaanBantahanId,
                            p.Pemohon.PemohonId,
                            p.Pemohon.Nama,
                            p.Pemohon.Alamat,
                            p.Pemohon.AlamatKoresponden,
                            p.Pemohon.RefKotaId,
                            p.Pemohon.RefKotaKorespondenId,
                            p.Pemohon.Kota,
                            p.Pemohon.KotaKoresponden,
                            p.Pemohon.KodePos,
                            p.Pemohon.KodePosKoresponden,
                            p.NoSubSt,
                            p.TglSubSt,
                            p.NoSuratBantahan,
                            p.NoSuratPermohonan,
                            p.TglSuratPermohonan,
                            p.RefStatusId
                        })
                        .SingleOrDefaultAsync();
            if (permintaanBantahan == null)
            {
                return NotFound();
            }

            return Ok(permintaanBantahan);
        }

        // PUT: api/AdministrasiBandingGugatan/PermintaanBantahan/5
        //[Route("AdministrasiBandingGugatan/PermintaanBantahan/{id}")]
        [HttpPut("PermintaanBantahan/{id}")]
        public async Task<IActionResult> PutPermintaanBantahan([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            permohonan.PerekamPermintaanBantahanId = PegawaiID;
            permohonan.TglRekamPermintaanBantahan = DateTime.Now;
            permohonan.UpdatedBy = PegawaiID;
            permohonan.UpdatedDate = DateTime.Now;

            string strNomorTerakhir = permohonan.NoSuratPermintaanBantahan.Split("/")[0];
            int intNomorTerakhir = Convert.ToInt32(strNomorTerakhir.Split("-")[1]);
            string tipePermohonan = strNomorTerakhir.Split("-")[0];
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipePermohonan.Equals("B") ? 10 : 11) && m.Tahun == DateTime.Now.Year);
            varPenomoran.NomorTerakhir = intNomorTerakhir;
            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;

            // _context.Entry(permohonan).State = EntityState.Modified;
            //_context.Entry(permohonan).Property(x => x.NoSengketa).IsModified = true;
            _context.Entry(permohonan).Property(x => x.NoSuratPermintaanBantahan).IsModified = true;
            _context.Entry(permohonan).Property(x => x.TglSuratPermintaanBantahan).IsModified = true;
            _context.Entry(permohonan).Property(x => x.RefTtdPermintaanBantahanId).IsModified = true;
            _context.Entry(permohonan).Property(x => x.PerekamPermintaanBantahanId).IsModified = true;
            _context.Entry(permohonan).Property(x => x.TglRekamPermintaanBantahan).IsModified = true;
            _context.Entry(permohonan).Property(x => x.UpdatedBy).IsModified = true;
            _context.Entry(permohonan).Property(x => x.UpdatedDate).IsModified = true;
            _context.Entry(permohonan).Property(x => x.RefStatusId).IsModified = true;

            try
            {
                // _context.Entry(permohonan.Pemohon).State = EntityState.Modified;
                // permohonan.UpdatedDate = DateTime.Now;
                // permohonan.UpdatedBy = 116971;

                // _context.Entry(permohonan.Pemohon).State = EntityState.Modified;
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

        // PUT: api/AdministrasiBandingGugatan/PermintaanBantahan/UpdateDataSubSt/5
        // untuk Update data NoSubSt dan/atau TglSubSt di Administrasi Banding dan Gugatan pada bagian input & pencetakan data pendukung permintaan bantahan
        [Route("PermintaanBantahan/UpdateDataSubSt/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDataSubSt([FromRoute] string id, [FromBody] Permohonan permohonan)
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
            perm.NoSubSt = permohonan.NoSubSt;
            perm.TglSubSt = permohonan.TglSubSt;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("NoSubSt").IsModified = true;
            _context.Entry(perm).Property("TglSubSt").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
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

        private List<Pemohon> GetPemohon()
        {
            return _context.Pemohon.ToList();
        }

        // POST: api/AdministrasiBandingGugatan/PermintaanBantahan
        [Route("PermintaanBantahan")]
        [HttpPost]
        public async Task<IActionResult> PostPermintaanBantahan([FromBody] Permohonan permohonan)
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

        // PUT: api/AdministrasiBandingGugatan/PermintaanBantahan/UpdateDataPemohonAbg/5
        // untuk Update data pemohon di Administrasi Banding dan Gugatan pada bagian input & pencetakan permintaan bantahan
        [Route("PermintaanBantahan/UpdateDataPemohonAbg/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAbgPemohonPermintaanBantahan([FromRoute] string id, [FromBody] Pemohon pemohon)
        {
            var varPegawaiID = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name).Value;
            Int32 PegawaiID = Convert.ToInt32(varPegawaiID);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pemohon.PemohonId)
            {
                return BadRequest();
            }

            Pemohon perm = new Pemohon();
            perm.PemohonId = pemohon.PemohonId;
            _context.Pemohon.Attach(perm);
            perm.Nama = pemohon.Nama;
            perm.Alamat = pemohon.Alamat;
            perm.AlamatKoresponden = pemohon.AlamatKoresponden;
            perm.Kota = pemohon.Kota;
            perm.KotaKoresponden = pemohon.KotaKoresponden;
            perm.RefKotaId = pemohon.RefKotaId;
            perm.RefKotaKorespondenId = pemohon.RefKotaKorespondenId;
            perm.KodePos = pemohon.KodePos;
            perm.KodePosKoresponden = pemohon.KodePosKoresponden;

            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("Nama").IsModified = true;
            _context.Entry(perm).Property("Alamat").IsModified = true;
            _context.Entry(perm).Property("AlamatKoresponden").IsModified = true;
            _context.Entry(perm).Property("Kota").IsModified = true;
            _context.Entry(perm).Property("KotaKoresponden").IsModified = true;
            _context.Entry(perm).Property("RefKotaId").IsModified = true;
            _context.Entry(perm).Property("RefKotaKorespondenId").IsModified = true;
            _context.Entry(perm).Property("KodePos").IsModified = true;
            _context.Entry(perm).Property("KodePosKoresponden").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
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

        [Route("PenyampaianSalinan/{id}")]
        //[HttpGet("{id}")]
        //[HttpGet("AdministrasiBandingGugatan/PenyampaianSalinan/{id}")]
        public async Task<IActionResult> GetPenyampaianSalinan([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var permintaanSalinan = await _context.Permohonan
                        .Where(p => p.PermohonanId == id)
                        .Select(p => new
                        {
                            p.PermohonanId,
                            p.NoSengketa,
                            p.NoSuratPermintaanSalinan,
                            p.TglSuratPermintaanSalinan,
                            p.RefTermohonId,
                            p.RefUpTermohonId,
                            p.NamaUpTermohon,
                            p.NamaTermohon,
                            p.AlamatTermohon,
                            p.RefKotaTermohonId,
                            p.KotaTermohon,
                            p.KodePosPengirimSubSt,
                            p.NoSuratBantahan,
                            p.TglSuratBantahan,
                            p.NoSuratPermohonan,
                            p.TglSuratPermohonan,
                            p.RefTtdPermintaanSalinanId,
                            p.RefStatusId
                        })
                        .SingleOrDefaultAsync();
            if (permintaanSalinan == null)
            {
                return NotFound();
            }

            return Ok(permintaanSalinan);
        }

        // PUT: api/AdministrasiBandingGugatan/PenyampaianSalinan/UpdateSalinanBantahan/5
        //[Route("AdministrasiBandingGugatan/PenyampaianSalinan/UpdateSalinanBantahan/{id}")]
        [HttpPut("PenyampaianSalinan/UpdateSalinanBantahan/{id}")]
        public async Task<IActionResult> PermintaanSalinan([FromRoute] string id, [FromBody] Permohonan permohonan)
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

            string strNomorTerakhir = permohonan.NoSuratPermintaanSalinan.Split("/")[0];
            int intNomorTerakhir = Convert.ToInt32(strNomorTerakhir.Split("-")[1]);
            string tipePermohonan = strNomorTerakhir.Split("-")[0];
            var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipePermohonan.Equals("PB") ? 12 : 13) && m.Tahun == DateTime.Now.Year);
            varPenomoran.NomorTerakhir = intNomorTerakhir;
            _context.Entry(varPenomoran).Property("NomorTerakhir").IsModified = true;

            perm.NoSuratPermintaanSalinan = permohonan.NoSuratPermintaanSalinan;
            perm.TglSuratPermintaanSalinan = permohonan.TglSuratPermintaanSalinan;
            perm.RefTtdPermintaanSalinanId = permohonan.RefTtdPermintaanSalinanId;
            perm.PerekamPermintaanSalinanId = PegawaiID;
            perm.TglRekamPermintaanSalinan = DateTime.Now;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;
            perm.RefStatusId = permohonan.RefStatusId;

            _context.Entry(perm).Property("NoSuratPermintaanSalinan").IsModified = true;
            _context.Entry(perm).Property("TglSuratPermintaanSalinan").IsModified = true;
            _context.Entry(perm).Property("RefTtdPermintaanSalinanId").IsModified = true;
            _context.Entry(perm).Property("PerekamPermintaanSalinanId").IsModified = true;
            _context.Entry(perm).Property("TglRekamPermintaanSalinan").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
            _context.Entry(perm).Property("RefStatusId").IsModified = true;
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

        // POST: api/AdministrasiBandingGugatan/PermintaanSalinan
        [Route("PenyampaianSalinan")]
        [HttpPost]
        public async Task<IActionResult> PostPenyampaianSalinan([FromBody] Permohonan permohonan)
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

        // get provinsi 
        //[Route("GetProvinsi")]

        // untuk auto generate NoTandaTerima ABG; tipe untuk pembeda banding & gugatan
        [Route("GetLatestTandaTerimaAbg/{tipe}")]
        [HttpGet("{tipe}")]
        public async Task<int> GetLatestTandaTerimaAbg([FromRoute] int tipe)
        {
            try
            {
                //var latestNumber = await _context.Permohonan
                //.Where(p => p.NoTandaTerimaSubSt != null && p.TglTandaTerimaSubSt != null && p.TglTandaTerimaSubSt.Value.Year == DateTime.Now.Year && p.RefJenisPermohonanId == tipe)
                //.MaxAsync(p => int.Parse(p.NoTandaTerimaSubSt.Split("/", StringSplitOptions.None)[0].Split("-", StringSplitOptions.None)[1]));
                int latestNumber = 0;
                var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipe==1?6:7) && m.Tahun == DateTime.Now.Year);
                if (varPenomoran == null)
                {
                    varPenomoran = new Penomoran();
                    latestNumber = 0;
                    varPenomoran.NomorTerakhir = 1;
                    varPenomoran.OrganisasiId = 0;
                    varPenomoran.KodeOrganisasi = "0";
                    varPenomoran.NamaOrganisasi = "-";
                    varPenomoran.Tahun = DateTime.Now.Year;
                    if (tipe == 1) varPenomoran.RefJenisPenomoranId = 6; else varPenomoran.RefJenisPenomoranId = 7;
                    _context.Penomoran.Add(varPenomoran);
                }
                else
                {
                    latestNumber = varPenomoran.NomorTerakhir;
                    varPenomoran.NomorTerakhir = latestNumber + 1;
                }

                return latestNumber;
            }
            catch (InvalidOperationException)
            {
                return 0;
            }
            catch (Exception)
            {
                return -1;
            }

        }

        // untuk auto generate NoSuratPermintaan ABG; tipe untuk pembeda banding & gugatan
        [Route("GetLatestPermintaanAbg/{tipe}")]
        [HttpGet("{tipe}")]
        public async Task<int> GetLatestPermintaanAbg([FromRoute] int tipe)
        {
            try
            {
                //var latestNumber = await _context.Permohonan
                // .Where(p => p.NoSuratPermintaanSubSt != null && p.TglSuratPermintaanSubSt != null && p.TglSuratPermintaanSubSt.Value.Year == DateTime.Now.Year && p.RefJenisPermohonanId == tipe)
                // .MaxAsync(p => int.Parse(p.NoSuratPermintaanSubSt.Split("/", StringSplitOptions.None)[0].Split("-", StringSplitOptions.None)[1]));
                int latestNumber = 0;
                var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipe == 1 ? 8 : 9) && m.Tahun == DateTime.Now.Year);
                if (varPenomoran == null)
                {
                    varPenomoran = new Penomoran();
                    latestNumber = 0;
                    varPenomoran.NomorTerakhir = 1;
                    varPenomoran.OrganisasiId = 0;
                    varPenomoran.KodeOrganisasi = "0";
                    varPenomoran.NamaOrganisasi = "-";
                    varPenomoran.Tahun = DateTime.Now.Year;
                    if (tipe == 1) varPenomoran.RefJenisPenomoranId = 8; else varPenomoran.RefJenisPenomoranId = 9;
                    _context.Penomoran.Add(varPenomoran);
                }
                else
                {
                    latestNumber = varPenomoran.NomorTerakhir;
                    varPenomoran.NomorTerakhir = latestNumber + 1;
                }

                return latestNumber;
            }
            catch (InvalidOperationException)
            {
                return 0;
            }
            catch (Exception)
            {
                return -1;
            }
        }

        // untuk auto generate NoSuratPermintaanBantahan ABG; tipe untuk pembeda banding & gugatan
        [Route("PermintaanBantahan/GetLatestPermintaanBantahanAbg/{tipe}")]
        [HttpGet("{tipe}")]
        public async Task<int> GetLatestPermintaanBantahanAbg([FromRoute] int tipe)
        {
            try
            {
                //var latestNumber = await _context.Permohonan
                // .Where(p => p.NoSuratPermintaanBantahan != null && p.TglSuratPermintaanBantahan != null && p.TglSuratPermintaanBantahan.Value.Year == DateTime.Now.Year && p.RefJenisPermohonanId == tipe)
                // .MaxAsync(p => int.Parse(p.NoSuratPermintaanBantahan.Split("/", StringSplitOptions.None)[0].Split("-", StringSplitOptions.None)[1]));
                int latestNumber = 0;
                var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipe == 1 ? 10 : 11) && m.Tahun == DateTime.Now.Year);
                if (varPenomoran == null)
                {
                    varPenomoran = new Penomoran();
                    latestNumber = 0;
                    varPenomoran.NomorTerakhir = 1;
                    varPenomoran.OrganisasiId = 0;
                    varPenomoran.KodeOrganisasi = "0";
                    varPenomoran.NamaOrganisasi = "-";
                    varPenomoran.Tahun = DateTime.Now.Year;
                    if (tipe == 1) varPenomoran.RefJenisPenomoranId = 10; else varPenomoran.RefJenisPenomoranId = 11;
                    _context.Penomoran.Add(varPenomoran);
                }
                else
                {
                    latestNumber = varPenomoran.NomorTerakhir;
                    varPenomoran.NomorTerakhir = latestNumber + 1;
                }
                return latestNumber;
            }
            catch (InvalidOperationException)
            {
                return 0;
            }
            catch (Exception)
            {
                return -1;
            }
        }

        // untuk auto generate NoSuratPermintaanSalinanBantahan ABG; tipe untuk pembeda banding & gugatan
        [Route("PenyampaianSalinan/GetLatestPenyampaianSalinanAbg/{tipe}")]
        [HttpGet("{tipe}")]
        public async Task<int> GetLatestPenyampaianSalinanAbg([FromRoute] int tipe)
        {
            try
            {
                //var latestNumber = await _context.Permohonan
                // .Where(p => p.NoSuratPermintaanSalinan != null && p.TglSuratPermintaanSalinan != null && p.TglSuratPermintaanSalinan.Value.Year == DateTime.Now.Year && p.RefJenisPermohonanId == tipe)
                // .MaxAsync(p=> int.Parse(p.NoSuratPermintaanSalinan.Split("/", StringSplitOptions.None)[0].Split("-", StringSplitOptions.None)[1]));
                int latestNumber = 0;
                var varPenomoran = await _context.Penomoran.SingleOrDefaultAsync(m => m.RefJenisPenomoranId == (tipe == 1 ? 12 : 13) && m.Tahun == DateTime.Now.Year);
                if (varPenomoran == null)
                {
                    varPenomoran = new Penomoran();
                    latestNumber = 0;
                    varPenomoran.NomorTerakhir = 1;
                    varPenomoran.OrganisasiId = 0;
                    varPenomoran.KodeOrganisasi = "0";
                    varPenomoran.NamaOrganisasi = "-";
                    varPenomoran.Tahun = DateTime.Now.Year;
                    if (tipe == 1) varPenomoran.RefJenisPenomoranId = 12; else varPenomoran.RefJenisPenomoranId = 13;
                    _context.Penomoran.Add(varPenomoran);
                }
                else
                {
                    latestNumber = varPenomoran.NomorTerakhir;
                    varPenomoran.NomorTerakhir = latestNumber + 1;
                }
                return latestNumber;
            }
            catch (InvalidOperationException)
            {
                return 0;
            }
            catch (Exception)
            {
                return -1;
            }
        }

        private bool PermohonanExists(string id)
        {
            return _context.Permohonan.Any(e => e.PermohonanId == id);
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
                var BO_BASEURL = await _context.RefConfig.FirstOrDefaultAsync(a => a.ConfigKey == "BO_BASEURL");
                baseUrl = BO_BASEURL.ConfigValue.ToString();
            }

            //var baseUrl = await _context.RefConfig.Where(r => r.ConfigKey == "BO_BASEURL").FirstOrDefaultAsync().ConfigValue;
            return baseUrl;
        }

        [Route("GetRefTtd")]
        [HttpGet]
        public async Task<IActionResult> GetRefTtd()
        {
            var refTtdAbg = await _context.RefConfig.Where(r =>
                    r.Uraian == "TTD"
                    && r.ConfigKey != "TTD_KETUA"
                ).Select(r => new
                {
                    RefId = r.RefConfigId,
                    Role = r.ConfigKey,
                    PegawaiId = r.ConfigValue
                }
                ).ToListAsync();
            return Ok(refTtdAbg);
        }

        private async Task<string> GetRefTTD(int? id)
        {
            var pegawaiInfo = _context.RefConfig.Where(a => a.RefConfigId == id).FirstOrDefault();

            var idPegawai = pegawaiInfo.ConfigValue;
            var penandatangan = "";
            var namaPenandatangan = "";
            string result = "";
            await GetAccessToken();
            //string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();

            PegawaiInfo info = await GetPegawaiByID(idPegawai, accessToken);

            if (pegawaiInfo.ConfigKey == "TTD_SES")
            {
                penandatangan = "Panitera";
                namaPenandatangan = _context.RefConfig.Where(a => a.ConfigKey == "SES").FirstOrDefault().ConfigValue;
            }
            else
            {
                penandatangan = "Wakil Panitera";
                namaPenandatangan = _context.RefConfig.Where(a => a.ConfigKey == "WASES").FirstOrDefault().ConfigValue;
            }
            // result => Panitera/GelarDepan/Nama/GelarBelakang/NIP18
            //result += penandatangan + "/" + info.GelarDepan + "/" + info.Nama + "/" + info.GelarBelakang + "/" + info.NIP18;
            result += penandatangan + "/" + namaPenandatangan + "/" + info.NIP18;
            return result;
        }

        // PUT: api/AdministrasiBandingGugatan/UpdateStatusCetak/5
        //[Route("AdministrasiBandingGugatan/UpdateStatusCetak/{id}")]
        [HttpPut("UpdateStatusCetak/{id}")]
        public async Task<IActionResult> UpdateStatusCetak([FromRoute] string id, [FromBody] Permohonan permohonan)
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
            perm.RefStatusId = permohonan.RefStatusId;
            perm.UpdatedDate = DateTime.Now;
            perm.UpdatedBy = PegawaiID;

            _context.Entry(perm).Property("RefStatusId").IsModified = true;
            _context.Entry(perm).Property("UpdatedBy").IsModified = true;
            _context.Entry(perm).Property("UpdatedDate").IsModified = true;
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

        private string convertIntToMonth(int? month)
        {
            string[] monthString = { "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" };

            if (month != null)
            {
                return monthString[month.Value - 1];
            }
            else
            {
                return "";
            }

        }

        // Test Get Pegawai Info
        //[Route("TestGetTTD/{nip}")]
        //[HttpGet]
        //public async Task<string> TestGetTTD([FromRoute] string nip)
        //{
        //    string result = "";
        //    string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
        //    // 73875 SES
        //    // 73641 WASES
        //    // 141155
        //    PegawaiInfo info = await GetPegawaiByID(nip, accessToken);

        //    result += info.Nama + "--" + info.NIP18+"--"+info.IDPegawai+"--"+info.GelarDepan+"--"+info.GelarBelakang;
        //    return result;
        //}

        [HttpGet("CetakTandaTerimaSuratPermohonan/{id}")]
        public async Task<IActionResult> CetakTandaTerimaPermohonan([FromRoute] string id)
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
                    a.RefJenisPermohonan.Uraian,
                    a.NoTandaTerimaSubSt,
                    a.RefTtdTandaTerimaId,
                    a.NoSengketa,
                    a.Pemohon.Npwp,
                    a.Pemohon.Nama,
                    a.Pemohon.AlamatKoresponden,
                    a.Pemohon.KotaKoresponden,
                    a.NoSuratPermohonan,
                    a.TglSuratPermohonan,
                    a.NoKep,
                    a.TglKep,
                    CaraKirim = a.RefCaraKirimPermohonan.Uraian,
                    a.TglTerimaPermohonan
                }).FirstOrDefaultAsync();

            if (permohonan == null)
            {
                return NotFound();
            }

            documentService = new DocumentService(templatePath + "TandaTerimaSuratPermohonan.docx");

            // Get Penandatangan
            string penandatanganObj = GetRefTTD(permohonan.RefTtdTandaTerimaId).Result;
            //string namaPenandatangan = "";
            //foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
            //{
            //    if (x.Length >= 2)
            //    {
            //        namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
            //    }
            //}

            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"NoTandaTerima", permohonan.NoTandaTerimaSubSt },
                {"TipePermohonan",permohonan.Uraian },
                {"NamaPemohon", permohonan.Nama },
                {"NPWPVar", permohonan.Npwp },
                {"AlamatPemohon", permohonan.AlamatKoresponden+" "+permohonan.KotaKoresponden },
                {"NoSuratPermohonan", permohonan.NoSuratPermohonan },
                {"TglSuratPermohonan", DateTime.Parse(permohonan.TglSuratPermohonan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"NoKep", permohonan.NoKep },
                {"TglKep", DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"CaraKirim", permohonan.CaraKirim },
                {"TglTerimaSurat", DateTime.Parse(permohonan.TglTerimaPermohonan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"NoSengketa", Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa) },
                {"TglServer", DateTime.Now.ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarPenandatangan", penandatanganObj.Split("/")[0] }, // [0] Panitera/Wakil Panitera
                //{ "NamaPenandatangan", penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3] }, // [1] Gelar Depan; [3] Gelar Belakang
                { "NamaPenandatangan", penandatanganObj.Split("/")[1]}, // [1] Gelar Depan; [3] Gelar Belakang
                { "NIPPenandatangan", "NIP " + penandatanganObj.Split("/")[2] } // [4] NIP18
        };


            documentService.Data = new DataField()
            {
                Data = DataPermohonan
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa + permohonan.NoTandaTerimaSubSt + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

        [HttpGet("CetakPermintaanSubSt/{id}")]
        public async Task<IActionResult> CetakPermintaanSubSt([FromRoute] string id)
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
                    a.RefJenisPermohonanId,
                    a.NoSuratPermintaanSubSt,
                    a.TglSuratPermintaanSubSt,
                    a.RefTtdPermintaanSubStId,
                    a.RefTermohonId,
                    a.NamaTermohon,
                    a.NamaUpTermohon,
                    a.AlamatTermohon,
                    a.Pemohon.Nama,
                    a.Pemohon.Npwp,
                    a.Pemohon.AlamatKoresponden,
                    a.Pemohon.KotaKoresponden,
                    a.NoSuratPermohonan,
                    a.TglSuratPermohonan,
                    a.NoKep,
                    a.TglKep,
                    a.RefJenisKetetapan.Uraian,
                    a.MasaPajakAwalBulan,
                    a.MasaPajakAkhirBulan,
                    a.MasaPajakAwalTahun,
                    a.NoSkp,
                    a.TglSkp,
                    a.NoSengketa
                }).FirstOrDefaultAsync();

            if (permohonan == null)
            {
                return NotFound();
            }

            var templateFileName = "";

            if (permohonan.RefJenisPermohonanId == 1)
            {
                templateFileName = "PermintaanSub.docx";
            }
            else
            {
                templateFileName = "PermintaanST.docx";
            }

            documentService = new DocumentService(templatePath + templateFileName);

            // Masa Pajak
            string masaPajak = "";
            string awalBulan = this.convertIntToMonth(permohonan.MasaPajakAwalBulan);
            string akhirBulan = this.convertIntToMonth(permohonan.MasaPajakAkhirBulan);

            if (awalBulan.Equals(akhirBulan))
            {
                masaPajak += awalBulan;
            }
            else
            {
                if (awalBulan != null || !awalBulan.Equals(""))
                {
                    masaPajak += awalBulan;

                    if (akhirBulan != null || !akhirBulan.Equals(""))
                    {
                        masaPajak += " s.d. " + akhirBulan;
                    }
                }
                else if (akhirBulan != null || !akhirBulan.Equals(""))
                {
                    masaPajak += akhirBulan;
                }
                else
                {
                    masaPajak += " - ";
                }
            }
            masaPajak += " Tahun: " + permohonan.MasaPajakAwalTahun;

            // Get Penandatangan
            string penandatanganObj = GetRefTTD(permohonan.RefTtdPermintaanSubStId).Result;
            //string namaPenandatangan = "";
            //foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
            //{
            //    if (x.Length >= 2)
            //    {
            //        namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
            //    }
            //}

            // Termohon untuk Tembusan
            string tembusanTermohon = "";
            if (permohonan.RefTermohonId == 859)
            {
                tembusanTermohon = "Direktur Keberatan dan Banding DJP";
            }
            else if (permohonan.RefTermohonId == 7493)
            {
                tembusanTermohon = "Direktur  Peraturan dan Penerimaan Kepabeanan dan Cukai DJBC";
            }
            else
            {
                tembusanTermohon = "Pemerintah Daerah";
            }

            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"VarNoPermintaan", permohonan.NoSuratPermintaanSubSt },
                {"VarTglSuratPermintaan", DateTime.Parse(permohonan.TglSuratPermintaanSubSt.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarSifat", "Segera" },
                {"VarNamaTermohon", permohonan.NamaTermohon },
                {"VarNamaUpTermohon", permohonan.NamaUpTermohon },
                {"VarAlamatTermohon", permohonan.AlamatTermohon },
                {"VarNamaPemohon", permohonan.Nama },
                {"VarNPWP", permohonan.Npwp },
                {"VarAlamatPemohon", permohonan.AlamatKoresponden+" "+permohonan.KotaKoresponden },
                {"VarNoSuratPermohonan", permohonan.NoSuratPermohonan },
                {"VarNoKep", permohonan.NoKep },
                {"VarTglKep", DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarJenisKetetapan", permohonan.Uraian },
                {"VarMasaPajak", masaPajak },
                {"VarNoSkp", permohonan.NoSkp },
                {"VarTglSkp", DateTime.Parse(permohonan.TglSkp.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) }, 
                {"VarNoSengketa", Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa) },
                {"VarPenandatangan", penandatanganObj.Split("/")[0] },
                //{"VarNamaPenandatangan", penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3] },
                {"VarNamaPenandatangan", penandatanganObj.Split("/")[1]},
                {"VarNIPPenandatangan", "NIP " + penandatanganObj.Split("/")[2] },
                {"VarTembusan", tembusanTermohon } // ditanyakan
        };


            documentService.Data = new DataField()
            {
                Data = DataPermohonan
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa + permohonan.NoSuratPermintaanSubSt + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

        [HttpGet("CetakPermintaanBantahan/{id}")]
        public async Task<IActionResult> CetakPermintaanBantahan([FromRoute] string id)
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
                    a.RefJenisPermohonanId,
                    a.NoSuratPermintaanBantahan,
                    a.TglSuratPermintaanBantahan,
                    a.RefTtdPermintaanBantahanId,
                    a.NoSubSt,
                    a.TglSubSt,
                    a.RefTermohonId,
                    a.NamaTermohon,
                    a.NamaUpTermohon,
                    a.Pemohon.Nama,
                    a.Pemohon.Npwp,
                    a.Pemohon.AlamatKoresponden,
                    a.Pemohon.KotaKoresponden,
                    a.NoSuratPermohonan,
                    a.TglSuratPermohonan,
                    a.NoKep,
                    a.TglKep,
                    a.RefJenisKetetapan.Uraian,
                    a.MasaPajakAwalBulan,// masa pajak
                    a.MasaPajakAkhirBulan,
                    a.MasaPajakAwalTahun,
                    a.NoSkp,
                    a.TglSkp,
                    a.NoSengketa
                }).FirstOrDefaultAsync();

            if (permohonan == null)
            {
                return NotFound();
            }

            var templateFileName = "";

            if (permohonan.RefJenisPermohonanId == 1)
            {
                templateFileName = "PermintaanBantahanAtasSub.docx";
            }
            else
            {
                templateFileName = "PermintaanBantahanAtasST.docx";
            }

            documentService = new DocumentService(templatePath + templateFileName);

            // Masa Pajak
            string masaPajak = "";
            string awalBulan = this.convertIntToMonth(permohonan.MasaPajakAwalBulan);
            string akhirBulan = this.convertIntToMonth(permohonan.MasaPajakAkhirBulan);

            if (awalBulan.Equals(akhirBulan))
            {
                masaPajak += awalBulan;
            }
            else
            {
                if (awalBulan != null || !awalBulan.Equals(""))
                {
                    masaPajak += awalBulan;

                    if (akhirBulan != null || !akhirBulan.Equals(""))
                    {
                        masaPajak += " s.d. " + akhirBulan;
                    }
                }
                else if (akhirBulan != null || !akhirBulan.Equals(""))
                {
                    masaPajak += akhirBulan;
                }
                else
                {
                    masaPajak += " - ";
                }
            }
            masaPajak += " Tahun: " + permohonan.MasaPajakAwalTahun;

            // Get Penandatangan
            string penandatanganObj = GetRefTTD(permohonan.RefTtdPermintaanBantahanId).Result;
            //string namaPenandatangan = "";
            //foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
            //{
            //    if (x.Length >= 2)
            //    {
            //        namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
            //    }
            //}

            // Termohon untuk Tembusan
            string tembusanTermohon = "";
            if (permohonan.RefTermohonId == 859)
            {
                tembusanTermohon = "Direktur Keberatan dan Banding DJP";
            }
            else if (permohonan.RefTermohonId == 7493)
            {
                tembusanTermohon = "Direktur  Peraturan dan Penerimaan Kepabeanan dan Cukai DJBC";
            }
            else
            {
                tembusanTermohon = "Pemerintah Daerah";
            }

            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"VarNoPermintaanBantahan", permohonan.NoSuratPermintaanBantahan },
                {"VarTglSuratPermintaan", DateTime.Parse(permohonan.TglSuratPermintaanBantahan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarSifat", "Segera" },
                {"VarNamaPemohon", permohonan.Nama },
                {"VarNPWP", permohonan.Npwp },
                {"VarAlamat", permohonan.AlamatKoresponden+" "+permohonan.KotaKoresponden },
                {"VarTermohon", permohonan.NamaTermohon },
                {"VarNoSubSt", permohonan.NoSubSt },
                {"VarTglSubSt", DateTime.Parse(permohonan.TglSubSt.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarNoSuratPermohonan", permohonan.NoSuratPermohonan },
                {"VarTglSuratPermohonan", DateTime.Parse(permohonan.TglSuratPermohonan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarNoKep", permohonan.NoKep },
                {"VarTglKep", DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarJenisKetetapan", permohonan.Uraian },
                {"VarMasaPajak", masaPajak },
                {"VarNoSkp", permohonan.NoSkp },
                {"VarTglSkp", DateTime.Parse(permohonan.TglSkp.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarNoSengketa", Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa) },
                {"VarPenandatangan", penandatanganObj.Split("/")[0] },
                //{"VarNamaPenandatangan", penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3] },
                {"VarNamaPenandatangan", penandatanganObj.Split("/")[1]},
                {"VarNIPPenandatangan", "NIP " + penandatanganObj.Split("/")[2] },
                {"VarTembusan", tembusanTermohon } // ditanyakan
        };


            documentService.Data = new DataField()
            {
                Data = DataPermohonan
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa + permohonan.NoSuratPermintaanBantahan + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

        [HttpGet("CetakPengirimanSalinan/{id}")]
        public async Task<IActionResult> CetakPengirimanSalinan([FromRoute] string id)
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
                    a.RefJenisPermohonanId,
                    a.NoSuratPermintaanSalinan,
                    a.TglSuratPermintaanSalinan,
                    a.RefTtdPermintaanSalinanId,
                    a.NoSubSt,
                    a.TglSubSt,
                    a.NamaTermohon,
                    a.NamaUpTermohon,
                    a.AlamatTermohon,
                    a.Pemohon.Nama,
                    a.Pemohon.Npwp,
                    a.Pemohon.AlamatKoresponden,
                    a.Pemohon.KotaKoresponden,
                    a.NoSuratBantahan,
                    a.NoSuratPermohonan,
                    a.TglSuratPermohonan,
                    a.NoKep,
                    a.TglKep,
                    a.RefJenisKetetapan.Uraian,
                    a.MasaPajakAwalBulan,
                    a.MasaPajakAkhirBulan,
                    a.MasaPajakAwalTahun,
                    a.NoSkp,
                    a.TglSkp,
                    a.NoSengketa
                }).FirstOrDefaultAsync();

            if (permohonan == null)
            {
                return NotFound();
            }

            var templateFileName = "";

            if (permohonan.RefJenisPermohonanId == 1)
            {
                templateFileName = "PengirimanSalinanBantahanAtasSUB.docx";
            }
            else
            {
                templateFileName = "PengirimanSalinanBantahanAtasST.docx";
            }

            documentService = new DocumentService(templatePath + templateFileName);

            // Masa Pajak
            string masaPajak = "";
            string awalBulan = this.convertIntToMonth(permohonan.MasaPajakAwalBulan);
            string akhirBulan = this.convertIntToMonth(permohonan.MasaPajakAkhirBulan);

            if (awalBulan.Equals(akhirBulan))
            {
                masaPajak += awalBulan;
            }
            else
            {
                if (awalBulan != null || !awalBulan.Equals(""))
                {
                    masaPajak += awalBulan;

                    if (akhirBulan != null || !akhirBulan.Equals(""))
                    {
                        masaPajak += " s.d. " + akhirBulan;
                    }
                }
                else if (akhirBulan != null || !akhirBulan.Equals(""))
                {
                    masaPajak += akhirBulan;
                }
                else
                {
                    masaPajak += " - ";
                }
            }
            masaPajak += " Tahun: " + permohonan.MasaPajakAwalTahun;

            // Get Penandatangan
            string penandatanganObj = GetRefTTD(permohonan.RefTtdPermintaanSalinanId).Result;
            //string namaPenandatangan = "";
            //foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
            //{
            //    if (x.Length >= 2)
            //    {
            //        namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
            //    }
            //}

            Dictionary<string, string> DataPermohonan = new Dictionary<string, string>() {
                {"VarNoPengirimanSalinan", permohonan.NoSuratPermintaanSalinan },
                {"VarTglSuratPengiriman", DateTime.Parse(permohonan.TglSuratPermintaanSalinan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarSifat", "Segera" },
                {"VarTermohon", permohonan.NamaTermohon },
                {"VarUpTermohon", permohonan.NamaUpTermohon },
                {"VarAlamatTermohon", permohonan.AlamatTermohon },
                {"VarNamaPemohon", permohonan.Nama },
                {"VarNoSuratBantahan", permohonan.NoSuratBantahan },
                {"VarNPWP", permohonan.Npwp },
                {"VarAlamatPemohon", permohonan.AlamatKoresponden+" "+permohonan.KotaKoresponden },
                {"VarNoSengketa", Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa) },
                {"VarNoSubSt", permohonan.NoSubSt },
                {"VarNoKep", permohonan.NoKep },
                {"VarTglKep", DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarJenisKetetapan", permohonan.Uraian },
                {"VarMasaPajak", masaPajak },
                {"VarNoSkp", permohonan.NoSkp },
                {"VarTglSkp", DateTime.Parse(permohonan.TglSkp.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) },
                {"VarPenandatangan", penandatanganObj.Split("/")[0] },
                //{"VarNamaPenandatangan", penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3] },
                {"VarNamaPenandatangan", penandatanganObj.Split("/")[1]},
                {"VarNIPPenandatangan", "NIP " + penandatanganObj.Split("/")[2] }
            };


            documentService.Data = new DataField()
            {
                Data = DataPermohonan
            };

            MemoryStream fileStream = documentService.GeneratePDF();
            return File(fileStream, "application/pdf", permohonan.NoSengketa + permohonan.NoSuratPermintaanSalinan + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");
        }

        //[Route("CetakTandaTerimaSuratPermohonan/{id}")]
        //[HttpGet]
        //public async Task<IActionResult> CetakTandaTerimaSuratPermohonan([FromRoute] string id)
        //{
        //    var permohonan = await _context.Permohonan
        //        .Where(a => a.PermohonanId == id)
        //        .Select(a => new
        //        {
        //            a.PermohonanId,
        //            a.RefJenisPermohonan.Uraian,
        //            a.NoTandaTerimaSubSt,
        //            a.RefTtdTandaTerimaId,
        //            a.NoSengketa,
        //            a.Pemohon.Npwp,
        //            a.Pemohon.Nama,
        //            a.Pemohon.Alamat,
        //            a.NoSuratPermohonan,
        //            a.TglSuratPermohonan,
        //            a.NoKep,
        //            a.TglKep,
        //            CaraKirim = a.RefCaraKirimPermohonan.Uraian,
        //            a.TglTerimaPermohonan
        //        }).FirstOrDefaultAsync();
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var templateURL = "assets\\Template\\TandaTerimaSuratPermohonan.docx";
        //    var tempFolder = "TempTandaTerimaSuratPermohonan";
        //    string penandatanganObj = GetRefTTD(permohonan.RefTtdTandaTerimaId).Result;
        //    byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, templateURL));

        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            //string varTipePermohonan = permohonan.Uraian;
        //            string varTipePermohonanUpperCase = permohonan.Uraian.ToUpper();
        //            string varTipePermohonanTitleCase = permohonan.Uraian.Substring(0, 1).ToUpper() + permohonan.Uraian.Substring(1).ToLower();
        //            string varTipePermohonanLowerCase = permohonan.Uraian.ToLower();
        //            string varTipePermohonanWithTer = "Ter" + permohonan.Uraian.ToLower();
        //            string varNoTandaTerimaSubSt = permohonan.NoTandaTerimaSubSt;
        //            string varNama = permohonan.Nama;
        //            string varNPWP = permohonan.Npwp;
        //            string varAlamat = permohonan.Alamat;
        //            string varNoSengketa = Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa);
        //            string varNoSuratBanding = permohonan.NoSuratPermohonan;
        //            string varTglSuratBanding = DateTime.Parse(permohonan.TglSuratPermohonan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            string varNoKep = permohonan.NoKep;
        //            string varTglKep = DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            string varCaraKirim = permohonan.CaraKirim;
        //            string varTglTerimaPermohonan = DateTime.Parse(permohonan.TglTerimaPermohonan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            string varTglServer = DateTime.Now.ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            // apply penandatangan
        //            string namaPenandatangan = "";
        //            foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
        //            {
        //                if (x.Length >= 2)
        //                {
        //                    namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
        //                }
        //            }
        //            string varPenandatangan = penandatanganObj.Split("/")[0];// [0] Panitera/Wakil Panitera
        //            string varNamaPenandatangan = penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3]; // [1] Gelar Depan; [3] Gelar Belakang
        //            string varNIPPenandatangan = "NIP " + penandatanganObj.Split("/")[4]; // [4] NIP18

        //            string[] allVars =
        //            {
        //                varTipePermohonanUpperCase
        //                ,varNoTandaTerimaSubSt
        //                ,varTipePermohonanTitleCase
        //                ,varNama
        //                ,varNPWP
        //                ,varAlamat
        //                ,varNoSuratBanding
        //                ,varTglSuratBanding
        //                ,varTipePermohonanLowerCase
        //                ,varTipePermohonanWithTer
        //                ,varNoKep
        //                ,varTglKep
        //                ,varCaraKirim
        //                ,varTglTerimaPermohonan
        //                ,varNoSengketa
        //                ,varTglServer
        //                ,varPenandatangan
        //                ,varNamaPenandatangan
        //                ,varNIPPenandatangan
        //            };
        //            string docText = null;

        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            string[] templateVariables =
        //            {
        //                "TIPEPERMOHONAN"
        //                ,"NoTandaTerima"
        //                ,"TipePermohonan"
        //                ,"NamaPemohon"
        //                ,"NPWPVar"
        //                ,"AlamatPemohon"
        //                ,"NoSuratPermohonan"
        //                ,"TglSuratPermohonan"
        //                ,"tipepermohonan"
        //                ,"Tertipepermohonan"
        //                ,"NoKep"
        //                ,"TglKep"
        //                ,"CaraKirim"
        //                ,"TglTerimaSurat"
        //                ,"NoSengketa"
        //                ,"TglServer"
        //                ,"VarPenandatangan"
        //                ,"NamaPenandatangan"
        //                ,"NIPPenandatangan"
        //            };

        //            Regex[] regexs = new Regex[templateVariables.Length];
        //            for (int i = 0; i < templateVariables.Length; i++)
        //            {
        //                regexs[i] = new Regex(templateVariables[i]);
        //                if (allVars[i] == null)
        //                {
        //                    docText = regexs[i].Replace(docText, "");
        //                }
        //                else
        //                {
        //                    docText = regexs[i].Replace(docText, allVars[i]);
        //                }
        //            }

        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);
        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder + "\\TempFile.docx")).Close();
        //        }
        //    }

        //    return this.convertToPdf(webRoot, tempFolder, "TandaTerimaSuratPermohonan.pdf");
        //}

        //[Route("CetakPermintaanBantahan/{id}")]
        //[HttpGet]
        //public async Task<IActionResult> CetakPermintaanBantahan([FromRoute] string id)
        //{

        //    var permohonan = await _context.Permohonan
        //        .Where(a => a.PermohonanId == id)
        //        .Select(a => new
        //        {
        //            a.PermohonanId,
        //            a.RefJenisPermohonanId,
        //            a.NoSuratPermintaanBantahan,
        //            a.TglSuratPermintaanBantahan,
        //            a.RefTtdPermintaanBantahanId,
        //            a.NoSubSt,
        //            a.TglSubSt,
        //            a.NamaTermohon,
        //            a.NamaUpTermohon,
        //            a.Pemohon.Nama,
        //            a.Pemohon.Npwp,
        //            a.Pemohon.Alamat,
        //            a.NoSuratPermohonan,
        //            a.TglSuratPermohonan,
        //            a.NoKep,
        //            a.TglKep,
        //            a.RefJenisKetetapan.Uraian,
        //            a.MasaPajakAwalBulan,// masa pajak
        //            a.MasaPajakAkhirBulan,
        //            a.MasaPajakAwalTahun,
        //            a.NoSkp,
        //            a.TglSkp,
        //            a.NoSengketa
        //        }).FirstOrDefaultAsync();
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var templateURL = "";
        //    var tempFolder = "";
        //    var returnFileName = "";
        //    string penandatanganObj = GetRefTTD(permohonan.RefTtdPermintaanBantahanId).Result;
        //    if (permohonan.RefJenisPermohonanId == 1)
        //    {
        //        templateURL = "assets\\Template\\PermintaanBantahanAtasSub.docx";
        //        tempFolder = "TempPermintaanBantahanAtasSub";
        //        returnFileName = "Permintaan Bantahan Atas SUB.pdf";
        //    }
        //    else
        //    {
        //        templateURL = "assets\\Template\\PermintaanBantahanAtasST.docx";
        //        tempFolder = "TempPermintaanBantahanAtasST";
        //        returnFileName = "Permintaan Bantahan Atas ST.pdf";
        //    }
        //    byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, templateURL));

        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            // TitleCase Nama Penandatangan
        //            string namaPenandatangan = "";
        //            foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
        //            {
        //                if (x.Length >= 2)
        //                {
        //                    namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
        //                }
        //            }

        //            // Masa Pajak
        //            string masaPajak = "";
        //            string awalBulan = this.convertIntToMonth(permohonan.MasaPajakAwalBulan);
        //            string akhirBulan = this.convertIntToMonth(permohonan.MasaPajakAkhirBulan);

        //            if (awalBulan.Equals(akhirBulan))
        //            {
        //                masaPajak += awalBulan;
        //            }
        //            else
        //            {
        //                if (awalBulan != null || !awalBulan.Equals(""))
        //                {
        //                    masaPajak += awalBulan;

        //                    if (akhirBulan != null || !akhirBulan.Equals(""))
        //                    {
        //                        masaPajak += " s.d. " + akhirBulan;
        //                    }
        //                }
        //                else if (akhirBulan != null || !akhirBulan.Equals(""))
        //                {
        //                    masaPajak += akhirBulan;
        //                }
        //                else
        //                {
        //                    masaPajak += " - ";
        //                }
        //            }

        //            masaPajak += " Tahun: " + permohonan.MasaPajakAwalTahun;


        //            string[] allVars =
        //            {
        //                permohonan.NoSuratPermintaanBantahan // VarNoPermintaanBantahan
        //                ,DateTime.Parse(permohonan.TglSuratPermintaanBantahan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglSuratPermintaan
        //                ,"Segera" // VarSifat
        //                ,permohonan.Nama // VarNama
        //                ,permohonan.Npwp // VarNPWP
        //                ,permohonan.Alamat // VarAlamat
        //                ,permohonan.NamaTermohon // VarTermohon
        //                ,permohonan.NoSubSt // VarNoSubSt
        //                ,DateTime.Parse(permohonan.TglSubSt.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglSubSt
        //                ,permohonan.NoSuratPermohonan // VarNoSuratPermohonan
        //                ,DateTime.Parse(permohonan.TglSuratPermohonan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglSuratPermohonan
        //                ,permohonan.NoKep // VarNoKep
        //                ,DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglKep
        //                ,permohonan.Uraian // VarJenisKetetapan
        //                ,masaPajak // VarMasaPajak
        //                ,permohonan.NoSkp // VarNoSkp
        //                ,DateTime.Parse(permohonan.TglSkp.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglSkp
        //                ,Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa) // VarNoSengketa
        //                ,penandatanganObj.Split("/")[0] // [0] Panitera/Wakil Panitera // VarPenandatangan
        //                ,penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3] // [1] Gelar Depan; [3] Gelar Belakang // VarNamaPenandatangan
        //                ,"NIP " + penandatanganObj.Split("/")[4] // [4] NIP18 // VarNIPPenandatangan
        //                ,"Tembusan" // VarTembusan
        //        };
        //            string docText = null;

        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            string[] templateVariables =
        //            {
        //                "VarNoPermintaanBantahan"
        //                ,"VarTglSuratPermintaan"
        //                ,"VarSifat"
        //                ,"VarNamaPemohon"
        //                ,"VarNPWP"
        //                ,"VarAlamat"
        //                ,"VarTermohon"
        //                ,"VarNoSubSt"
        //                ,"VarTglSubSt"
        //                ,"VarNoSuratPermohonan"
        //                ,"VarTglSuratPermohonan"
        //                ,"VarNoKep"
        //                ,"VarTglKep"
        //                ,"VarJenisKetetapan "
        //                ,"VarMasaPajak"
        //                ,"VarNoSkp"
        //                ,"VarTglSkp"
        //                ,"VarNoSengketa"
        //                ,"VarPenandatangan"
        //                ,"VarNamaPenandatangan"
        //                ,"VarNIPPenandatangan"
        //                ,"VarTembusan"
        //            };

        //            Regex[] regexs = new Regex[templateVariables.Length];
        //            for (int i = 0; i < templateVariables.Length; i++)
        //            {
        //                regexs[i] = new Regex(templateVariables[i]);
        //                if (allVars[i] == null)
        //                {
        //                    docText = regexs[i].Replace(docText, "");
        //                }
        //                else
        //                {
        //                    docText = regexs[i].Replace(docText, allVars[i]);
        //                }
        //            }

        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);
        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder + "\\TempFile.docx")).Close();

        //        }
        //    }
        //    return this.convertToPdf(webRoot, tempFolder, returnFileName);
        //}

        //[Route("CetakPermintaanSubSt/{id}")]
        //[HttpGet]
        //public async Task<IActionResult> CetakPermintaanSubSt([FromRoute] string id)
        //{

        //    var permohonan = await _context.Permohonan
        //        .Where(a => a.PermohonanId == id)
        //        .Select(a => new
        //        {
        //            a.PermohonanId,
        //            a.RefJenisPermohonanId,
        //            a.NoSuratPermintaanSubSt,
        //            a.TglSuratPermintaanSubSt,
        //            a.RefTtdPermintaanSubStId,
        //            a.NamaTermohon,
        //            a.NamaUpTermohon,
        //            a.AlamatTermohon,
        //            a.Pemohon.Nama,
        //            a.Pemohon.Npwp,
        //            a.Pemohon.Alamat,
        //            a.NoSuratPermohonan,
        //            a.TglSuratPermohonan,
        //            a.NoKep,
        //            a.TglKep,
        //            a.RefJenisKetetapan.Uraian,
        //            a.MasaPajakAwalBulan,
        //            a.MasaPajakAkhirBulan,
        //            a.MasaPajakAwalTahun,
        //            a.NoSkp,
        //            a.TglSkp,
        //            a.NoSengketa,
        //            // kurang penandatangan
        //        }).FirstOrDefaultAsync();
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var templateURL = "";
        //    var tempFolder = "";
        //    var returnFileName = "";
        //    string penandatanganObj = GetRefTTD(permohonan.RefTtdPermintaanSubStId).Result;
        //    if (permohonan.RefJenisPermohonanId == 1)
        //    {
        //        templateURL = "assets\\Template\\PermintaanSub.docx";
        //        tempFolder = "TempPermintaanSub";
        //        returnFileName = "Permintaan SUB.pdf";
        //    }
        //    else
        //    {
        //        templateURL = "assets\\Template\\PermintaanST.docx";
        //        tempFolder = "TempPermintaanST";
        //        returnFileName = "Permintaan ST.pdf";
        //    }
        //    byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, templateURL));

        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            // Masa Pajak
        //            string masaPajak = "";
        //            string awalBulan = this.convertIntToMonth(permohonan.MasaPajakAwalBulan);
        //            string akhirBulan = this.convertIntToMonth(permohonan.MasaPajakAkhirBulan);

        //            if (awalBulan.Equals(akhirBulan))
        //            {
        //                masaPajak += awalBulan;
        //            }
        //            else
        //            {
        //                if (awalBulan != null || !awalBulan.Equals(""))
        //                {
        //                    masaPajak += awalBulan;

        //                    if (akhirBulan != null || !akhirBulan.Equals(""))
        //                    {
        //                        masaPajak += " s.d. " + akhirBulan;
        //                    }
        //                }
        //                else if (akhirBulan != null || !akhirBulan.Equals(""))
        //                {
        //                    masaPajak += akhirBulan;
        //                }
        //                else
        //                {
        //                    masaPajak += " - ";
        //                }
        //            }
        //            masaPajak += " Tahun: " + permohonan.MasaPajakAwalTahun;

        //            //string varTipePermohonan = permohonan.Uraian;
        //            string varNoPermintaanSub = permohonan.NoSuratPermintaanSubSt;
        //            string varTglSuratPermintaan = DateTime.Parse(permohonan.TglSuratPermintaanSubSt.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            string varSifat = "Segera"; // masih perlu ditanyakan
        //            string varNamaTermohon = permohonan.NamaTermohon;
        //            string varNamaUpTermohon = permohonan.NamaUpTermohon;
        //            string varAlamatTermohon = permohonan.AlamatTermohon;
        //            string varNamaPemohon = permohonan.Nama;
        //            string varNpwp = permohonan.Npwp;
        //            string varAlamatPemohon = permohonan.Alamat;
        //            string varNoSuratPermohonan = permohonan.NoSuratPermohonan;
        //            string varNoKep = permohonan.NoKep;
        //            string varTglKep = DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            string varJenisKetetapan = permohonan.Uraian;
        //            string varMasaPajak = masaPajak;
        //            string varNoSkp = permohonan.NoSkp;
        //            string varTglSkp = DateTime.Parse(permohonan.TglSkp.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id"));
        //            string varNoSengketa = Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa);
        //            // apply penandatangan
        //            string namaPenandatangan = "";
        //            foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
        //            {
        //                if (x.Length >= 2)
        //                {
        //                    namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
        //                }
        //            }
        //            string varPenandatangan = penandatanganObj.Split("/")[0];// [0] Panitera/Wakil Panitera
        //            string varNamaPenandatangan = penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3]; // [1] Gelar Depan; [3] Gelar Belakang
        //            string varNIPPenandatangan = "NIP " + penandatanganObj.Split("/")[4]; // [4] NIP18

        //            string varTembusan = "Tembusan Kedua"; // ditanyakan

        //            string[] allVars =
        //            {
        //                varNoPermintaanSub
        //                ,varTglSuratPermintaan
        //                ,varSifat
        //                ,varNamaTermohon
        //                ,varNamaUpTermohon
        //                ,varAlamatTermohon
        //                ,varNamaPemohon
        //                ,varNpwp
        //                ,varAlamatPemohon
        //                ,varNoSuratPermohonan
        //                ,varNoKep
        //                ,varTglKep
        //                ,varJenisKetetapan
        //                ,varMasaPajak
        //                ,varNoSkp
        //                ,varTglSkp
        //                ,varNoSengketa
        //                ,varPenandatangan
        //                ,varNamaPenandatangan
        //                ,varNIPPenandatangan
        //                ,varTembusan
        //            };
        //            string docText = null;

        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            string[] templateVariables =
        //            {
        //                "VarNoPermintaan"
        //                ,"VarTglSuratPermintaan"
        //                ,"VarSifat"
        //                ,"VarNamaTermohon"
        //                ,"VarNamaUpTermohon"
        //                ,"VarAlamatTermohon"
        //                ,"VarNamaPemohon"
        //                ,"VarNPWP"
        //                ,"VarAlamatPemohon"
        //                ,"VarNoSuratPermohonan"
        //                ,"VarNoKep"
        //                ,"VarTglKep"
        //                ,"VarJenisKetetapan "
        //                ,"VarMasaPajak"
        //                ,"VarNoSkp"
        //                ,"VarTglSkp"
        //                ,"VarNoSengketa"
        //                ,"VarPenandatangan"
        //                ,"VarNamaPenandatangan"
        //                ,"VarNIPPenandatangan"
        //                ,"VarTembusan"
        //            };

        //            Regex[] regexs = new Regex[templateVariables.Length];
        //            for (int i = 0; i < templateVariables.Length; i++)
        //            {
        //                regexs[i] = new Regex(templateVariables[i]);
        //                if (allVars[i] == null)
        //                {
        //                    docText = regexs[i].Replace(docText, "");
        //                }
        //                else
        //                {
        //                    docText = regexs[i].Replace(docText, allVars[i]);
        //                }
        //            }

        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);
        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder + "\\TempFile.docx")).Close();

        //        }
        //    }
        //    return this.convertToPdf(webRoot, tempFolder, returnFileName);
        //}

        //[Route("CetakPengirimanSalinan/{id}")]
        //[HttpGet]
        //public async Task<IActionResult> CetakPengirimanSalinan([FromRoute] string id)
        //{

        //    var permohonan = await _context.Permohonan
        //        .Where(a => a.PermohonanId == id)
        //        .Select(a => new
        //        {
        //            a.PermohonanId,
        //            a.RefJenisPermohonanId,
        //            a.NoSuratPermintaanSalinan,
        //            a.TglSuratPermintaanSalinan,
        //            a.RefTtdPermintaanSalinanId,
        //            a.NoSubSt,
        //            a.TglSubSt,
        //            a.NamaTermohon,
        //            a.NamaUpTermohon,
        //            a.AlamatTermohon,
        //            a.Pemohon.Nama,
        //            a.Pemohon.Npwp,
        //            a.Pemohon.Alamat,
        //            a.NoSuratBantahan,
        //            a.NoSuratPermohonan,
        //            a.TglSuratPermohonan,
        //            a.NoKep,
        //            a.TglKep,
        //            a.RefJenisKetetapan.Uraian,
        //            a.MasaPajakAwalBulan,
        //            a.MasaPajakAkhirBulan,
        //            a.MasaPajakAwalTahun,
        //            a.NoSkp,
        //            a.TglSkp,
        //            a.NoSengketa,
        //            // kurang penandatangan
        //        }).FirstOrDefaultAsync();
        //    var webRoot = _hostingEnvironment.WebRootPath;
        //    var templateURL = "";
        //    var tempFolder = "";
        //    var returnFileName = "";
        //    string penandatanganObj = GetRefTTD(permohonan.RefTtdPermintaanSalinanId).Result;
        //    if (permohonan.RefJenisPermohonanId == 1)
        //    {
        //        templateURL = "assets\\Template\\PengirimanSalinanBantahanAtasSUB.docx";
        //        tempFolder = "TempPengirimanSalinanBantahanAtasSUB";
        //        returnFileName = "Pengiriman Salinan Bantahan Atas SUB.pdf";
        //    }
        //    else
        //    {
        //        templateURL = "assets\\Template\\PengirimanSalinanBantahanAtasST.docx";
        //        tempFolder = "TempPengirimanSalinanBantahanAtasST";
        //        returnFileName = "Pengiriman Salinan Bantahan Atas ST.pdf";
        //    }
        //    byte[] byteArray = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, templateURL));

        //    using (MemoryStream mem = new MemoryStream())
        //    {
        //        mem.Write(byteArray, 0, (int)byteArray.Length);
        //        using (WordprocessingDocument wordprocessingDocument = WordprocessingDocument.Open(mem, true))
        //        {
        //            // TitleCase
        //            string namaPenandatangan = "";
        //            foreach (string x in penandatanganObj.Split("/")[2].Split(" "))// [2] Nama Penandatangan dibuat TitleCase
        //            {
        //                if (x.Length >= 2)
        //                {
        //                    namaPenandatangan += x.Substring(0, 1).ToUpper() + x.Substring(1).ToLower() + " ";
        //                }
        //            }

        //            // Masa Pajak
        //            string masaPajak = "";
        //            string awalBulan = this.convertIntToMonth(permohonan.MasaPajakAwalBulan);
        //            string akhirBulan = this.convertIntToMonth(permohonan.MasaPajakAkhirBulan);

        //            if (awalBulan.Equals(akhirBulan))
        //            {
        //                masaPajak += awalBulan;
        //            }
        //            else
        //            {
        //                if (awalBulan != null || !awalBulan.Equals(""))
        //                {
        //                    masaPajak += awalBulan;

        //                    if (akhirBulan != null || !akhirBulan.Equals(""))
        //                    {
        //                        masaPajak += " s.d. " + akhirBulan;
        //                    }
        //                }
        //                else if (akhirBulan != null || !akhirBulan.Equals(""))
        //                {
        //                    masaPajak += akhirBulan;
        //                }
        //                else
        //                {
        //                    masaPajak += " - ";
        //                }
        //            }

        //            masaPajak += " Tahun: " + permohonan.MasaPajakAwalTahun;

        //            string[] allVars =
        //            {
        //                permohonan.NoSuratPermintaanSalinan // VarNoPengirimanSalinan
        //                ,DateTime.Parse(permohonan.TglSuratPermintaanSalinan.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglSuratPengiriman
        //                ,"Segera" // VarSifat
        //                ,permohonan.NamaTermohon // VarTermohon
        //                ,permohonan.NamaUpTermohon // VarUpTermohon
        //                ,permohonan.AlamatTermohon // VarAlamatTermohon
        //                ,permohonan.Nama // VarNamaPemohon
        //                ,permohonan.NoSuratBantahan // VarNoSuratBantahan
        //                ,permohonan.Npwp // VarNPWP
        //                ,permohonan.Alamat // VarAlamatPemohon
        //                ,Utility.Util.GetFormatNomorSengketa(permohonan.NoSengketa) // VarNoSengketa
        //                ,permohonan.NoSubSt // VarNoSubSt
        //                ,permohonan.NoKep // VarNoKep
        //                ,DateTime.Parse(permohonan.TglKep.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglKep
        //                ,permohonan.Uraian // VarJenisKetetapan
        //                ,masaPajak // VarMasaPajak
        //                ,permohonan.NoSkp /// VarNoSkp
        //                ,DateTime.Parse(permohonan.TglSkp.ToString()).ToString("dd MMMM yyyy", new CultureInfo("id")) // VarTglSkp
        //                ,penandatanganObj.Split("/")[0] // [0] Panitera/Wakil Panitera // VarPenandatangan
        //                ,penandatanganObj.Split("/")[1] + " " + namaPenandatangan.Trim() + penandatanganObj.Split("/")[3] // [1] Gelar Depan; [3] Gelar Belakang // VarNamaPenandatangan
        //                ,"NIP " + penandatanganObj.Split("/")[4] // [4] NIP18 // VarNIPPenandatangan
        //            };
        //            string docText = null;

        //            using (StreamReader sr = new StreamReader(wordprocessingDocument.MainDocumentPart.GetStream()))
        //            {
        //                docText = sr.ReadToEnd();
        //            }

        //            string[] templateVariables =
        //            {
        //                "VarNoPengirimanSalinan"
        //                ,"VarTglSuratPengiriman"
        //                ,"VarSifat"
        //                ,"VarTermohon"
        //                ,"VarUpTermohon"
        //                ,"VarAlamatTermohon"
        //                ,"VarNamaPemohon"
        //                ,"VarNoSuratBantahan"
        //                ,"VarNPWP"
        //                ,"VarAlamatPemohon"
        //                ,"VarNoSengketa"
        //                ,"VarNoSubSt"
        //                ,"VarNoKep"
        //                ,"VarTglKep"
        //                ,"VarJenisKetetapan "
        //                ,"VarMasaPajak"
        //                ,"VarNoSkp"
        //                ,"VarTglSkp"
        //                ,"VarPenandatangan"
        //                ,"VarNamaPenandatangan"
        //                ,"VarNIPPenandatangan"
        //            };

        //            Regex[] regexs = new Regex[templateVariables.Length];
        //            for (int i = 0; i < templateVariables.Length; i++)
        //            {
        //                regexs[i] = new Regex(templateVariables[i]);
        //                if (allVars[i] == null)
        //                {
        //                    docText = regexs[i].Replace(docText, "");
        //                }
        //                else
        //                {
        //                    docText = regexs[i].Replace(docText, allVars[i]);
        //                }
        //            }

        //            using (StreamWriter sw = new StreamWriter(wordprocessingDocument.MainDocumentPart.GetStream(FileMode.Create)))
        //            {
        //                sw.Write(docText);
        //            }

        //            wordprocessingDocument.SaveAs(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder + "\\TempFile.docx")).Close();

        //        }
        //    }
        //    return this.convertToPdf(webRoot, tempFolder, returnFileName);
        //}

        //private FileContentResult convertToPdf(string webRoot, string tempFolder, string returnFileName)
        //{
        //    Application word = new Application();

        //    // C# doesn't have optional arguments so we'll need a dummy value
        //    object oMissing = System.Reflection.Missing.Value;

        //    // Get list of Word files in specified directory
        //    DirectoryInfo dirInfo = new DirectoryInfo(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder));
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
        //    byte[] fileBytes = System.IO.File.ReadAllBytes(System.IO.Path.Combine(webRoot, "assets\\" + tempFolder + "\\TempFile.pdf"));
        //    return File(fileBytes, "application/pdf", returnFileName);
        //}

        // RefTermohon --> harus dipindah ke RefTermohonController, di sini cuma coba
        // GET: api/GetDataTermohon
        [Route("GetDataTermohon")]
        [HttpGet]
        public IEnumerable<RefKodeTermohon> GetDataTermohon()
        {
            return _context.RefKodeTermohon;
        }

        [Route("GetProvinsi")]
        [HttpGet]
        public async Task<IActionResult> GetProvinsi()
        {
            //string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
            await GetAccessToken();
            return Json(await this.GetAllProvinsi());
        }
        [Route("GetKota")]
        [HttpGet]
        public async Task<IActionResult> GetKota()
        {
            //string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
            await GetAccessToken();
            return Json(await this.GetAllKota());
        }
        [Route("GetKotaByID/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetKotaByID([FromRoute] int id)
        {
            //string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
            await GetAccessToken();
            return Json(await this.GetKotaByIDhelper(id));
        }
        [Route("GetProvinsiByID/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetProvinsiByID([FromRoute] int id)
        {
            //string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
            await GetAccessToken();
            return Json(await this.GetProvinsiByIDhelper(id));
        }
        [Route("GetKotaByProvinsiID/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetKotaByProvinsiID([FromRoute] int id)
        {
            await GetAccessToken();
            //string accessToken = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")).Value.ToString();
            return Json(await this.GetKotaByProvinsi(id));
        }

        #region KsbControllerRegion
        //~ get pegawai info - taken from KsbController
        private async Task<PegawaiInfo> GetPegawaiByID(string id, string accessToken)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/pegawai/GetPegawaiByID/" + id;

            PegawaiInfo _pegawaiInfo = new PegawaiInfo();

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    _pegawaiInfo = JsonConvert.DeserializeObject<PegawaiInfo>(response);
                    return _pegawaiInfo;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return _pegawaiInfo;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefProvinsi>> GetAllProvinsi()
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetAllProvinsi";

            IEnumerable<Hr_RefProvinsi> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefProvinsi>>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefKota>> GetAllKota()
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetAllKota";

            IEnumerable<Hr_RefKota> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefKota>>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<IEnumerable<Hr_RefKota>> GetKotaByProvinsi(int id)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetAllKota";

            IEnumerable<Hr_RefKota> result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<IEnumerable<Hr_RefKota>>(response);
                    return result.Where(a => a.IDRefProvinsi == id);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<Hr_RefKota> GetKotaByIDhelper(int id)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetKotaByID/" + id;

            Hr_RefKota result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<Hr_RefKota>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        private async Task<Hr_RefProvinsi> GetProvinsiByIDhelper(int id)
        {
            string ksbUrl = Configuration["KSB:URL"];
            string uri = "/hris/api/kota/GetProvinsiByID/" + id;

            Hr_RefProvinsi result = null;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.GetStringAsync(ksbUrl + uri);
                    result = JsonConvert.DeserializeObject<Hr_RefProvinsi>(response);
                    return result;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return result;
                }
            }
        }

        //~ model pegawaiInfo got from ksb
        //~ need to be updated on change
        private class PegawaiInfo
        {
            public string GelarBelakang { get; set; }
            public string GelarDepan { get; set; }
            public int IDPegawai { get; set; }
            public string Nama { get; set; }
            public string NIP18 { get; set; }
        }

        // model provinsi
        private class Hr_RefProvinsi
        {
            public int IDRefProvinsi { get; set; }
            public string KodeProvinsi { get; set; }
            public string NamaIbukotaProvinsi { get; set; }
            public string NamaProvinsi { get; set; }
        }

        // model kota
        private class Hr_RefKota
        {
            public int IDRefKota { get; set; }
            public int? IDRefProvinsi { get; set; }
            public string KodeKota { get; set; }
            public string NamaKota { get; set; }
        }

        private async Task GetAccessToken()
        {
            var accTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken"));
            if (accTokenClaim != null)
            {
                accessToken = accTokenClaim.Value;
            }
            else
            {
                await GetNewAccessToken();
            }
            //bool isValid = await AccessTokenIsValid(accessToken);
            //if (!isValid)
            //{
            //    GetNewAccessToken();
            //}
        }

        private void GetRefreshToken()
        {
            var refreshTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("refreshToken"));
            if (refreshTokenClaim != null)
            {
                refreshToken = refreshTokenClaim.Value;
            }
        }

        private async Task GetNewAccessToken()
        {
            GetRefreshToken();
            string requestBody = "client_id=devapps&client_secret=1234&grant_type=refresh_token&refresh_token=" + refreshToken;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(requestBody, Encoding.UTF8, "application/x-www-form-urlencoded");
                    var response = await client.PostAsync(sSOUrl + "/oauth/token", content);
                    var data = await response.Content.ReadAsStringAsync();
                    var dict = JsonConvert.DeserializeObject<OauthToken>(data);
                    // update access token
                    accessToken = dict.access_token;
                    //((ClaimsIdentity)User.Identity).RemoveClaim(User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")));
                    ((ClaimsIdentity)User.Identity).AddClaim(new Claim("accessToken", accessToken));
                }
                catch (Exception e)
                {
                    var message = e.Message;
                }
            }
        }

        private async Task<bool> AccessTokenIsValid(string paramAccessToken)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", paramAccessToken);
                var response = await client.GetAsync("http://api.kemenkeu.go.id/api/Values/Get");
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        private class OauthToken
        {
            public string access_token { get; set; }
            public string expires_in { get; set; }
            public string refresh_token { get; set; }
        }
        #endregion
    }
}