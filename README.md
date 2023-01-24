# slack-bolt-app
Slack app built with https://slack.dev/bolt-js/reference . This app can post messages to all channels the bot is member of.

Get .env keys from your slack app and add them to .env file, see .env.example

Run app with command 'node app.js' or 'npm run start'

<b>Current functionality:</b>
- Users in "bot_admins" channel can use the slash command /postallchannels to send a message to all channels that both the user and app are a member of.
- To clarify, only “master” admins who are in every private channel would be able to post to all channels at once. All other admins would only be able to post to channels they are a member of.


<b>In progress:</b>
- [x] validate user is in admin channel to submit slash command
- [ ] test/double check bot will only post to channels user is a member of
- [ ] look up way to auto add app to new channels
- [ ] plan for how to run & maintain bot on multiple workspaces, probably need build scripts in cloud run
- [ ] Look into possibility of deleting a message posted by the app
    - [ ] If cannot delete messages, then maybe a seperate preview/test option before sending the message
- [ ] Look into unfurling images/links
- [ ]  How to get notified of replies in threads to bot messages
- [ ]  Command to retrieve list of all channels bot has been added to
