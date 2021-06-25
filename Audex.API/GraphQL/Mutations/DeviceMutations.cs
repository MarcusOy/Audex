using System;
using System.Threading.Tasks;
using System.Threading;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.Types;
using Audex.API.Models;
using Audex.API.Data;
using System.Linq;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class DeviceMutations
    {
        public async Task<Device> EditDevice(EditDeviceRequest request,
                                            [Service] AudexDBContext dbContext,
                                            [Service] IIdentityService idService,
                                            [Service] ISubscriptionService subService)
        {
            Thread.Sleep(1000);

            var d = dbContext.Devices
                .FirstOrDefault(d => d.Id == idService.CurrentDevice.Id
                    && d.UserId == idService.CurrentUser.Id);
            if (d == null)
                throw new InvalidOperationException("Unable to edit the current device.");

            d.Name = request.Name;
            d.DeviceTypeId = request.DeviceType;
            d.IsFirstTimeSetup = true;
            await dbContext.SaveChangesAsync();

            await subService.NotifyAsync(SubscriptionTopic.OnUserUpdate, idService.CurrentUser.Id);

            return d;
        }
    }
    public class EditDeviceRequest
    {
        public string Name { get; set; }
        public DeviceTypeEnum DeviceType { get; set; }
    }

}