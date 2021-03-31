using System.Text.RegularExpressions;

namespace Audex.API.Helpers
{
    public static class SanitizerHelper
    {
        public static string AlphaNumericSpaceCommaDash = "^[a-z\\d\\-_.\\s]+[(^.*?)(\\r)(\r\n|\n)]+$";

        public static string SanitizeString(string input, string pattern = null)
        {
            if (pattern is null)
                pattern = AlphaNumericSpaceCommaDash;
            return Regex.Replace(input, pattern, "");
        }
    }
}