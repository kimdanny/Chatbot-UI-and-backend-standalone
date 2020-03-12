const Dialogflow = require('dialogflow');
const Pusher = require('pusher');

// You can find your project ID in your Dialogflow agent settings
const projectId = 'react-trial-epbrfq'; //from https://dialogflow.com/docs/agents#settings  complianceexpert-kexjvq / react-trial-epbrfq
const sessionId = '123456';
const languageCode = 'en-US';

const config = {
    credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    },
};

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
});

const sessionClient = new Dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const processMessage = message => {
    console.log(message)
    const request = {
    session: sessionPath,
    queryInput: {
        text: {
        text: message,
        languageCode,
        },
    },
    };

    sessionClient
    .detectIntent(request)
    .then(responses => {
        const result = responses[0].queryResult;
        return pusher.trigger('bot', 'bot-response', {
        message: result.fulfillmentText,
        });
    })
    .catch(err => {
        console.error('ERROR from process-message:', err);
    });
}

module.exports = processMessage;