// using System;
// using System.Collections.Generic;
// using System.Linq;
// using Audex.API.Data;
// using Audex.API.GraphQL.Extensions;

// using Audex.API.Services;
// using HotChocolate;
// using HotChocolate.AspNetCore.Authorization;
// using HotChocolate.Data;
// using HotChocolate.Types;
// using Microsoft.EntityFrameworkCore;

// namespace Audex.API.GraphQL.Queries
// {
//     [ExtendObjectType("Query")]
//     public class FormQueries
//     {
//         [Authorize]
//         public GetFormSchemaResponse GetFormSchema(string entityName,
//                                     [Service] IFormService formService)
//         {
//             var s = formService.GetFormSchema(entityName);
//             return new GetFormSchemaResponse
//             {
//                 Schema = s.schema,
//                 UISchema = s.uiSchema
//             };
//         }
//     }

//     public class GetFormSchemaResponse
//     {
//         public string Schema { get; set; }
//         public string UISchema { get; set; }
//     }
// }