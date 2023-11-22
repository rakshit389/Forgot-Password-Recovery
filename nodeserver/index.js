var express = require('express');
require('./database');
var fs = require('fs');
var os = require('os');
path = require('path');
validator = require("email-validator");
const bodyparser = require('body-parser');
var  sendEmail = require('./nodemail');
const bcrypt = require("bcrypt");
var NewModel1 = require('./signup');
var NewModel2 = require('./tokenModel');
var sendmsg = require('./sendmsg_mo_number');
var  generate_token  = require('./generateToken');
var  encrypt_data = require('./generateToken');
var  decrypt_data = require('./generateToken');
var reverseString = require('./reverseString');

const hbs = require('hbs');
const PORT = 8000 ;

var app = express();                                      

app.get('/signin' , ( req,res ) => {                                                // Sign in request handle
    res.sendFile( 'E:/Forgot  Password Project/program/login.html' , (err) => {
        if(err)
            console.log("File not sent");
        else
            console.log("File sent");
    });

});
 
app.get('/signup' , ( req,res ) => {                                               // Sigup request handle
    res.sendFile( "E:/Forgot  Password Project/program/signup.html" , (err) => {
        if(err)
            console.log("File not sent");
        else
            console.log("File sent");
    });
})

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.post( '/formdata' , async(req, res, next) => {                      // Signup data save in mongoose database
     
    let result1 = await NewModel1.findOne( { 'email' : req.body.email } );
    let result2 = await NewModel1.findOne( { 'mobile_number' : req.body.mobile_number } );
    if( !validator.validate( req.body.email ) )
    {
        res.send(`<center><h2>Please check your email</h2></center>`);
    }
    else if( result1 )
        res.send(`<center><h2>Email address already in use</h2></center>`);
    else if( result2 )
        res.send(`<center><h2>Mobile number already in use</h2></center>`);
    else 
        next();
  }, 
  async( req,res ) => {

    const password = await bcrypt.hash( req.body.password , 10);
    let data = new NewModel1( { 'email' : req.body.email ,
                                'mobile_number' : req.body.mobile_number ,
                                'password' : password 
    });
    let result = await data.save() ;
    res.redirect('http://localhost:8000/signin');

})
app.post( '/authentication' , async( req,res ) => {                         // Login attempt data validation

    let result = await NewModel1.findOne( { 'email' : req.body.email } ) ;
    let match = await bcrypt.compare( req.body.password , result.password );
    if( result && match  )
    {
        res.sendFile( "E:/Forgot  Password Project/program/loggedin.html" , (err) => {
            if(err)
                console.log("File not sent");
            else
                console.log("File sent");
        });
    }
    else
    {
        res.sendFile( "E:/Forgot  Password Project/program/loginfail.html" , (err) => {
            if(err)
                console.log("File not sent");
            else
                console.log("File sent");
        });
    }
         
})

app.get( '/forgot' , async( req,res) => {                                           // Forgot password page open for email 

    res.sendFile( "E:/Forgot  Password Project/program/forgot.html" , (err) => {
        if(err)
            console.log("File not sent");
        else
            console.log("File sent");
    });
});

app.get( '/mobile_number' , async( req,res) => {                                    // Forgot password page open for mobile number                   

    res.sendFile( "E:/Forgot  Password Project/program/mobile_number.html" , (err) => {
        if(err)
            console.log("File not sent");
        else
            console.log("File sent");
    });
});

