using SWP391.KoiCareSystemAtHome.Repository.Data;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Repository
{
    public class UnitOfWork : IDisposable
    {
        private Swp391koiCareSystemAtHomeContext _context;
        private GenericRepository<Account> _account;
        private GenericRepository<PondOwner> _owner;
        private GenericRepository<Shop> _shop;
        private GenericRepository<Pond> _pond;
        private GenericRepository<WaterReport> _waterReport;
        private GenericRepository<KoiFish> _koiFish;
        private GenericRepository<KoiGrowthReport> _koiGrowthReport;
        private GenericRepository<Koivariety> _koivariety;
        private GenericRepository<KoiGrowthStandard> _koiGrowthStandard;
        private GenericRepository<WaterParameterStandard> _WaterParameterStandard;

        public UnitOfWork(Swp391koiCareSystemAtHomeContext context)
        {
            _context = context;
        }

        public GenericRepository<Account> Accounts
        {
            get
            {
                if (_account == null)
                    _account = new GenericRepository<Account>(_context);
                return _account;
            }
        }

        public GenericRepository<PondOwner> PondOwners
        {
            get
            {
                if (_owner == null)
                    _owner = new GenericRepository<PondOwner>(_context);
                return _owner;
            }
        }

        public GenericRepository<Shop> Shops
        {
            get
            {
                if (_shop == null)
                    _shop = new GenericRepository<Shop>(_context);
                return _shop;
            }
        }

        public GenericRepository<Pond> Ponds
        {
            get 
            {
                if(_pond == null)
                    _pond = new GenericRepository<Pond>(_context);
                return _pond;
            }
        }

        public GenericRepository<WaterReport> WaterReports
        {
            get
            {
                if (_waterReport == null)
                    _waterReport = new GenericRepository<WaterReport>(_context);
                return _waterReport;
            }
        }

        public GenericRepository<KoiFish> KoiFishs
        {
            get
            {
                if(_koiFish == null)
                    _koiFish = new GenericRepository<KoiFish>(_context);
                return _koiFish;
            }
        }

        public GenericRepository<KoiGrowthReport> KoiGrowthReports
        {
            get
            {
                if(_koiGrowthReport == null)
                    _koiGrowthReport = new GenericRepository<KoiGrowthReport>(_context);
                return _koiGrowthReport;
            }
        }

        public GenericRepository<Koivariety> KoiVarietys
        {
            get
            {
                if (_koivariety == null)
                    _koivariety = new GenericRepository<Koivariety> (_context);
                return _koivariety;
            }
        }

        public GenericRepository<KoiGrowthStandard> KoiGrowthStandards
        {
            get
            {
                if (_koiGrowthStandard == null)
                    _koiGrowthStandard = new GenericRepository<KoiGrowthStandard> (_context);
                return _koiGrowthStandard;
            }
        }

        public GenericRepository<WaterParameterStandard> WaterParameterStandards
        {
            get
            {
                if (_WaterParameterStandard == null)
                    _WaterParameterStandard = new GenericRepository<WaterParameterStandard> (_context);
                return _WaterParameterStandard;
            }
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
