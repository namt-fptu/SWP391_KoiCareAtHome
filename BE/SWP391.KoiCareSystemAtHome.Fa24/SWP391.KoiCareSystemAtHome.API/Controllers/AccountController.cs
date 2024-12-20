using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using System.Diagnostics;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountService _accountService;
        private readonly PondOwnerService _pondOwnerService;
        private readonly ShopService _shopService;
        private readonly IConfiguration _configuration;

        public AccountController(AccountService accountService, PondOwnerService pondOwnerService, ShopService shopService, IConfiguration configuration)
        {
            _accountService = accountService;
            _pondOwnerService = pondOwnerService;
            _shopService = shopService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] AuthenticateModel authenticate)
        {
            if (authenticate == null)
                return BadRequest("Invalid client request.");

            var account = await _accountService.Authenticate(authenticate);
            if (account == null)
                return NotFound("Invalid email or password.");

            AccountResponseModel responseModel = new()
            {
                Email = account.Email,
                Id = account.Id,
                Phone = account.Phone,
                Role = account.Role,
            };

            string jwt = CreateToken(responseModel);

            return Ok(jwt);
        }

        private string CreateToken(AccountResponseModel responseModel)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, responseModel.Email),
                new Claim(ClaimTypes.Role, responseModel.Role),
                new Claim(ClaimTypes.NameIdentifier, responseModel.Id.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [HttpGet("getAccounts"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AccountResponseModel>>> GetAccounts()
        {
            var accounts = await _accountService.GetAcountAsync();

            if (accounts == null || !accounts.Any()) 
                return NotFound();

            var respone = accounts.Select(account => new AccountResponseModel
            {
                Id = account.Id,
                Email = account.Email,
                //Password = account.Password,
                Phone = account.Phone,
                Role = account.Role
            });
            return Ok(respone);
        }

        [HttpGet("getShopAndPondOwner"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AccountResponseModel>>> GetShopAndPondOwner()
        {
            var accounts = await _accountService.GetShopAndPondOwnerAcountAsync();

            if (accounts == null || !accounts.Any())
                return NotFound();

            var respone = accounts.Select(account => new AccountResponseModel
            {
                Id = account.Id,
                Email = account.Email,
                //Password = account.Password,
                Phone = account.Phone,
                Role = account.Role
            });
            return Ok(respone);
        }

        [HttpGet("getAccountById/{id}"), Authorize(Roles = "Admin")]
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
                    //Password = account.Password,
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
                    //Password = account.Password,
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
                //Password = account.Password,
                Phone = account.Phone,
                Role = account.Role
            };
            return Ok(response);
        }

        [HttpPost("createAccount")]
        public async Task<ActionResult> CreateAccount(AccountRequetModel request)
        {
            if (request == null)
                return BadRequest("Account data required! ");

            if (request.Phone != null && (request.Phone.Length < 8 || request.Phone.Length > 10 || request.Phone.Any(ch => !char.IsDigit(ch))))
                return BadRequest("Phone number must be 8-10 character and is a number");

            if ((request.Role.Equals("PondOwner") || request.Role.Equals("Shop")) && string.IsNullOrEmpty(request.Name))
                return BadRequest("Name is required!");

            if (request.Role.Equals("Shop") && request.ShopUrl.IsNullOrEmpty())
                return BadRequest("Shop url is required");

            try
            {
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
                        //Password = tempAccountModel.Password,
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
                        //Password = tempAccountModel.Password,
                        Phone = tempAccountModel.Phone,
                        Role = tempAccountModel.Role,
                        Url = tempShopModel.ShopUrl
                    };
                    return Ok(responseShopModel);
                }

                //return CreatedAtAction(nameof(GetAccountById), new { id = tempId }, model);
                var account = await _accountService.GetAccountByIdAsync(tempId);

                if (account == null)
                    return NotFound();

                AccountResponseModel responseModel = new()
                {
                    Id = account.Id,
                    Email = account.Email,
                    //Password = account.Password,
                    Phone = account.Phone,
                    Role = account.Role
                };
                return Ok(responseModel);
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601) // Unique constraint violation
            {
                return Conflict("An account with the same email already exists.");
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the account.");
            }
        }

        [HttpPut("updateAccount/{id}"), Authorize(Roles = "Admin, PondOwner, Shop")]   
        public async Task<IActionResult> UpdateAccount(int id, AccountUpdateRequestModel model)
        {
            AccountModel accountModel = await _accountService.GetAccountByIdAsync(id);

            if (accountModel == null) 
                return NotFound();

            if (model.Phone.IsNullOrEmpty())
                model.Phone = accountModel.Phone;
            if (!model.Email.IsNullOrEmpty())
                accountModel.Email = model.Email;
            if (!model.Password.IsNullOrEmpty())
                accountModel.Password = model.Password;

            if (model.Phone != null && (model.Phone.Length < 8 || model.Phone.Length > 10 || model.Phone.Any(ch => !char.IsDigit(ch))))
                return BadRequest("Phone number must be 8-10 character and is a number");

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

        [HttpDelete("deleteAccount/{id}"), Authorize(Roles = "Admin, PondOwner, Shop")]
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

            bool deleteSuccess = await _accountService.DeleteAccountAync(id);
            if (!deleteSuccess)
                return NotFound();

            return NoContent();
        }

        [HttpGet("countAccount"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> CountAccount()
        {
            int count = await _accountService.CountUserAsync();

            return Ok(count);
        }

        [HttpPost("changePassword/{accountId}"), Authorize(Roles = "Shop, PondOwner")]
        public async Task<ActionResult> ChangePassword(int accountId, ChangePasswordRequestModel request)
        {
            if (request == null)
                return NotFound();

            if (!request.NewPassword.Equals(request.ConfirmPassword))
                return BadRequest("Confirm password not match");

            ChangePasswordModel account = new ChangePasswordModel{
                NewPassword = request.NewPassword,
                OldPassword = request.OldPassword,
            };

            bool success = await _accountService.ChangePasswordAsync(accountId, account);
            
            if (!success)
                return NotFound();

            return NoContent();
        }

    }
}
