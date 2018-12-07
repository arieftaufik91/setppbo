using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using SETPPBO.Controllers;
using SETPPBO.DAO;
using System.Collections;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;

namespace SETPPBO.Filters
{
    public class CustomActionFilter : ActionFilterAttribute
    {
        const int HTTP_OK = 200;
        const int HTTP_UNAUTHORIZED = 401;
        const int HTTP_FORBIDDEN = 403;

        public CustomActionFilter()
        {
        }

        private FilterResult checkAnonymusAndAuthorize(ControllerActionDescriptor desc, ClaimsPrincipal principal)
        {
            /*
            Cek akses ke action terkait Authorize dan AllowAnonymous attribute.
            Jika user tidak ter - otentikasi, maka:
            - && authorize && tidak allowanonymous-- > return status code 401(unauthorized)
            */
            FilterResult result = new FilterResult();

            bool isAnonymousAllowed = false;
            bool isActionAuthorized = false;

            foreach (var filterDescriptor in desc.FilterDescriptors)
            {
                var type = filterDescriptor.Filter.GetType();
                if (type == typeof(AllowAnonymousFilter))
                {
                    isAnonymousAllowed = true;
                }

                if (type == typeof(AuthorizeFilter))
                {
                    isActionAuthorized = true;
                }
            }

            result.isAllowed = principal.Identity.IsAuthenticated || // boleh jika user sudah authenticated
                               (!isActionAuthorized) ||  // boleh jika actionnya tidak ada attribute authorized
                               (isActionAuthorized && isAnonymousAllowed); // boleh jika action ada attribute authorized dan ada attribute allowAnonymous
            result.httpCode = result.isAllowed ? HTTP_OK : HTTP_UNAUTHORIZED;

            return result;
        }

        private FilterResult checkBanStatusAndActionClaim(ActionExecutingContext ctx, ControllerActionDescriptor desc, ClaimsPrincipal principal)
        {
            /* 
             * Cek action terkait ban user (user claim -> emailConfirmed = false)
             * - set redirect ke Account/Lockedout
             * - set status code 403 (forbidden)
             * 
             * Cek action terkait atribut bypassfilter
             * - jika action punya atribut bypassfilter maka lanjutkan action
             * - jika tidak maka lanjut ke pengecekan hak akses action di claim user.
             * 
             * Cek terkait hak action di claim
             * - boleh lanjut jika: di claim punya (controllername).* atau (controllername).(actionname)
             * - jika tidak, set status code 403 (forbidden)
             */
            bool isAllowed = false;
            string controllerName = desc.ControllerName;
            string actionName = desc.ActionName;
            FilterResult result = new FilterResult();

            var id = principal.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            var userManager = ctx.HttpContext.RequestServices.GetService<UserManager<ApplicationUser>>();
            var appUser = userManager.Users.FirstOrDefault(x => x.Id.Equals(id));
            bool isLocked = !appUser.EmailConfirmed;
            bool isFromLockedPage = (controllerName + "/" + actionName).Equals("Account/Lockedout");

            result.isAllowed = isAllowed;
            result.httpCode = isAllowed ? HTTP_OK : HTTP_FORBIDDEN;
            return result;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var descriptor = context.ActionDescriptor as ControllerActionDescriptor;
            string controllerName = descriptor.ControllerName;
            string actionName = descriptor.ActionName;

            var user = context.HttpContext.User;
            var claims = user.Claims;

            // Cek hak akses pertama: Apakah action allow anonymous dan authorize
            FilterResult firstFilter = checkAnonymusAndAuthorize(descriptor, user);
            if (!firstFilter.isAllowed)
            {
                context.Result = new StatusCodeResult(firstFilter.httpCode);
                base.OnActionExecuting(context); // break -> keluar dari method
            }

            if (context.Controller.GetType() != typeof(AccountController) && claims.Count() > 0)
            {
                var id = claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;

                // cek banned
                var userManager = context.HttpContext.RequestServices.GetService<UserManager<ApplicationUser>>();
                var appUser = userManager.Users.FirstOrDefault(x => x.Id.Equals(id));
                bool isLocked = !appUser.EmailConfirmed;
                bool isFromLockedPage = (controllerName + "/" + actionName).Equals("Account/Lockedout");

                if (isLocked && !isFromLockedPage)
                {// isFromLockedPage: untuk mencegah infinite looping
                    context.Result = new RedirectToRouteResult(
                                                    new RouteValueDictionary(new { controller = "Account", action = "Lockedout" })
                                                );
                }
                else
                {
                    bool isBypassed = descriptor.MethodInfo.GetCustomAttributes(typeof(BypassFilterAttribute), false).Any();
                    // check no filter attribute
                    if (!isBypassed) // jika action tidak punya bypass filter
                    {
                        bool isAllowed = false;

                        // get List Action Value
                        var actions = user.Claims.Where(x => x.Type == "Action");

                        if (actions.Count() > 0)
                        {
                            var actionAllowed = false;
                            foreach (var action in actions)
                            {
                                var listActions = action.Value.Split(';').ToList();

                                // cek apakah nama controller global ada (controller.*)

                                actionAllowed = listActions.Contains(controllerName + ".*") || // is allowed jika punya Controller.*
                                            listActions.Contains(controllerName + "." + actionName); // atau punya nama actionnya
                                isAllowed = isAllowed || actionAllowed;
                            }
                        }

                        if (!isAllowed) context.Result = new StatusCodeResult(403);
                    }
                }
            }

            base.OnActionExecuting(context);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            base.OnResultExecuting(context);
        }

        public override void OnResultExecuted(ResultExecutedContext context)
        {
            base.OnResultExecuted(context);
        }

    }

    class FilterResult
    {
        public bool isAllowed { get; set; }
        public int httpCode { get; set; }
    }
}
