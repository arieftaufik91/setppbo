using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SETPPBO.Models
{
    public partial class MainDbContext : DbContext
    {
        public virtual DbSet<AspNetRoleClaims> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<AspNetUserTokens> AspNetUserTokens { get; set; }
        public virtual DbSet<Audit> Audit { get; set; }
        public virtual DbSet<DataTambahan> DataTambahan { get; set; }
        public virtual DbSet<Kelengkapan> Kelengkapan { get; set; }
        public virtual DbSet<LogError> LogError { get; set; }
        public virtual DbSet<Pemohon> Pemohon { get; set; }
        public virtual DbSet<PemohonMajelis> PemohonMajelis { get; set; }
        public virtual DbSet<Penomoran> Penomoran { get; set; }
        public virtual DbSet<Permohonan> Permohonan { get; set; }
        public virtual DbSet<RefAlasan> RefAlasan { get; set; }
        public virtual DbSet<RefCaraKirim> RefCaraKirim { get; set; }
        public virtual DbSet<RefConfig> RefConfig { get; set; }
        public virtual DbSet<RefDokumen> RefDokumen { get; set; }
        public virtual DbSet<RefHakim> RefHakim { get; set; }
        public virtual DbSet<RefJenisKasus> RefJenisKasus { get; set; }
        public virtual DbSet<RefJenisKetetapan> RefJenisKetetapan { get; set; }
        public virtual DbSet<RefJenisNormaWaktu> RefJenisNormaWaktu { get; set; }
        public virtual DbSet<RefJenisPajak> RefJenisPajak { get; set; }
        public virtual DbSet<RefJenisPemeriksaan> RefJenisPemeriksaan { get; set; }
        public virtual DbSet<RefJenisPenomoran> RefJenisPenomoran { get; set; }
        public virtual DbSet<RefJenisPermohonan> RefJenisPermohonan { get; set; }
        public virtual DbSet<RefKodeTermohon> RefKodeTermohon { get; set; }
        public virtual DbSet<RefMajelis> RefMajelis { get; set; }
        public virtual DbSet<RefNormaWaktu> RefNormaWaktu { get; set; }
        public virtual DbSet<RefStatus> RefStatus { get; set; }
        public virtual DbSet<RefTemplate> RefTemplate { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<SampleData> SampleData { get; set; }
        public virtual DbSet<SuratPengantar> SuratPengantar { get; set; }
        public virtual DbSet<SysMenu> SysMenu { get; set; }
        public virtual DbSet<UserRole> UserRole { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer(@"Server=localhost;Database=setpp;Trusted_Connection=True;");
            }
        }

        public MainDbContext(DbContextOptions<MainDbContext> options)
          : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRoleClaims>(entity =>
            {
                entity.HasIndex(e => e.RoleId);

                entity.Property(e => e.RoleId).IsRequired();

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName)
                    .HasName("RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserClaims>(entity =>
            {
                entity.HasIndex(e => e.UserId);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasIndex(e => e.RoleId);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserTokens>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<Audit>(entity =>
            {
                entity.Property(e => e.AuditId).HasColumnName("AuditID");

                entity.Property(e => e.CompIp)
                    .HasColumnName("CompIP")
                    .HasMaxLength(45)
                    .IsUnicode(false);

                entity.Property(e => e.CompMacAddress)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.CompName)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.LogDate).HasColumnType("datetime");

                entity.Property(e => e.Method)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.NewValue).IsUnicode(false);

                entity.Property(e => e.OldValue).IsUnicode(false);

                entity.Property(e => e.PermohonanId)
                    .HasColumnName("PermohonanID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.StringUrl)
                    .IsRequired()
                    .HasMaxLength(2048)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnName("UserID")
                    .HasMaxLength(36)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<DataTambahan>(entity =>
            {
                entity.Property(e => e.DataTambahanId)
                    .HasColumnName("DataTambahanID")
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FileId)
                    .IsRequired()
                    .HasColumnName("FileID")
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.Keterangan)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.PermohonanId)
                    .IsRequired()
                    .HasColumnName("PermohonanID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.SuratPengantarId)
                    .HasColumnName("SuratPengantarID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.TglValidasi).HasColumnType("datetime");

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.Uraian)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.Valid).HasDefaultValueSql("((0))");

                entity.Property(e => e.ValidatorId).HasColumnName("ValidatorID");

                entity.HasOne(d => d.Permohonan)
                    .WithMany(p => p.DataTambahan)
                    .HasForeignKey(d => d.PermohonanId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DataTambahan_PermohonanID");

                entity.HasOne(d => d.SuratPengantar)
                    .WithMany(p => p.DataTambahan)
                    .HasForeignKey(d => d.SuratPengantarId)
                    .HasConstraintName("FK_DataTambahan_SuratPengantarID");
            });

            modelBuilder.Entity<Kelengkapan>(entity =>
            {
                entity.Property(e => e.KelengkapanId)
                    .HasColumnName("KelengkapanID")
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FileId)
                    .HasColumnName("FileID")
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.Keterangan)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.PermohonanId)
                    .IsRequired()
                    .HasColumnName("PermohonanID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.RefDokumenId).HasColumnName("RefDokumenID");

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.Uraian)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.Valid).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Permohonan)
                    .WithMany(p => p.Kelengkapan)
                    .HasForeignKey(d => d.PermohonanId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Kelengkapan_PermohonanID");

                entity.HasOne(d => d.RefDokumen)
                    .WithMany(p => p.Kelengkapan)
                    .HasForeignKey(d => d.RefDokumenId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Kelengkapan_RefDokumenID");
            });

            modelBuilder.Entity<LogError>(entity =>
            {
                entity.Property(e => e.LogErrorId).HasColumnName("LogErrorID");

                entity.Property(e => e.CompIp)
                    .HasColumnName("CompIP")
                    .HasMaxLength(45)
                    .IsUnicode(false);

                entity.Property(e => e.CompMacAddress)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.CompName)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.LogDate).HasColumnType("datetime");

                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.Method)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.StringUrl)
                    .IsRequired()
                    .HasMaxLength(2048)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnName("UserID")
                    .HasMaxLength(36)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Pemohon>(entity =>
            {
                entity.Property(e => e.PemohonId)
                    .HasColumnName("PemohonID")
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.Alamat)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.AlamatKoresponden)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.ContactPerson)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Email)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.KodePos)
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.KodePosKoresponden)
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.KodeVerifikasi)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.Kota)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.KotaKoresponden)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.Nama)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.Npwp)
                    .IsRequired()
                    .HasColumnName("NPWP")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.NpwpfileId)
                    .HasColumnName("NPWPFileID")
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.RefKotaId).HasColumnName("RefKotaID");

                entity.Property(e => e.RefKotaKorespondenId).HasColumnName("RefKotaKorespondenID");

                entity.Property(e => e.Status).HasDefaultValueSql("((0))");

                entity.Property(e => e.TglKodeVerifikasi).HasColumnType("datetime");

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<PemohonMajelis>(entity =>
            {
                entity.Property(e => e.PemohonMajelisId).HasColumnName("PemohonMajelisID");

                entity.Property(e => e.PemohonId)
                    .IsRequired()
                    .HasColumnName("PemohonID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.RefMajelisId).HasColumnName("RefMajelisID");

                entity.HasOne(d => d.Pemohon)
                    .WithMany(p => p.PemohonMajelis)
                    .HasForeignKey(d => d.PemohonId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PemohonMajelis_PemohonID");

                entity.HasOne(d => d.RefMajelis)
                    .WithMany(p => p.PemohonMajelis)
                    .HasForeignKey(d => d.RefMajelisId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PemohonMajelis_RefMajelisID");
            });

            modelBuilder.Entity<Penomoran>(entity =>
            {
                entity.Property(e => e.PenomoranId).HasColumnName("PenomoranID");

                entity.Property(e => e.KodeOrganisasi)
                    .IsRequired()
                    .HasMaxLength(12)
                    .IsUnicode(false);

                entity.Property(e => e.NamaOrganisasi)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.OrganisasiId).HasColumnName("OrganisasiID");

                entity.Property(e => e.RefJenisPenomoranId).HasColumnName("RefJenisPenomoranID");

                entity.HasOne(d => d.RefJenisPenomoran)
                    .WithMany(p => p.Penomoran)
                    .HasForeignKey(d => d.RefJenisPenomoranId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Penomoran_RefJenisPenomoranID");
            });

            modelBuilder.Entity<Permohonan>(entity =>
            {
                entity.HasIndex(e => e.NoKep)
                    .HasName("IX_Permohonan")
                    .IsUnique();

                entity.Property(e => e.PermohonanId)
                    .HasColumnName("PermohonanID")
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.AktaPerusahaan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.AlamatPengirimSubSt)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.AlamatTermohon)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FileDocBantahan)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FileDocSubSt)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FileDocSuratPermohonan)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfBantahan)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfBuktiBayar)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfObjekSengketa)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfSkk)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfSkp)
                    .HasColumnName("FilePdfSKP")
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfSubSt)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePdfSuratPermohonan)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.FilePencabutan)
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.KeteranganPenunjukan)
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.KodePosPengirimSubSt)
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.KotaPengirimSubSt)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.KotaTermohon)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.NamaPengirimSubSt)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NamaTermohon)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NamaUpTermohon)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoDistribusiBerkas)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoKep)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoObjekSengketa)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoPendaftaran)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoPenetapan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoPenetapanAc)
                    .HasColumnName("NoPenetapanAC")
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoPenetapanPencabutan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSengketa)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSkp)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSubSt)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSuratBantahan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSuratPencabutan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSuratPermintaanBantahan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSuratPermintaanSalinan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSuratPermintaanSubSt)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoSuratPermohonan)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NoTandaTerimaSubSt)
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.Npwp)
                    .IsRequired()
                    .HasColumnName("NPWP")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.PegawaiId).HasColumnName("PegawaiID");

                entity.Property(e => e.PemeriksaId).HasColumnName("PemeriksaID");

                entity.Property(e => e.PemohonId)
                    .HasColumnName("PemohonID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.PerekamBantahanId).HasColumnName("PerekamBantahanID");

                entity.Property(e => e.PerekamPencabutanId).HasColumnName("PerekamPencabutanID");

                entity.Property(e => e.PerekamPermintaanBantahanId).HasColumnName("PerekamPermintaanBantahanID");

                entity.Property(e => e.PerekamPermintaanSalinanId).HasColumnName("PerekamPermintaanSalinanID");

                entity.Property(e => e.PerekamSubStId).HasColumnName("PerekamSubStID");

                entity.Property(e => e.PerekamTandaTerimaPermintaanId).HasColumnName("PerekamTandaTerimaPermintaanID");

                entity.Property(e => e.RefCaraKirimBantahanId).HasColumnName("RefCaraKirimBantahanID");

                entity.Property(e => e.RefCaraKirimPencabutanId).HasColumnName("RefCaraKirimPencabutanID");

                entity.Property(e => e.RefCaraKirimPermohonanId).HasColumnName("RefCaraKirimPermohonanID");

                entity.Property(e => e.RefCaraKirimSubStId).HasColumnName("RefCaraKirimSubStID");

                entity.Property(e => e.RefJenisKetetapanId).HasColumnName("RefJenisKetetapanID");

                entity.Property(e => e.RefJenisPajakId).HasColumnName("RefJenisPajakID");

                entity.Property(e => e.RefJenisPemeriksaanId).HasColumnName("RefJenisPemeriksaanID");

                entity.Property(e => e.RefJenisPermohonanId).HasColumnName("RefJenisPermohonanID");

                entity.Property(e => e.RefKotaTermohonId).HasColumnName("RefKotaTermohonID");

                entity.Property(e => e.RefMajelisBebanId).HasColumnName("RefMajelisBebanID");

                entity.Property(e => e.RefMajelisHistoriId).HasColumnName("RefMajelisHistoriID");

                entity.Property(e => e.RefMajelisPenunjukanId).HasColumnName("RefMajelisPenunjukanID");

                entity.Property(e => e.RefMajelisPenunjukanIdac).HasColumnName("RefMajelisPenunjukanIDAC");

                entity.Property(e => e.RefPembagianBerkasId).HasColumnName("RefPembagianBerkasID");

                entity.Property(e => e.RefPengirimSubStId).HasColumnName("RefPengirimSubStID");

                entity.Property(e => e.RefStatusId).HasColumnName("RefStatusID");

                entity.Property(e => e.RefTermohonId).HasColumnName("RefTermohonID");

                entity.Property(e => e.RefTtdPermintaanBantahanId).HasColumnName("RefTtdPermintaanBantahanID");

                entity.Property(e => e.RefTtdPermintaanSalinanId).HasColumnName("RefTtdPermintaanSalinanID");

                entity.Property(e => e.RefTtdPermintaanSubStId).HasColumnName("RefTtdPermintaanSubStID");

                entity.Property(e => e.RefTtdTandaTerimaId).HasColumnName("RefTtdTandaTerimaID");

                entity.Property(e => e.RefUpTermohonId).HasColumnName("RefUpTermohonID");

                entity.Property(e => e.TglDistribusiBerkas).HasColumnType("date");

                entity.Property(e => e.TglJatuhTempoSiapSidang).HasColumnType("date");

                entity.Property(e => e.TglKep).HasColumnType("date");

                entity.Property(e => e.TglKirimBantahan).HasColumnType("datetime");

                entity.Property(e => e.TglKirimPencabutan).HasColumnType("datetime");

                entity.Property(e => e.TglKirimPermohonan).HasColumnType("datetime");

                entity.Property(e => e.TglKirimSubSt).HasColumnType("datetime");

                entity.Property(e => e.TglObjekSengketa).HasColumnType("date");

                entity.Property(e => e.TglPemeriksaan).HasColumnType("datetime");

                entity.Property(e => e.TglPenetapan).HasColumnType("date");

                entity.Property(e => e.TglPenetapanAc)
                    .HasColumnName("TglPenetapanAC")
                    .HasColumnType("date");

                entity.Property(e => e.TglPenetapanPencabutan).HasColumnType("date");

                entity.Property(e => e.TglPos).HasColumnType("date");

                entity.Property(e => e.TglRekamPermintaanBantahan).HasColumnType("datetime");

                entity.Property(e => e.TglRekamPermintaanSalinan).HasColumnType("datetime");

                entity.Property(e => e.TglSkp).HasColumnType("date");

                entity.Property(e => e.TglSubSt).HasColumnType("date");

                entity.Property(e => e.TglSuratBantahan).HasColumnType("date");

                entity.Property(e => e.TglSuratPencabutan).HasColumnType("date");

                entity.Property(e => e.TglSuratPermintaanBantahan).HasColumnType("date");

                entity.Property(e => e.TglSuratPermintaanSalinan).HasColumnType("date");

                entity.Property(e => e.TglSuratPermintaanSubSt).HasColumnType("datetime");

                entity.Property(e => e.TglSuratPermohonan).HasColumnType("date");

                entity.Property(e => e.TglTandaTerimaPermintaan).HasColumnType("datetime");

                entity.Property(e => e.TglTandaTerimaSubSt).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaAbgBantahan).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaAbgPermohonan).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaAbgSubSt).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaBantahan).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaKep).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaPencabutan).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaPermohonan).HasColumnType("datetime");

                entity.Property(e => e.TglTerimaSubSt).HasColumnType("datetime");

                entity.Property(e => e.TglValidasiBantahan).HasColumnType("datetime");

                entity.Property(e => e.TglValidasiPencabutan).HasColumnType("datetime");

                entity.Property(e => e.TglValidasiPermohonan).HasColumnType("datetime");

                entity.Property(e => e.TglValidasiSubSt).HasColumnType("datetime");

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.ValidatorBantahanId).HasColumnName("ValidatorBantahanID");

                entity.Property(e => e.ValidatorPencabutanId).HasColumnName("ValidatorPencabutanID");

                entity.Property(e => e.ValidatorPermohonanId).HasColumnName("ValidatorPermohonanID");

                entity.Property(e => e.ValidatorSubStId).HasColumnName("ValidatorSubStID");

                entity.HasOne(d => d.Pemohon)
                    .WithMany(p => p.Permohonan)
                    .HasForeignKey(d => d.PemohonId)
                    .HasConstraintName("FK_Permohonan_PemohonID");

                entity.HasOne(d => d.RefCaraKirimBantahan)
                    .WithMany(p => p.PermohonanRefCaraKirimBantahan)
                    .HasForeignKey(d => d.RefCaraKirimBantahanId)
                    .HasConstraintName("FK_Permohonan_RefCaraKirimBantahanID");

                entity.HasOne(d => d.RefCaraKirimPencabutan)
                    .WithMany(p => p.PermohonanRefCaraKirimPencabutan)
                    .HasForeignKey(d => d.RefCaraKirimPencabutanId)
                    .HasConstraintName("FK_Permohonan_RefCaraKirimPencabutanID");

                entity.HasOne(d => d.RefCaraKirimPermohonan)
                    .WithMany(p => p.PermohonanRefCaraKirimPermohonan)
                    .HasForeignKey(d => d.RefCaraKirimPermohonanId)
                    .HasConstraintName("FK_Permohonan_RefCaraKirimPermohonanID");

                entity.HasOne(d => d.RefCaraKirimSubSt)
                    .WithMany(p => p.PermohonanRefCaraKirimSubSt)
                    .HasForeignKey(d => d.RefCaraKirimSubStId)
                    .HasConstraintName("FK_Permohonan_RefCaraKirimSubStID");

                entity.HasOne(d => d.RefJenisKetetapan)
                    .WithMany(p => p.Permohonan)
                    .HasForeignKey(d => d.RefJenisKetetapanId)
                    .HasConstraintName("FK_Permohonan_RefJenisKetetapanID");

                entity.HasOne(d => d.RefJenisPajak)
                    .WithMany(p => p.Permohonan)
                    .HasForeignKey(d => d.RefJenisPajakId)
                    .HasConstraintName("FK_Permohonan_RefJenisPajakID");

                entity.HasOne(d => d.RefJenisPemeriksaan)
                    .WithMany(p => p.Permohonan)
                    .HasForeignKey(d => d.RefJenisPemeriksaanId)
                    .HasConstraintName("FK_Permohonan_RefJenisPemeriksaanID");

                entity.HasOne(d => d.RefJenisPermohonan)
                    .WithMany(p => p.Permohonan)
                    .HasForeignKey(d => d.RefJenisPermohonanId)
                    .HasConstraintName("FK_Permohonan_RefJenisPermohonanID");

                entity.HasOne(d => d.RefStatus)
                    .WithMany(p => p.Permohonan)
                    .HasForeignKey(d => d.RefStatusId)
                    .HasConstraintName("FK_Permohonan_RefStatusID");
            });

            modelBuilder.Entity<RefAlasan>(entity =>
            {
                entity.Property(e => e.RefAlasanId).HasColumnName("RefAlasanID");

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefCaraKirim>(entity =>
            {
                entity.Property(e => e.RefCaraKirimId)
                    .HasColumnName("RefCaraKirimID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefConfig>(entity =>
            {
                entity.Property(e => e.RefConfigId).HasColumnName("RefConfigID");

                entity.Property(e => e.ConfigKey)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.ConfigValue)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IsEncrypted).HasDefaultValueSql("((0))");

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefDokumen>(entity =>
            {
                entity.Property(e => e.RefDokumenId)
                    .HasColumnName("RefDokumenID")
                    .ValueGeneratedNever();

                entity.Property(e => e.JenisFile)
                    .IsRequired()
                    .HasMaxLength(8)
                    .IsUnicode(false);

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefHakim>(entity =>
            {
                entity.Property(e => e.RefHakimId).HasColumnName("RefHakimID");

                entity.Property(e => e.Nama)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Nik)
                    .HasColumnName("NIK")
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.PegawaiId).HasColumnName("PegawaiID");
            });

            modelBuilder.Entity<RefJenisKasus>(entity =>
            {
                entity.Property(e => e.RefJenisKasusId)
                    .HasColumnName("RefJenisKasusID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefJenisKetetapan>(entity =>
            {
                entity.Property(e => e.RefJenisKetetapanId)
                    .HasColumnName("RefJenisKetetapanID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefJenisNormaWaktu>(entity =>
            {
                entity.Property(e => e.RefJenisNormaWaktuId)
                    .HasColumnName("RefJenisNormaWaktuID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(128)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefJenisPajak>(entity =>
            {
                entity.Property(e => e.RefJenisPajakId)
                    .HasColumnName("RefJenisPajakID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Kode)
                    .IsRequired()
                    .HasColumnType("char(2)");

                entity.Property(e => e.RefJenisKasusId).HasColumnName("RefJenisKasusID");

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.UraianSingkat)
                    .HasMaxLength(24)
                    .IsUnicode(false);

                entity.HasOne(d => d.RefJenisKasus)
                    .WithMany(p => p.RefJenisPajak)
                    .HasForeignKey(d => d.RefJenisKasusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RefJenisPajak_RefJenisKasusID");
            });

            modelBuilder.Entity<RefJenisPemeriksaan>(entity =>
            {
                entity.Property(e => e.RefJenisPemeriksaanId)
                    .HasColumnName("RefJenisPemeriksaanID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefJenisPenomoran>(entity =>
            {
                entity.Property(e => e.RefJenisPenomoranId).HasColumnName("RefJenisPenomoranID");

                entity.Property(e => e.Prefix)
                    .HasMaxLength(8)
                    .IsUnicode(false);

                entity.Property(e => e.Suffix)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefJenisPermohonan>(entity =>
            {
                entity.Property(e => e.RefJenisPermohonanId)
                    .HasColumnName("RefJenisPermohonanID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefKodeTermohon>(entity =>
            {
                entity.HasKey(e => e.OrganisasiId);

                entity.Property(e => e.OrganisasiId)
                    .HasColumnName("OrganisasiID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Alamat)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.IndukOrganisasiId).HasColumnName("IndukOrganisasiID");

                entity.Property(e => e.KodeOrganisasi)
                    .HasMaxLength(12)
                    .IsUnicode(false);

                entity.Property(e => e.KodeOrganisasiBerkas)
                    .HasMaxLength(12)
                    .IsUnicode(false);

                entity.Property(e => e.KodePos)
                    .HasMaxLength(8)
                    .IsUnicode(false);

                entity.Property(e => e.KodeSatker)
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.KodeSurat)
                    .IsRequired()
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.Kota)
                    .HasMaxLength(64)
                    .IsUnicode(false);

                entity.Property(e => e.OrganisasiBerkasId).HasColumnName("OrganisasiBerkasID");

                entity.Property(e => e.UraianJabatan)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.UraianLengkapOrganisasi)
                    .IsRequired()
                    .HasMaxLength(512)
                    .IsUnicode(false);

                entity.Property(e => e.UraianOrganisasi)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.UraianOrganisasiBerkas)
                    .HasMaxLength(256)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefMajelis>(entity =>
            {
                entity.Property(e => e.RefMajelisId).HasColumnName("RefMajelisID");

                entity.Property(e => e.HakimAnggota1Id).HasColumnName("HakimAnggota1ID");

                entity.Property(e => e.HakimAnggota2Id).HasColumnName("HakimAnggota2ID");

                entity.Property(e => e.HakimKetuaId).HasColumnName("HakimKetuaID");

                entity.Property(e => e.Harsinom)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Kode)
                    .IsRequired()
                    .HasColumnType("char(5)");

                entity.Property(e => e.Majelis)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.NamaHakimAnggota1)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NamaHakimAnggota2)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NamaHakimKetua)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NamaSp)
                    .IsRequired()
                    .HasColumnName("NamaSP")
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.NiphakimAnggota1)
                    .IsRequired()
                    .HasColumnName("NIPHakimAnggota1")
                    .HasMaxLength(18)
                    .IsUnicode(false);

                entity.Property(e => e.NiphakimAnggota2)
                    .IsRequired()
                    .HasColumnName("NIPHakimAnggota2")
                    .HasMaxLength(18)
                    .IsUnicode(false);

                entity.Property(e => e.NiphakimKetua)
                    .IsRequired()
                    .HasColumnName("NIPHakimKetua")
                    .HasMaxLength(18)
                    .IsUnicode(false);

                entity.Property(e => e.Nipsp)
                    .IsRequired()
                    .HasColumnName("NIPSP")
                    .HasMaxLength(18)
                    .IsUnicode(false);

                entity.Property(e => e.Psp1id).HasColumnName("PSP1ID");

                entity.Property(e => e.Psp2id).HasColumnName("PSP2ID");

                entity.Property(e => e.RefJenisKasusId).HasColumnName("RefJenisKasusID");

                entity.Property(e => e.Spid).HasColumnName("SPID");

                entity.HasOne(d => d.RefJenisKasus)
                    .WithMany(p => p.RefMajelis)
                    .HasForeignKey(d => d.RefJenisKasusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RefMajelis_RefJenisKasusID");
            });

            modelBuilder.Entity<RefNormaWaktu>(entity =>
            {
                entity.Property(e => e.RefNormaWaktuId)
                    .HasColumnName("RefNormaWaktuID")
                    .ValueGeneratedNever();

                entity.Property(e => e.RefJenisNormaWaktuId).HasColumnName("RefJenisNormaWaktuID");

                entity.Property(e => e.RefJenisPermohonanId).HasColumnName("RefJenisPermohonanID");

                entity.HasOne(d => d.RefJenisNormaWaktu)
                    .WithMany(p => p.RefNormaWaktu)
                    .HasForeignKey(d => d.RefJenisNormaWaktuId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RefNormaWaktu_RefJenisNormaWaktuID");

                entity.HasOne(d => d.RefJenisPermohonan)
                    .WithMany(p => p.RefNormaWaktu)
                    .HasForeignKey(d => d.RefJenisPermohonanId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RefNormaWaktu_RefJenisPermohonanID");
            });

            modelBuilder.Entity<RefStatus>(entity =>
            {
                entity.Property(e => e.RefStatusId)
                    .HasColumnName("RefStatusID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RefTemplate>(entity =>
            {
                entity.Property(e => e.RefTemplateId).HasColumnName("RefTemplateID");

                entity.Property(e => e.FileId)
                    .IsRequired()
                    .HasColumnName("FileID")
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.JenisFile)
                    .IsRequired()
                    .HasMaxLength(41)
                    .IsUnicode(false);

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.RoleId)
                    .HasColumnName("RoleID")
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.Uraian)
                    .IsRequired()
                    .HasMaxLength(64)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SampleData>(entity =>
            {
                entity.HasKey(e => e.QuoteId);

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Quote)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SuratPengantar>(entity =>
            {
                entity.Property(e => e.SuratPengantarId)
                    .HasColumnName("SuratPengantarID")
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.NoSuratPengantar)
                    .IsRequired()
                    .HasMaxLength(256)
                    .IsUnicode(false);

                entity.Property(e => e.PermohonanId)
                    .IsRequired()
                    .HasColumnName("PermohonanID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.RefCaraKirimId).HasColumnName("RefCaraKirimID");

                entity.Property(e => e.TglKirim).HasColumnType("datetime");

                entity.Property(e => e.TglSuratPengantar).HasColumnType("datetime");

                entity.Property(e => e.TglTerima).HasColumnType("datetime");

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

                entity.HasOne(d => d.RefCaraKirim)
                    .WithMany(p => p.SuratPengantar)
                    .HasForeignKey(d => d.RefCaraKirimId)
                    .HasConstraintName("FK_SuratPengantar_RefCaraKirimID");
            });

            modelBuilder.Entity<SysMenu>(entity =>
            {
                entity.HasKey(e => e.MenuId);

                entity.HasIndex(e => e.MenuId);

                entity.Property(e => e.Exact).HasDefaultValueSql("((1))");

                entity.Property(e => e.Icon).HasMaxLength(50);

                entity.Property(e => e.Link).HasMaxLength(100);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.ParentName).HasMaxLength(100);

                entity.Property(e => e.Roles).HasMaxLength(255);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.Property(e => e.UserRoleId).HasColumnName("UserRoleID");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Nama)
                    .HasMaxLength(128)
                    .IsUnicode(false);

                entity.Property(e => e.Nip18)
                    .HasColumnName("NIP18")
                    .HasMaxLength(18)
                    .IsUnicode(false);

                entity.Property(e => e.PegawaiId).HasColumnName("PegawaiID");

                entity.Property(e => e.RoleId)
                    .HasColumnName("RoleID")
                    .HasMaxLength(36)
                    .IsUnicode(false);

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });
        }
    }
}
