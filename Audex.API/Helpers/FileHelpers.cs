using System;
using System.IO;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Audex.API.Helpers
{
    public static class FileHelpers
    {
        public static IFormFile ToFormFile(this IFile file)
        {
            var f = file.GetPrivateFieldValue<IFormFile>("_file");
            return f;
        }

    }
}