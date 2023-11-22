const fast2sms = require('fast-two-sms');
console.log(3);

function sendmsg( message , mobile_number  )
{
    authkey = '2obWiVRMlid72ReiDyKZzsXsE7uPiYlekEgKV9LsfUYZG8vandhbaGmVx8S6' ;
    var options = { authorization : authkey  , message : message  ,  numbers :  [ mobile_number ] }  ;
    fast2sms.sendMessage(options) //Asynchronous Function.
    
    fast2sms.sendMessage(options).then(response=>{
      console.log(response)
    })
}

module.exports = { sendmsg } 