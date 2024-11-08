using SWP391.KoiCareSystemAtHome.Repository.Models;
using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using BCrypt.Net;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class AccountService
    {
        private readonly UnitOfWork _unitOfWork;

        public AccountService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AccountModel>> GetAcountAsync()
        {
            var accounts = await _unitOfWork.Accounts.GetAsync();

            if (accounts == null || !accounts.Any()) 
                return Enumerable.Empty<AccountModel>();

            return accounts.Select(account => new AccountModel
            {
                Id = account.Id,
                Email = account.Email,
                Password = account.Password,
                Phone = account.Phone,
                Role = account.Role,
            });
        }

        public async Task<IEnumerable<AccountModel>> GetShopAndPondOwnerAcountAsync()
        {
            var accounts = await _unitOfWork.Accounts.GetAsync();

            if (accounts == null || !accounts.Any())
                return Enumerable.Empty<AccountModel>();

            accounts = accounts.Where(a => (a.Role.Equals("PondOwner") || a.Role.Equals("Shop")));

            return accounts.Select(account => new AccountModel
            {
                Id = account.Id,
                Email = account.Email,
                Password = account.Password,
                Phone = account.Phone,
                Role = account.Role,
            });
        }

        public async Task<int> CreateAccountAsync(AccountModel accountModel)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(accountModel.Password);

            var accountEntity = new Account
            {
                Password = passwordHash,
                Phone = accountModel.Phone,
                Role = accountModel.Role,
                Email = accountModel.Email,
            };

            await _unitOfWork.Accounts.InsertAsync(accountEntity);
            await _unitOfWork.SaveAsync();

            return accountEntity.Id;
        }

        public async Task<AccountModel?> GetAccountByIdAsync(int id)
        {
            var account = await _unitOfWork.Accounts.GetByIdAsync(id);

            if (account == null)
                return null;

            return new AccountModel
            {
                Id = account.Id,
                Email = account.Email,
                Password = account.Password,
                Phone = account.Phone,
                Role = account.Role,
            };
        }

        public async Task<bool> UpdateAccountAsync(int id, AccountModel accountModel)
        {
            var accountToUpdate = await _unitOfWork.Accounts.GetByIdAsync(id);
            if (accountToUpdate == null)
                return false;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(accountModel.Password);

            accountToUpdate.Email = accountModel.Email;
            accountToUpdate.Password = passwordHash;
            accountToUpdate.Phone = accountModel.Phone;
            
            _unitOfWork.Accounts.UpdateAsync(accountToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteAccountAync(int id)
        {
            var account = await _unitOfWork.Accounts.GetByIdAsync(id);
            if(account == null)
                return false;

            _unitOfWork.Accounts.DeleteAsync(account);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<AccountModel?> Authenticate(AuthenticateModel authenticateModel)
        {
            var accounts = await _unitOfWork.Accounts.GetAsync();
            if (accounts == null || !accounts.Any())
                return null;

            //var account = accounts.Where(x => x.Email.ToLower().Equals(authenticateModel.Email.ToLower())).FirstOrDefault();
            var account = accounts.FirstOrDefault(x => x.Email.ToLower().Equals(authenticateModel.Email.ToLower()));

            if (account == null || !BCrypt.Net.BCrypt.Verify(authenticateModel.Password, account.Password))
                return null;

            AccountModel accountModel =  new()
            {
                Email = account.Email,
                Password = account.Password,
                Phone = account.Phone,
                Id = account.Id,
                Role = account.Role
            };

            return accountModel;
        }

        public async Task<int> CountUserAsync()
        {
            var accounts = await _unitOfWork.Accounts.GetAsync();

            int count = accounts.Count(a => !a.Role.Equals("Admin"));

            return count;
        }

        public async Task<bool> ChangePasswordAsync(int id, ChangePasswordModel changePasswordModel)
        {
            var account = await _unitOfWork.Accounts.GetByIdAsync(id);
            if (account == null || !BCrypt.Net.BCrypt.Verify(changePasswordModel.OldPassword, account.Password))
                return false;


            var passwordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordModel.NewPassword);

            account.Password = passwordHash;

            _unitOfWork.Accounts.UpdateAsync(account);
            await _unitOfWork.SaveAsync();
            return true;
        }

    }
}
