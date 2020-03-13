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
        apikey: 'API_KEY',
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
            assistantId: 'ASSITANT_ID'
        })
        .then(sid => {
            assistant.message({
                    assistantId: 'ASSITANT_ID',
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
                        request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=API_ID&units=metric`, function(err, response, body) {
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
var theport = process.env.PORT || 3000;
app.listen(theport, () => console.log("Listening on port 3000"));
