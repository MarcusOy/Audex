using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Audex.API.Helpers;
using Audex.API.Models;
using Microsoft.Extensions.Options;
using OneSignal.RestAPIv3.Client;
using OneSignal.RestAPIv3.Client.Resources;
using OneSignal.RestAPIv3.Client.Resources.Notifications;

namespace Audex.API.Services
{
    public interface INotificationService
    {
        /// <summary>
        /// Creates and delivers a notification based on passed in creation object
        /// TODO: make this notification platform agnostic
        /// </summary>
        /// <param name="notification">All parameters needed for a push notification</param>
        /// <returns>Response from the push notification server</returns>
        Task<NotificationCreateResult> SendNotification(NotificationCreateOptions notification);
    }

    public class OneSignalNotificationService : INotificationService
    {
        private readonly OneSignalClient _oneSignalClient;
        private readonly AudexSettings _settings;
        public OneSignalNotificationService(IOptions<AudexSettings> settings)
        {
            _settings = settings.Value;
            _oneSignalClient = new OneSignalClient(_settings.Notifications.ApiKey);
        }

        public async Task<NotificationCreateResult> SendNotification(NotificationCreateOptions notification)
        {
            notification.AppId = new Guid(_settings.Notifications.AppId);
            return await _oneSignalClient.Notifications.CreateAsync(notification);
        }
    }

    public class TransferStackNotification : NotificationCreateOptions
    {
        public TransferStackNotification(Device fromDevice, Device toDevice, Stack stack) : base()
        {
            this.Headings.Add(LanguageCodes.English, "New stack transfer");
            this.Contents.Add(LanguageCodes.English, $"{fromDevice.Name} would like to send you a stack named {stack.VanityName.Name}{stack.VanityName.Suffix}.");
            this.IncludePlayerIds = new List<string> { toDevice.NotificationIdentifier };

            this.Data = new Dictionary<string, string>();
            this.Data.Add("StackId", stack.Id.ToString());
            this.TimeToLive = 1209600; // 14 days

            this.ActionButtons = new List<ActionButtonField>();
            this.ActionButtons.Add(new ActionButtonField
            {
                Id = "StackDownloadAndOpen",
                Text = "Download and Open"
            });
            this.ActionButtons.Add(new ActionButtonField
            {
                Id = "StackOpenInAudex",
                Text = "Open in Audex"
            });
        }
    }

    public class TransferClipNotification : NotificationCreateOptions
    {
        public TransferClipNotification(Device fromDevice, Device toDevice, Clip clip) : base()
        {
            this.Headings.Add(LanguageCodes.English, "New clip transfer");
            this.Contents.Add(LanguageCodes.English, $"{fromDevice.Name} would like to send you a clip with{(clip.IsSecured ? " secured " : " ")}content{(clip.IsSecured ? "." : ":")}\n{(clip.IsSecured ? "" : clip.Content.Truncate(25))}.");
            this.IncludePlayerIds = new List<string> { toDevice.NotificationIdentifier };

            this.Data = new Dictionary<string, string>();
            this.Data.Add("ClipId", clip.Id.ToString());
            this.TimeToLive = 1209600; // 14 days

            this.ActionButtons = new List<ActionButtonField>();
            this.ActionButtons.Add(new ActionButtonField
            {
                Id = "CopyClip",
                Text = "Copy"
            });
            this.ActionButtons.Add(new ActionButtonField
            {
                Id = "ClipOpenInAudex",
                Text = "Open in Audex"
            });
        }
    }
}