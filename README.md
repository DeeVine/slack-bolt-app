# slack-bolt-app
Slack app built with https://slack.dev/bolt-js/reference . This app can post messages to all channels the bot is member of.

Get .env keys from your slack app and add them to .env file, see .env.example

Run app with command 'node app.js' or 'npm run start'

todo:
[x] validate user is in admin channel to submit slash command
[x] update app icon
[ ] update modal messaging
[ ] change admin channel name
[ ] create app for Sentry workspace
    [ ] test another app with diff secrets, then setup Sentry workspace
    [ ] set up new secrets in google cloud
    [ ]
[ ] look up method to auto add bot to new channels
[ ] plan for how to run & maintain bot on multiple workspaces



