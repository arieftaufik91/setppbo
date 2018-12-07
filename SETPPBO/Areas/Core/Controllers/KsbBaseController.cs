using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SETPPBO.Controllers
{
    public class KsbBaseController : Controller
    {
        private string accessToken;
        private string refreshToken;

        public IConfiguration Configuration { get; }
        private string ksbUrl;
        private string sSOUrl;

        public KsbBaseController(IConfiguration configuration)
        {
            Configuration = configuration;           
            ksbUrl = Configuration["KSB:URL"];
            sSOUrl = Configuration["Authentication:KemenkeuID:SSOUrl"];
        }

        #region <----- Helper ----->

        protected async Task<HttpResponseMessage> PostAsync(string uri, object model)
        {
            // get access token
            await GetAccessToken();
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(model.ToString(), Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.PostAsync(ksbUrl + uri, content);
                    response.EnsureSuccessStatusCode();
                }
                catch (Exception e)
                {
                    var message = e.Message;
                    return new HttpResponseMessage(HttpStatusCode.BadRequest);
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        protected async Task<HttpResponseMessage> PutAsync(string uri, object model)
        {
            // get access token
            await GetAccessToken();
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(model.ToString(), Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.PutAsync(ksbUrl + uri, content);
                    response.EnsureSuccessStatusCode();
                }
                catch (Exception e)
                {
                    var message = e.Message;
                    return new HttpResponseMessage(HttpStatusCode.BadRequest);
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        protected async Task<HttpResponseMessage> DeleteAsync(string uri)
        {
            // get access token
            await GetAccessToken();
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await client.DeleteAsync(ksbUrl + uri);
                    response.EnsureSuccessStatusCode();
                }
                catch (Exception)
                {
                    return new HttpResponseMessage(HttpStatusCode.BadRequest);
                }
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        protected async Task<string> GetStringAsync(string uri)
        {
            // get access token
            await GetAccessToken();
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var response = await client.GetStringAsync(ksbUrl + uri);
                    return response;
                }
                catch (Exception e)
                {
                    return e.StackTrace;
                }
            }
        }

        private async Task GetAccessToken()
        {
            var accTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken"));
            if(accTokenClaim != null)
            {
                accessToken = accTokenClaim.Value;
            } else
            {
                await GetNewAccessToken();
            }
            //bool isValid = await AccessTokenIsValid(accessToken);
            //if (!isValid)
            //{
            //    GetNewAccessToken();
            //}
        }

        private void GetRefreshToken()
        {
            var refreshTokenClaim = User.Claims.FirstOrDefault(x => x.Type.Equals("refreshToken"));
            if(refreshTokenClaim != null)
            {
                refreshToken = refreshTokenClaim.Value;
            }
        }

        private async Task GetNewAccessToken()
        {
            GetRefreshToken();
            string requestBody = "client_id=devapps&client_secret=1234&grant_type=refresh_token&refresh_token=" + refreshToken;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(requestBody, Encoding.UTF8, "application/x-www-form-urlencoded");
                    var response = await client.PostAsync(sSOUrl + "/oauth/token", content);
                    var data = await response.Content.ReadAsStringAsync();
                    var dict = JsonConvert.DeserializeObject<OauthToken>(data);
                    // update access token
                    accessToken = dict.access_token;
                    //((ClaimsIdentity)User.Identity).RemoveClaim(User.Claims.FirstOrDefault(x => x.Type.Equals("accessToken")));
                    ((ClaimsIdentity)User.Identity).AddClaim(new Claim("accessToken", accessToken));
                }
                catch (Exception e)
                {
                    var message = e.Message;
                }
            }
        }

        private async Task<bool> AccessTokenIsValid(string paramAccessToken)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", paramAccessToken);
                var response = await client.GetAsync("http://api.kemenkeu.go.id/api/Values/Get");
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        private class OauthToken
        {
            public string access_token { get; set; }
            public string expires_in { get; set; }
            public string refresh_token { get; set; }
        }

        #endregion
    }
}