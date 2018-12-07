using Microsoft.AspNetCore.Authorization;

namespace SETPPBO.Models
{
    [Authorize]
    public class ConfigSmtp
    {
        public string SenderAddress { get; set; }
        public string SenderName { get; set; }
        public string SenderSecret { get; set; }
        public string SenderServer { get; set; }
        public string SenderDomain { get; set; }
    }
}
