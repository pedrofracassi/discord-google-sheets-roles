# discord-google-sheets-roles
Discord bot that assigns roles based on Google Sheets

## Setup instructions

### What you'll need

1. Credentials for a Google Service Account. [How-to](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
2. A Discord bot token. [How-to](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
3. A computer/server with docker installed. [Install instructions](https://docs.docker.com/get-docker/)

### How to set it up

> I know this is not very detailed. I'll write a better tutorial when I have more time.

1. Mount both your `config.json` file to `/app` on the bot's container
2. Rename your Google Service Account credentials file to `google_service_account.json` and mount it to `/app` too
3. Run the container!
