const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const token = process.env.SLACK_TOKEN || '';

const rtm = new RtmClient(token, {
  logLevel: 'error',
  // logLevel: 'debug',
  // Initialise a data store for our client, this will load additional helper functions for the storing and retrieval of data
  dataStore: new MemoryDataStore(),
  // Boolean indicating whether Slack should automatically reconnect after an error response
  autoReconnect: true,
  // Boolean indicating whether each message should be marked as read or not after it is processed
  autoMark: true,
});

/* proxy for now, for flexibility in this area later */
const setState = (newState) => {
  state = newState;
}

const states = {
  DEFAULT: "DEFAULT",
  GET_NAME: "GET_NAME",
  GET_ADDRESS: "GET_ADDRESS",
  GET_PHONE: "GET_PHONE"
}

/* init state, set initial state */
let state;
state = states.DEFAULT;

/* functions that send responses and set state, called based on state */

const handlers = {};

handlers.DEFAULT = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("Welcome! What's your name?", message.channel);
  setState(states.GET_NAME);
  console.log(message.text, state);

}

handlers.GET_NAME = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("Ok, what's your address?", message.channel);
  setState(states.GET_ADDRESS);
  console.log(message.text, state);

}

handlers.GET_ADDRESS = (message) => {

  console.log(message.text, state);

  rtm.sendMessage("What's your phone number?", message.channel);
  setState(states.GET_PHONE);
  console.log(message.text, state);

}

handlers.GET_PHONE = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("All set!", message.channel)
  setState(states.DEFAULT);
  console.log(message.text, state);
}

const router = (message) => {
  handlers[state](message);
}

// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  router(message);
});

rtm.start();
