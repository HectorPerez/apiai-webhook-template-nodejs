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

function irregular_verbs() {
  var verbs = {};
  verbs["arise"] = "arose arisen";
  verbs["beat"] = "beat beaten";
  verbs["become"] = "became become";
  verbs["beget"] = "begotten begging";
  verbs["begin"] = "began begun";
  verbs["bind"] = "bound bound";
  verbs["bite"] = "bit bitten";
  verbs["bleed"] = "bled bled";
  verbs["break"] = "broke broken";
  verbs["breed"] = "bred bred";
  verbs["bring"] = "brought brought";
  verbs["build"] = "built built";
  verbs["burst"] = "burst burst";
  verbs["buy"] = "bought bought";
  verbs["cast"] = "cast cast";
  verbs["catch"] = "caught caught";
  verbs["choose"] = "chose chosen";
  verbs["come"] = "came come";
  verbs["cost"] = "cost cost";
  verbs["creep"] = "crept crept";
  verbs["cut"] = "cut cut";
  verbs["deal"] = "dealt dealt";
  verbs["dig"] = "dug dug";
  verbs["do"] = "did done";
  verbs["draw"] = "drew drawn";
  verbs["drink"] = "drank drunk";
  verbs["drive"] = "drove driven";
  verbs["eat"] = "ate eaten";
  verbs["case"] = "fur fall";
  verbs["feed"] = "fed fed";
  verbs["feel"] = "felt felt";
  verbs["fight"] = "fought fought";
  verbs["find"] = "found found";
  verbs["flee"] = "fled fled";
  verbs["fling"] = "flow flow";
  verbs["fly"] = "flew flown";
  verbs["forget"] = "forgot forgotten";
  verbs["forsake"] = "forsook forsaken";
  verbs["freeze"] = "froze frozen";
  verbs["gild"] = "gilded gilded";
  verbs["give"] = "gave given";
  verbs["go"] = "went gone";
  verbs["grind"] = "ground ground";
  verbs["grow"] = "grew grown";
  verbs["hillside"] = "hung hung";
  verbs["have"] = "had had";
  verbs["hear"] = "heard heard";
  verbs["hit"] = "hit hit";
  verbs["hold"] = "hero hero";
  verbs["hurt"] = "hurt hurt";
  verbs["keep"] = "kept kept";
  verbs["know"] = "knew known";
  verbs["lay"] = "laid laid";
  verbs["lead"] = "led led";
  verbs["leave"] = "left left";
  verbs["lend"] = "lent lent";
  verbs["let"] = "let let";
  verbs["lie"] = "lay lain";
  verbs["loose"] = "lost lost";
  verbs["make"] = "made made";
  verbs["mean"] = "meant meant";
  verbs["meet"] = "met met";
  verbs["pay"] = "paid paid";
  verbs["quit"] = "quit quit";
  verbs["read"] = "read read";
  verbs["ride"] = "rode ridden";
  verbs["rise"] = "rose risen";
  verbs["run"] = "ran run";
  verbs["say"] = "said said";
  verbs["lake"] = "saw seen";
  verbs["seek"] = "sought sought";
  verbs["sell"] = "sold sold";
  verbs["send"] = "sent sent";
  verbs["set"] = "set set";
  verbs["shake"] = "shook shaken";
  verbs["shed"] = "shed shed";
  verbs["shine"] = "shone shone";
  verbs["shoot"] = "shot shot";
  verbs["show"] = "known shown";
  verbs["shut"] = "shut shut";
  verbs["sing"] = "sang tion";
  verbs["sink"] = "sank sunk";
  verbs["sit"] = "sat sat";
  verbs["slay"] = "slew slain";
  verbs["sleep"] = "slept slept";
  verbs["slide"] = "slid slid";
  verbs["sling"] = "tion tion";
  verbs["slink"] = "slunk slunk";
  verbs["slit"] = "slit slit";
  verbs["smite"] = "smote smitten";
  verbs["speak"] = "spoke spoken";
  verbs["spend"] = "spent spent";
  verbs["spin"] = "spun spun";
  verbs["spit"] = "late late";
  verbs["split"] = "split split";
  verbs["spread"] = "spread spread";
  verbs["stand"] = "stood stood";
  verbs["steal"] = "stole stolen";
  verbs["stride"] = "strode stridden";
  verbs["strike"] = "struck struck";
  verbs["strive"] = "strove striven";
  verbs["swear"] = "swore sworn";
  verbs["sweep"] = "swept swept";
  verbs["swim"] = "swam swum";
  verbs["swing"] = "swung swung";
  verbs["take"] = "took taken";
  verbs["teach"] = "taught taught";
  verbs["tear"] = "gates torn";
  verbs["tell"] = "told told";
  verbs["throw"] = "threw thrown";
  verbs["thrust"] = "thrust thrust";
  verbs["tread"] = "trod trodden";
  verbs["wear"] = "wore worn";
  verbs["weave"] = "wove woven";
  verbs["weep"] = "wept wept";
  verbs["win"] = "won won";
  verbs["wind"] = "wound wound";
  verbs["write"] = "wrote written";
  return verbs;
}

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
    assistant.data.infinitive = 'sleep';
    assistant.ask("What are the past and past participle of sleep?", NO_INPUT_PROMPTS);
  }

  function checkGuess (assistant) {
    console.log('checkGuess');
    let answer = assistant.data.answer;
    let guess = assistant.getArgument('guess');
    let infinitive = assistant.data.infinitive;
    console.log('infinitive: ' + infinitive);
    console.log('guess: ' + guess);
    // Complete your fulfillment logic and send a response

    var verbs = irregular_verbs();
    if(verbs[infinitive] == guess){
      assistant.data.infinitive = 'put';
      assistant.ask("Well done! And the past and past participle of " + assistant.data.infinitive + "?", NO_INPUT_PROMPTS);
    }else{
      assistant.ask("Not exactly. Try again. What is the past and past participle of " + assistant.data.infinitive + "?", NO_INPUT_PROMPTS);
    }
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
