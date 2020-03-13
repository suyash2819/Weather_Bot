
var messageEndpoint = '/api/message';
var sessionEndpoint = '/api/session';
 var sessionId = null;
//
// function getSessionId(callback) {
//     var http = new XMLHttpRequest();
//     http.open('GET', sessionEndpoint, true);
//     http.setRequestHeader('Content-type', 'application/json');
//     http.onreadystatechange = function () {
//       if (http.readyState === XMLHttpRequest.DONE) {
//         let res = JSON.parse(http.response);
//         sessionId = res.result.session_id;
//         callback();
//       }
//     };
function request()
{
  var s=document.getElementById('message').value
  // const inv = {
  //   input: s
  // }
  //
  // const j=JSON.stringify(inv)
  //     http.send();
  //   }
  axios.post('/api/message', {
      input: s
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  // var http = new XMLHttpRequest();
  //   http.open('POST', '/api/message', true);
  //   http.setRequestHeader('Content-type', 'application/json');
  //   http.onreadystatechange = function() {
  //     if (http.readyState === XMLHttpRequest.DONE && http.status === 200 && http.responseText) {
  //       // Api.setResponsePayload(http.responseText);
  //       document.getElementById('result').innerHTML=this.responseText
  //       console.log("this is it"+this.responseText);
  //     } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
  //       // Api.setErrorPayload({
  //       //   'output': {
  //       //     'generic': [
  //       //       {
  //       //         'response_type': 'text',
  //       //         'text': 'I\'m having trouble connecting to the server, please refresh the page'
  //       //       }
  //       //     ],
  //       //   }
  //       // });
  //       console.log('error');
  //     }
  //   };
  //   http.send();
}
