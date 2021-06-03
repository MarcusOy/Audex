namespace Audex.API.Services
{
    public class AudexSettings
    {
        public string DisplayName { get; set; }
        public string DomainName { get; set; }
        public Jwt Jwt { get; set; }
        public FileSystem FileSystem { get; set; }
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
}