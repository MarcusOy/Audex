using HotChocolate;

namespace Audex.API.GraphQL
{
    public class GraphQLErrorFilter : IErrorFilter
    {
        public IError OnError(IError error)
        {
            return error.WithMessage(error.Exception is null
            ? error.Message
            : error.Exception.Message);
        }
    }
}