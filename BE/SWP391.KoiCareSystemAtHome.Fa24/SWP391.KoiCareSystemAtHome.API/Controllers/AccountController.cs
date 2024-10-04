using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using System.Diagnostics;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountService _accountService;
        private readonly PondOwnerService _pondOwnerService;
        private readonly ShopService _shopService;

        public AccountController(AccountService accountService, PondOwnerService pondOwnerService, ShopService shopService)
        {
            _accountService = accountService;
            _pondOwnerService = pondOwnerService;
            _shopService = shopService;
        }

        [HttpGet("accounts")]
        public async Task<ActionResult<IEnumerable<AccountResponseModel>>> GetAccounts()
        {
            var accounts = await _accountService.GetAcountAsync();
            var respone = accounts.Select(account => new AccountResponseModel
            {
                Id = account.Id,
                Email = account.Email,
                Password = account.Password,
                Phone = account.Phone,
                Role = account.Role
            });
            return Ok(respone);
        }

        [HttpGet("account/{id}")]
        public async Task<ActionResult<AccountResponseModel>> GetAccountById(int id)
        {
            var account = await _accountService.GetAccountByIdAsync(id);

            if(account == null)
                return NotFound();

            if (account.Role.Equals("PondOwner"))
            {
                var pondOwner = await _pondOwnerService.GetPondOwnerByIdAsync(id);
                PondOwnerResponseModel pondOwnerResponse = new()
                {
                    PondOwnerId = account.Id,
                    Email = account.Email,
                    Password = account.Password,
                    Phone = account.Phone,
                    Role = account.Role,
                    Name = pondOwner.Name,
                };
                return Ok(pondOwnerResponse);
            }

            if (account.Role.Equals("Shop"))
            {
                var shop = await _shopService.GetShopModelByIdAsync(id);
                ShopResponseModel shopResponse = new()
                {
                    ShopId = shop.ShopId,
                    Email = account.Email,
                    Password = account.Password,
                    Phone = account.Phone,
                    Role = account.Role,
                    Name = shop.Name,
                    Url = shop.ShopUrl,
                };
                return Ok(shopResponse);
            }

            AccountResponseModel response = new()
            {
                Id = account.Id,
                Email = account.Email,
                Password = account.Password,
                Phone = account.Phone,
                Role = account.Role
            };
            return Ok(response);
        }

        [HttpPost("account")]
        public async Task<ActionResult> CreateAccount(AccountRequetModel request)
        {
            if (request == null)
                return BadRequest("Account data required! ");

            if ((request.Role.Equals("PondOwner") || request.Role.Equals("Shop")) && request.Name.IsNullOrEmpty())
                return BadRequest("Name is required!");

            if (request.Role.Equals("Shop") && request.ShopUrl.IsNullOrEmpty())
                return BadRequest("Shop url is required");

            AccountModel model = new()
            {
                Email = request.Email,
                Password = request.Password,
                Phone = request.Phone,
                Role = request.Role,
            };

            int tempId = await _accountService.CreateAccountAsync(model);
            AccountModel tempAccountModel = await _accountService.GetAccountByIdAsync(tempId);

            if (request.Role.Equals("PondOwner"))
            {
                PondOwnerModel pondOwnerModel = new()
                {
                    PondOwnerId = tempId,
                    Name = request.Name
                };
                await _pondOwnerService.CreatePondOwnerAsync(pondOwnerModel);
                
                PondOwnerModel tempPondOwnerModel = await _pondOwnerService.GetPondOwnerByIdAsync(tempId);
                PondOwnerResponseModel responsePondOwnerModel = new()
                {
                    PondOwnerId = tempPondOwnerModel.PondOwnerId,
                    Email = tempAccountModel.Email,
                    Password = tempAccountModel.Password,
                    Phone = tempAccountModel.Phone,
                    Role = tempAccountModel.Role,
                    Name = tempPondOwnerModel.Name
                };
                return Ok(responsePondOwnerModel);
            }

            if (request.Role.Equals("Shop"))
            {
                ShopModel shopModel = new()
                {
                    ShopId = tempId,
                    Name = request.Name,
                    ShopUrl = request.ShopUrl
                };
                await _shopService.CreateShopAsync(shopModel);

                ShopModel tempShopModel = await _shopService.GetShopModelByIdAsync(tempId);
                ShopResponseModel responseShopModel = new()
                {
                    ShopId = tempShopModel.ShopId,
                    Name = tempShopModel.Name,
                    Email = tempAccountModel.Email,
                    Password = tempAccountModel.Password,
                    Phone = tempAccountModel.Phone,
                    Role = tempAccountModel.Role,
                    Url = tempShopModel.ShopUrl
                };
                return Ok(responseShopModel);
            }

            return CreatedAtAction(nameof(GetAccountById), new { id = tempId }, model);
        }

        [HttpPut("account/{id}")]   
        public async Task<IActionResult> UpdateAccount(int id, AccountUpdateRequestModel model)
        {
            AccountModel accountModel = await _accountService.GetAccountByIdAsync(id);

            if (accountModel == null) 
                return NotFound();

                accountModel.Phone = model.Phone;
            if (!model.Email.IsNullOrEmpty())
                accountModel.Email = model.Email;
            if (!model.Password.IsNullOrEmpty())
                accountModel.Password = model.Password;

            if (accountModel.Role.Equals("PondOwner"))
            {
                var pondOwnerModel = await _pondOwnerService.GetPondOwnerByIdAsync(id);
                PondOwnerModel pondOwnerModelToUpdate = new()
                {
                    Name = pondOwnerModel.Name,
                };
                if (!model.Name.IsNullOrEmpty())
                    pondOwnerModel.Name = model.Name;

                bool pondOwnerSuccesss = await _pondOwnerService.UpdatePondOwnerAsync(id, pondOwnerModel);

                if (!pondOwnerSuccesss)
                    return NotFound();

            }

            if (accountModel.Role.Equals("Shop"))
            {
                var shopModel = await _shopService.GetShopModelByIdAsync(id);

                ShopModel shopModelToUpdate = new()
                {
                    ShopUrl = shopModel.ShopUrl,
                    Name = shopModel.Name,
                };
                if (!model.ShopUrl.IsNullOrEmpty())
                    shopModel.ShopUrl = model.ShopUrl;
                if (!model.Name.IsNullOrEmpty())
                    shopModel.Name = model.Name;

                bool shopSuccess = await _shopService.UpdateShopAsync(id, shopModel);

                if (!shopSuccess)
                    return NotFound();

            }

            bool success = await _accountService.UpdateAccountAsync(id, accountModel);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("account/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var tempAccount = await _accountService.GetAccountByIdAsync(id);

            if (tempAccount == null)
                return NotFound();

            if (tempAccount.Role.Equals("PondOwner"))
            {
                bool success = await _pondOwnerService.DeletePondOwnerAsync(id);
                if (!success)
                    return NotFound();
            }

            if (tempAccount.Role.Equals("Shop"))
            {
                bool success = await _shopService.DeleteShopAsync(id);
                if (!success)
                    return NotFound();
            }

            bool deteleSuccess = await _accountService.DeleteAccountAync(id);
            if (!deteleSuccess)
                return NotFound();

            return NoContent();
        }
    }
}