app.post( '/otpverificationbymobile' , async( req,res) =>                           // Sending password reset url in mobile number
{   
    let result1 = await NewModel1.findOne( req.body ) ;
    try 
    {
        const [ encryptedData , vector ] = generate_token.generate_token() ;         // Function call for generating token in encrypted form 
        let id =  reverseString.reverseString( result1._id.toString()) ;
        token_saved( result1._id , result1.email ,  result1.mobile_number ,  encryptedData , vector );     // Saving token in database with email
        message = `Url : http://localhost:8000/resetPassword?token=${encryptedData}&_id=${id} ` ;
        sendmsg.sendmsg( message , result1.mobile_number );
        res.send( `<center><h2>Password reset link has been sent to your mobile number</h2></center>`);
    } catch {
        res.send(`<center><h2>Sorry this mobile number does not have account</h2></center>`);
    }
    async function token_saved( userid , email , mobile_number , encryptedData , vector )           // Saving tokem in database tokenModel
    {
        let result = await NewModel2.findOneAndUpdate( { 'userId' : userid , 'email': email , 'mobile_number' :  mobile_number } , {  'token' : encryptedData , 'vector' : vector } , {  upsert: true  });       // If token is already preesent then update token
    }

}) ;
 

 
app.post( '/otpverification'  , async( req,res) => {                                  // Sending password reset url in email

    let result1 = await NewModel1.findOne( req.body ) ;
    console.log( result1 );
    try 
    {
        let [ encryptedData , vector ] = generate_token.generate_token() ;           // Function call for generating token in encrypted form 
        token_saved( result1._id , result1.email ,  encryptedData , vector  );       // Saving token and vector  in database with email      
        let id =  reverseString.reverseString( result1._id.toString() );
        context = { email : result1.email , link :  `http://localhost:8000/resetPassword?token=${encryptedData}&_id=${id}` }
        sendEmail.sendEmail( result1.email , context , 'OTP Verification ' ,  'mailTemplate'   );   //Sengin email with token
        res.send( `<center><h2>Password reset link has been sent to ${result1.email}</h2><h2>Valid for 5 minutes</h2></center>`);
    } catch {
        res.send(`<center><h3>Sorry this email address does not have account</h3></center>`);
    }  
    async function token_saved( userid , email , encryptedData , vector  )           // Saving tokem in database tokenModel
    {
        let result = await NewModel2.findOneAndUpdate( { 'userId' : userid , 'email' :  email } , {  'token' : encryptedData  , 'vector' : vector } , {  upsert: true  });       // If token is already preesent then update token
    }
    
});

app.set('view engine' , 'hbs');
app.set('views', '../views');

app.get('/resetPassword' , (req, res) => {
    
    res.render('resetPassword', { token  : req.query.token , userid : req.query._id } );

}) ;

app.post( '/updatePassword' , async(req,res) => {                                     // Save new password in database
    
    let userid = reverseString.reverseString( req.body.userid );
    let result1 = await NewModel2.findOne( { 'userId' : userid });
    if( result1 && decrypt_data.decrypt_data( result1.token , result1.vector ) == decrypt_data.decrypt_data( req.body.token , result1.vector )  ) 
    {
        if ( req.body.password == req.body.confirm_password  )
        {
            const password = await bcrypt.hash( req.body.password , 10);
            let result2 = await NewModel1.findOneAndUpdate( {_id : req.body.userid } , { password : password } , {  upsert: false });
            await NewModel2.findOneAndDelete({ 'userId' : userid });
            context = { email : result1.email };
            sendEmail.sendEmail( result1.email , context , 'Password Reset Successfully' ,  'updatedTemplate');
            res.send(  `<center><h3>Congrats ${result1.email}!!</h3><h3>Your password has changed successfully</h3></center>`);

        }
        else
            res.send(  `<center><h2>Password does not match!!</h2></center>` );
        
    }
    else
    {
        res.send( `<center><h2>Sorry this link has been expired!!</h2></center>`);
    }

})
 
app.get('*' , ( req,res ) => {                                                   // Handle request for invalid address
    res.sendFile( 'E:/Forgot  Password Project/program/error.html' , (err) => {
        if(err)
            console.log("File not sent");
        else
            console.log("File sent");
    });
});

app.listen( PORT , (err)=> {

    if(err)
        console.log("Error occured!!!");
    else
        console.log("Server is listening on port 8000");
});

 

 