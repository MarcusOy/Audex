// using System;
// using System.Collections.Generic;
// using HotChocolate;

// namespace Audex.API.GraphQL.Extensions
// {
//     public class CurrentUser
//     {
//         public Guid UserId { get; }
//         public string Username { get; }
//         public List<string> Claims { get; }

//         public CurrentUser(Guid userId, string username, List<string> claims)
//         {
//             UserId = userId;
//             Username = username;
//             Claims = claims;
//         }
//     }

//     public class CurrentUserGlobalState : GlobalStateAttribute
//     {
//         public CurrentUserGlobalState() : base("CurrentUser")
//         {
//         }
//     }
// }