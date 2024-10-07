using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SWP391.KoiCareSystemAtHome.Repository.Models;

namespace SWP391.KoiCareSystemAtHome.Repository.Data;

public partial class Swp391koiCareSystemAtHomeContext : DbContext
{
    public Swp391koiCareSystemAtHomeContext()
    {
    }

    public Swp391koiCareSystemAtHomeContext(DbContextOptions<Swp391koiCareSystemAtHomeContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Adv> Advs { get; set; }

    public virtual DbSet<KoiFish> KoiFishes { get; set; }

    public virtual DbSet<KoiGrowthReport> KoiGrowthReports { get; set; }

    public virtual DbSet<KoiGrowthStandard> KoiGrowthStandards { get; set; }

    public virtual DbSet<Koivariety> Koivarieties { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Pond> Ponds { get; set; }

    public virtual DbSet<PondOwner> PondOwners { get; set; }

    public virtual DbSet<PostPackage> PostPackages { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Shop> Shops { get; set; }

    public virtual DbSet<WaterParameterStandard> WaterParameterStandards { get; set; }

    public virtual DbSet<WaterReport> WaterReports { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-EBAQMO4N;uid=SA;pwd=12345;database=SWP391KoiCareSystemAtHome;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Account__3214EC27DBFEE330");

            entity.ToTable("Account");

            entity.HasIndex(e => e.Phone, "UQ__Account__5C7E359E0A6D01BD").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Account__A9D105342CBB79BA").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Adv>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Adv__3214EC2729487718");

            entity.ToTable("Adv");

            entity.HasIndex(e => e.Url, "UQ__Adv__C5B100093992A4D1").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AdvDate).HasColumnType("datetime");
            entity.Property(e => e.EditedDate).HasColumnType("datetime");
            entity.Property(e => e.ExpiredDate).HasColumnType("datetime");
            entity.Property(e => e.ShopId).HasColumnName("ShopID");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Url)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("URL");

            entity.HasOne(d => d.Shop).WithMany(p => p.Advs)
                .HasForeignKey(d => d.ShopId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKAdv40158");
        });

        modelBuilder.Entity<KoiFish>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KoiFish__3214EC27545F4202");

