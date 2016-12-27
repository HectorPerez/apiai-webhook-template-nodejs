// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const CHECK_GUESS_ACTION = 'check_guess';
const GENERATE_ANSWER_ACTION = 'generate_answer';
const GREETING_PROMPTS = ['Let\'s play Number Genie!', 'Welcome to Number Genie!'];
const INVOCATION_PROMPT = ['I\'m thinking of a number from %s to %s. What\'s your first guess?'];
const NO_INPUT_PROMPTS = ['I didn\'t hear a number', 'If you\'re still there, what\'s your guess?', 'We can stop here. Let\'s play again soon.'];

app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  function generateAnswer (assistant) {
    console.log('generateAnswer');
    assistant.data.answer = 7;
    assistant.data.guessCount = 0;
    assistant.data.fallbackCount = 0;
    assistant.ask("kkk ", NO_INPUT_PROMPTS);
  }

  function checkGuess (assistant) {
    console.log('checkGuess');
    let answer = assistant.data.answer;
    let guess = assistant.getArgument('guess');
    // Complete your fulfillment logic and send a response
    assistant.tell('Hello, World! ' + guess);
    return;
  }

  let actionMap = new Map();
  actionMap.set(GENERATE_ANSWER_ACTION, generateAnswer);
  actionMap.set(CHECK_GUESS_ACTION, checkGuess);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
