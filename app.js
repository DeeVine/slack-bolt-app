require('dotenv').config();
const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, 
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

(async () => {
  // Start your app
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
// const { WebClient, LogLevel } = require("@slack/web-api");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
// const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
//   // LogLevel can be imported and used to make debugging simpler
//   logLevel: LogLevel.DEBUG
// });

//create Home tab view
app.event('app_home_opened', async ({ event, client, context }) => {
  console.log(event);
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Welcome to your _App's Home_, see list of commands below* :tada:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Available commands:\n/postallchannels: post a message to all channels ths bot is a member of. \n/postspecificchannels: post a message to specific channels ths bot is a member of."
            }
          }
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

// Listen for a slash command invocation
app.command('/postallchannels', async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'post_all_channels',
        title: {
          type: 'plain_text',
          text: 'Post to all channels'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Submitting this modal will post your message to all channels the bot is a member of.'
            }
          },
          {
            type: 'input',
            block_id: 'block_1',
            label: {
              type: 'plain_text',
              text: 'What is your message?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'post_message',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

// Listen for a slash command invocation
app.command('/postspecificchannel', async ({ ack, body, client, logger }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'post_all_channels',
        title: {
          type: 'plain_text',
          text: 'Post to all channels'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Submitting this modal will post your message to specific channels this bot is a member of'
            }
          },
          {
            type: 'input',
            block_id: 'block_2',
            label: {
              type: 'plain_text',
              text: 'Channels you wish to post to, provide a comma separated list i.e "general,random,viritual-coffee" '
            },
            element: {
              type: 'plain_text_input',
              action_id: 'post_channels',
              multiline: true
            }
          },
          {
            type: 'input',
            block_id: 'block_1',
            label: {
              type: 'plain_text',
              text: 'What is your message?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'post_message',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

// Handle view_submission request for when someone submits modal 'post_all_channels'
app.view('post_all_channels', async ({ ack, body, view, client, logger }) => {
  // Acknowledge the view_submission request
  await ack();

  // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission

  // Assume there's an input block with `block_1` as the block_id and `input_a`
  const val = view['state']['values']['block_1']['post_message'];
  // const val2 = view['state']['values']['block_2']['post_channels'];
  const user = body['user']['id'];

  console.log('submissionVal',val);
  // console.log('val2',val2);
  console.log('user',user);

  postMessagesToChannels(val.value);

  // Message to send user
  let msg = '';
  // Save to DB
  // const results = await db.set(user.input, val);

  // if (results) {
  //   // DB save was successful
  //   msg = 'Your submission was successful';
  // } else {
  //   msg = 'There was an error with your submission';
  // }

  msg = `I posted your message: ${val.value}`;
  // Message the user
  try {
    await client.chat.postMessage({
      channel: user,
      text: msg
    });
  }
  catch (error) {
    logger.error(error);
  }

});

// Find conversation ID using the users.conversations method
async function findChannels() {

  const channelIds = [];
  
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.users.conversations({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN
    });
    
    for (const channel of result.channels) {
      // console.log(channel.id);
      channelIds.push(channel.id);
    }
  }
  catch (error) {
    console.error(error);
  }
  
  return channelIds;
  
}
  
// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    // console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

// Get channels bot is member of, then send a message to all channels
async function postMessagesToChannels(message) {
  (async () => {
    return await findChannels()
  })().then(channelIds => {
    console.log('all channelIds', channelIds)
    channelIds.map(id => {
      publishMessage(id, message);
    })
  })
}