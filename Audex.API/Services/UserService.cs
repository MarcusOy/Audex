using Audex.API.Models.Auth;

namespace Audex.API.Services
{
    public interface IUserService
    {
        public User CreateUser();
    }
    public class UserService : IUserService
    {
        public User CreateUser()
        {
            throw new System.NotImplementedException();
        }
    }
}