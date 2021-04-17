using System.Net;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Audex.API.Services;
using Audex.API.Helpers;
using Audex.API.Data;

namespace Audex.API.Controllers
{
    [ApiController, Route("api/v1/[controller]"), EnableCors("APICors")]
    public class HeartbeatController : ControllerBase
    {
        public HeartbeatController() { }

        [HttpGet]
        public String Get()
        {
            var user = HttpContext.User;

            return "Server is online!";
        }
    }
}
