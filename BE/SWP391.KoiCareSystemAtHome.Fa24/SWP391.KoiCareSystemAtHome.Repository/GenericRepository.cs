using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWP391.KoiCareSystemAtHome.Repository.Data;

namespace SWP391.KoiCareSystemAtHome.Repository
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        internal Swp391koiCareSystemAtHomeContext context;
        internal DbSet<TEntity> dbSet;

        public GenericRepository(Swp391koiCareSystemAtHomeContext context)
        {
            this.context = context;
            dbSet = context.Set<TEntity>();
        }

        public virtual async Task<IEnumerable<TEntity?>> GetAsync() => await dbSet.ToListAsync();

        public virtual async Task<TEntity?> GetByIdAsync(object id) => await dbSet.FindAsync(id);

        public virtual async Task InsertAsync(TEntity entity) => await dbSet.AddAsync(entity);

        public virtual void DeleteAsync(TEntity entity)
        {
            if (context.Entry(entity).State == EntityState.Detached)
                dbSet.Attach(entity);
            dbSet.Remove(entity);
        }

        public virtual void UpdateAsync(TEntity entity)
        {
            dbSet.Attach(entity);
            context.Entry(entity).State = EntityState.Modified;
        }

        public virtual async Task<bool> IsExist(object id) => await GetByIdAsync(id) is not null;
    }
}