            entity.ToTable("KoiFish");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Dob).HasColumnType("datetime");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ImageURL");
            entity.Property(e => e.KoiName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.KoiVariety)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PondId).HasColumnName("PondID");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Sex)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.KoiVarietyNavigation).WithMany(p => p.KoiFishes)
                .HasForeignKey(d => d.KoiVariety)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKKoiFish767310");

            entity.HasOne(d => d.Pond).WithMany(p => p.KoiFishes)
                .HasForeignKey(d => d.PondId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKKoiFish959178");
        });

        modelBuilder.Entity<KoiGrowthReport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KoiGrowt__3214EC27EAC33D3D");

            entity.ToTable("KoiGrowthReport");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.KoiId).HasColumnName("KoiID");
            entity.Property(e => e.Length).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Wetight).HasColumnType("decimal(19, 2)");

            entity.HasOne(d => d.Koi).WithMany(p => p.KoiGrowthReports)
                .HasForeignKey(d => d.KoiId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKKoiGrowthR752239");
        });

        modelBuilder.Entity<KoiGrowthStandard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__KoiGrowt__3214EC27EA7F78EF");

            entity.ToTable("KoiGrowthStandard");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.KoiVariety)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaxFeed).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinFeed).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.StandardLength).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.StandardWeigth).HasColumnType("decimal(19, 2)");

            entity.HasOne(d => d.KoiVarietyNavigation).WithMany(p => p.KoiGrowthStandards)
                .HasForeignKey(d => d.KoiVariety)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKKoiGrowthS941562");
        });

        modelBuilder.Entity<Koivariety>(entity =>
        {
            entity.HasKey(e => e.Variety).HasName("PK__Koivarie__4C45D0A1F01F08C5");

            entity.ToTable("Koivariety");

            entity.Property(e => e.Variety)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Color)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Rarity)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Payment__3214EC27EA2B2744");

            entity.ToTable("Payment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.PackageId).HasColumnName("PackageID");
            entity.Property(e => e.PayDate).HasColumnType("datetime");
            entity.Property(e => e.PostId).HasColumnName("PostID");

            entity.HasOne(d => d.Package).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPayment948000");

            entity.HasOne(d => d.Post).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPayment545677");
        });

        modelBuilder.Entity<Pond>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Pond__3214EC27B9B8A066");

            entity.ToTable("Pond");

            entity.HasIndex(e => e.Name, "UQ__Pond__737584F6C35D963A").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PondOwnerId).HasColumnName("PondOwnerID");

            entity.HasOne(d => d.PondOwner).WithMany(p => p.Ponds)
                .HasForeignKey(d => d.PondOwnerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPond2159");
        });

        modelBuilder.Entity<PondOwner>(entity =>
        {
            entity.HasKey(e => e.PondOwnerId).HasName("PK__PondOwne__61B8CCA85DAEAD7D");

            entity.ToTable("PondOwner", tb => tb.HasTrigger("trg_EnsurePondOwnerRole"));

            entity.Property(e => e.PondOwnerId)
                .ValueGeneratedNever()
                .HasColumnName("PondOwnerID");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.PondOwnerNavigation).WithOne(p => p.PondOwner)
                .HasForeignKey<PondOwner>(d => d.PondOwnerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPondOwner577512");
        });

        modelBuilder.Entity<PostPackage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PostPack__3214EC2732B39EAC");

            entity.ToTable("PostPackage");

            entity.HasIndex(e => e.Price, "UQ__PostPack__6089BD09B5BF51F7").IsUnique();

            entity.HasIndex(e => e.Name, "UQ__PostPack__737584F6D9AE2944").IsUnique();

            entity.HasIndex(e => e.Duration, "UQ__PostPack__AE1EFC9151CD40A5").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(19, 2)");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Product__3214EC27B6CFB2C4");

            entity.ToTable("Product");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ImageURL");
            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.Post).WithMany(p => p.Products)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKProduct337927");
        });

        modelBuilder.Entity<Shop>(entity =>
        {
            entity.HasKey(e => e.ShopId).HasName("PK__Shop__67C556297EE446CC");

            entity.ToTable("Shop", tb => tb.HasTrigger("trg_EnsureShopRole"));

            entity.HasIndex(e => e.ShopUrl, "UQ__Shop__5DDD6C3AB1DEBE34").IsUnique();

            entity.Property(e => e.ShopId)
                .ValueGeneratedNever()
                .HasColumnName("ShopID");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ShopUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ShopURL");

            entity.HasOne(d => d.ShopNavigation).WithOne(p => p.Shop)
                .HasForeignKey<Shop>(d => d.ShopId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKShop373250");
        });

        modelBuilder.Entity<WaterParameterStandard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__WaterPar__3214EC272D9933ED");

            entity.ToTable("WaterParameterStandard");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.KoiVariety)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaxAmonium).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxCabondioxide).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxHardness).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxNitrates).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxNitrite).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxOxigen).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxPh)
                .HasColumnType("decimal(19, 2)")
                .HasColumnName("MaxPH");
            entity.Property(e => e.MaxSalt).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MaxTemp).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinAmonium).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinCabondioxide).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinHardness).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinNitrates).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinNitrite).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinOxigen).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinPh)
                .HasColumnType("decimal(19, 2)")
                .HasColumnName("MinPH");
            entity.Property(e => e.MinSalt).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.MinTemp).HasColumnType("decimal(19, 2)");

            entity.HasOne(d => d.KoiVarietyNavigation).WithMany(p => p.WaterParameterStandards)
                .HasForeignKey(d => d.KoiVariety)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKWaterParam310949");
        });

        modelBuilder.Entity<WaterReport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__WaterRep__3214EC27BDE4EEF9");

            entity.ToTable("WaterReport");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Amonium).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Cabondioxide).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Hardness).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Nitrates).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Nitrite).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Oxigen).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.PhVaule).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.PondId).HasColumnName("PondID");
            entity.Property(e => e.Salt).HasColumnType("decimal(19, 2)");
            entity.Property(e => e.Temperature).HasColumnType("decimal(19, 2)");

            entity.HasOne(d => d.Pond).WithMany(p => p.WaterReports)
                .HasForeignKey(d => d.PondId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKWaterRepor209767");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
