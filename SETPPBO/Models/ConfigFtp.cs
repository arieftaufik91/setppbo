using Microsoft.AspNetCore.Authorization;

namespace SETPPBO.Models
{
    [Authorize]
    public class ConfigFtp
    {
        public string FtpLocation { get; set; }
        public string FtpUsername { get; set; }
        public string FtpPassword { get; set; }
    }
}