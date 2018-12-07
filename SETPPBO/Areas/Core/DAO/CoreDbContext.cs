using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SETPPBO.Models;

namespace SETPPBO.DAO
{
    public class CoreDbContext : IdentityDbContext<ApplicationUser>
    {
        public CoreDbContext(DbContextOptions<CoreDbContext> options)
            : base(options)
        {
        }

        public DbSet<SysMenu> SysMenu { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {          
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
            builder.Entity<SysMenu>(entity =>
            {
                entity.HasKey(e => e.MenuId);

                entity.Property(e => e.Link)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Exact)
                    .HasDefaultValue(true)
                    .IsRequired()
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Icon)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Roles)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ParentName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Type)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Order)
                    .IsUnicode(false);
            });

             base.OnModelCreating(builder);
        }
    }
}
