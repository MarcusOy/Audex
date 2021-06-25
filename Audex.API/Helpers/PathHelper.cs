using System.IO;
using System;


namespace Audex.API.Helpers
{
    public static class PathHelper
    {
        public static string GetProperPath(string path)
        {
            // Checking for Unix home directory
            if (path.Contains('~'))
            {
                path = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                    path.Substring(path.IndexOf('~') + 2) // Remove the ~/ from the path
                );
            }


            return path;
        }
    }
}