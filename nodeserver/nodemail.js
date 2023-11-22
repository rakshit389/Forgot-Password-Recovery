var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

function sendEmail ( email  , context , subject , template )
{
  let transporter = nodemailer.createTransport({
     
    service : "gmail" ,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'rakshit.upd@gmail.com',  
      pass: 'fhdumoiwtcofsgqb',  
    }

  });

    transporter.use(
        'compile', hbs({
            viewEngine: {
                extname: '.hbs',
                layoutsDir: '../views/',
                defaultLayout: false,
                partialsDir: '../views/',
            },
            viewPath: '../views/',
            extName: '.hbs'
        }));

        var mailOptions = {

            from: 'rakshit.upd@gmail.com' ,
            to:   email   ,
            subject: subject ,
            template : template  ,
            context : context , 
           
          };          
      transporter.sendMail( mailOptions , function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = { sendEmail };
 