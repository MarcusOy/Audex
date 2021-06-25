// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Reflection;
// using Json.Schema;
// using Json.Schema.Generation;

// namespace Audex.API.Services
// {
//     public interface IFormService
//     {
//         (string schema, string uiSchema) GetFormSchema(string entityName);
//         // ICollection<ValidationError> ValidateFormData(string entityName, string data);

//     }
//     public class FormService : IFormService
//     {
//         public FormService()
//         {
//         }

//         public (string schema, string uiSchema) GetFormSchema(string entityName)
//         {
//             return (
//                 schema: GetSchema(entityName),
//                 uiSchema: "" // TODO: figure out how to do UI schema
//             );
//         }

//         // public ICollection<ValidationError> ValidateFormData(string entityName, string data)
//         // {
//         //     var schema = GetSchema(entityName).Validate(data);
//         //     var validator = new JsonSchemaValidator();
//         //     return validator.Validate(data, schema);
//         // }

//         private JsonSchema GetSchema(string entityName)
//         {

//             // var settings = new JsonSchemaGeneratorSettings
//             // {
//             //     AlwaysAllowAdditionalObjectProperties = true
//             // };
//             return new JsonSchemaBuilder()
//                 .FromType(GetTypeFromString(entityName))
//                 .Build();
//         }

//         private Type GetTypeFromString(string entityName)
//         {
//             try
//             {
//                 // Prevents assembly traversal
//                 var modelsNamespace = "Audex.API.Models";
//                 return Assembly.GetExecutingAssembly().GetTypes().Where(p =>
//                     p.Namespace == modelsNamespace &&
//                     p.Name.Contains(entityName)
//                 ).ToList()
//                 .First();
//             }
//             catch
//             {
//                 throw new InvalidOperationException("No form was found for this entity name.");
//             }
//         }
//     }
// }