const express = require('express');
const request = require('request');
const bodyParser = require('body-parser'),
    DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10,
    DEFAULT_PARAMETER_LIMIT = 10000;

const AssistantV2 = require('ibm-watson/assistant/v2');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

const assistant = new AssistantV2({
    version: '2020-02-05',
    authenticator: new IamAuthenticator({
        apikey: 'lzDZKwPPZXduFKzav4PGnRl5zn46EE_2fihYzvA3iCYs',
    }),
    url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/5d2e62aa-d4f2-4665-9b1e-83d08725bf94',
});

const app = express();
app.set("view engine", "ejs");
app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/api/message', (req, res) => res.render('bot'))

app.post('/api/message', (req, res) => {
    assistant.createSession({
            assistantId: '0f546000-8603-4c34-a20c-6af8e4b9d7b6'
        })
        .then(sid => {
            assistant.message({
                    assistantId: '0f546000-8603-4c34-a20c-6af8e4b9d7b6',
                    sessionId: sid.result.session_id,
                    input: {
                        'message_type': 'text',
                        text: req.body.input
                    }
                })
                .then(mes => {
                    if(req.body.input.toLowerCase().includes("weather"))
                    {
                        city = mes.result.output.entities[0].value
                        request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2442ee4b759045ac7f1d3aa1178b63a8&units=metric`, function(err, response, body) {
                            if (err) {
                                console.log('error:', err);
                            } else {
                                res.json(body);
                            }
                      });
                    }
                    else
                    {
                      var jstring=JSON.stringify(mes)
                      res.json(jstring);
                    }
                    var city = null;

                })
                .catch(err => {
                    console.log(err);
                });

        })
        .catch(err => {
            console.log(err);
        });
});

// app.get('/api/session', function(req, res) {
//   assistant.createSession(
//     {
//       assistantId: '0f546000-8603-4c34-a20c-6af8e4b9d7b6',
//     },
//     function(error, response) {
//       if (error) {
//         return res.send(error);
//       } else {
//         return res.send(response);
//       }
//     }
//   );
// });

//
// app.post('/api/message', function(req, res) {
//   let assistantId = '0f546000-8603-4c34-a20c-6af8e4b9d7b6';
//   if (!assistantId || assistantId === '0f546000-8603-4c34-a20c-6af8e4b9d7b6') {
//     return res.json({
//       output: {
//         text:
//           'The app has not been configured with a <b>ASSISTANT_ID</b> environment variable. Please refer to the ' +
//           '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' +
//           'Once a workspace has been defined the intents may be imported from ' +
//           '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.',
//       },
//     });
//   }
//
//   var textIn = '';
//
//   if (req.body.input) {
//     textIn = req.body.input.text;
//   }
//
//   var payload = {
//     assistantId: assistantId,
//     sessionId: req.body.session_id,
//     input: {
//       message_type: 'text',
//       text: textIn,
//     },
//   };
//
//   // Send the input to the assistant service
//   assistant.message(payload, function(err, data) {
//     if (err) {
//       const status = err.code !== undefined && err.code > 0 ? err.code : 500;
//       return res.status(status).json(err);
//     }
//
//     return res.json(data);
//   });
// });
//
app.listen(3000, () => console.log('Listening on port 3000'))
