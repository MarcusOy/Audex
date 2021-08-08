namespace Audex.API.Services
{
    public class AudexSettings
    {
        public string DisplayName { get; set; }
        public string DomainName { get; set; }
        public Jwt Jwt { get; set; }
        public FileSystem FileSystem { get; set; }
        public Notifications Notifications { get; set; }
        public Stacks Stacks { get; set; }
        public Clips Clips { get; set; }
    }

    public class Jwt
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }

    public class FileSystem
    {
        public string Persistant { get; set; }
        public string Temporary { get; set; }
    }
    public class Notifications
    {
        public string FcmId { get; set; }
        public string AppId { get; set; }
        public string ApiKey { get; set; }
    }
    public class Stacks
    {

    }
    public class Clips
    {
        public string StarterClip { get; set; }
    }
}