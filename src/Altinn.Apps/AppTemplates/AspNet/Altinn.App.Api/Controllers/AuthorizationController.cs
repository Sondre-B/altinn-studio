using System.Threading.Tasks;
using Altinn.App.Common.Helpers;
using Altinn.App.Services.Configuration;
using Altinn.App.Services.Helpers;
using Altinn.App.Services.Interface;
using Altinn.App.Services.Models;
using Altinn.Platform.Register.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Altinn.App.Api.Controllers
{
    /// <summary>
    /// Exposes API endpoints related to authorization
    /// </summary>
    public class AuthorizationController : Controller
    {
        private readonly IAuthorization _authroization;
        private readonly ILogger _logger;
        private readonly UserHelper _userHelper;
        private readonly GeneralSettings _settings;
        private readonly IRegister _registerService;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorizationController"/> class
        /// </summary>
        public AuthorizationController(
                IAuthorization authorization,
                IProfile profileService,
                IRegister registerService,
                ILogger<AuthorizationController> logger,
                IOptions<GeneralSettings> settings)
        {
            _userHelper = new UserHelper(profileService, registerService, settings);
            _authroization = authorization;
            _logger = logger;
            _settings = settings.Value;
            _registerService = registerService;
        }

        /// <summary>
        /// Gets current party by reading cookie value and validating.
        /// </summary>
        /// <returns>Party id for selected party. If invalid, partyId for logged in user is returned.</returns>
        [HttpGet("{org}/{app}/api/authorization/parties/current")]
        public async Task<ActionResult> GetCurrentParty(bool returnPartyObject = false)
        {
            UserContext userContext = await _userHelper.GetUserContext(HttpContext);
            int userId = userContext.UserId;
            string cookieValue = Request.Cookies[_settings.GetAltinnPartyCookieName];
            int.TryParse(cookieValue, out int partyIdFromCookie);

            if (userContext.UserParty == null || userContext.PartyId != userContext.UserParty.PartyId)
            {
                bool? isValid = await _authroization.ValidateSelectedParty(userId, userContext.PartyId);

                if (isValid == true)
                {
                    if (returnPartyObject)
                    {
                        return Ok(userContext.Party);
                    }

                    return Ok(userContext.PartyId);
                }
                else if (userContext.UserParty != null)
                {
                    userContext.Party = userContext.UserParty;
                    userContext.PartyId = userContext.UserParty.PartyId;
                }
                else
                {
                    userContext.Party = null;
                    userContext.PartyId = 0;
                }
            }

            // Setting cookie to partyID of logged in user if it varies from previus value.
            if (partyIdFromCookie != userContext.PartyId)
            {
                Response.Cookies.Append(
                _settings.GetAltinnPartyCookieName,
                userContext.PartyId.ToString(),
                new CookieOptions
                {
                    Domain = _settings.HostName
                });
            }

            if (returnPartyObject)
            {
                return Ok(userContext.Party);
            }

            return Ok(userContext.PartyId);
        }

        /// <summary>
        /// Checks if the user can represent the selected party.
        /// </summary>
        /// <param name="userId">The userId</param>
        /// <param name="partyId">The partyId</param>
        /// <returns>Boolean indicating if the selected party is valid.</returns>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ValidateSelectedParty(int userId, int partyId)
        {
            if (partyId == 0 || userId == 0)
            {
                return BadRequest("Both userId and partyId must be provided.");
            }

            bool? result = await _authroization.ValidateSelectedParty(userId, partyId);

            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode(500, $"Something went wrong when trying to validate party {partyId} for user {userId}");
            }
        }
    }
}
