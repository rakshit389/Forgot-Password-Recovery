const crypto = require('crypto');
var randomstring = require('randomstring')
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = "adnan-tech-programming-computers"  ;
const iv = crypto.randomBytes(16);

function generate_token()
{
   let token = randomstring.generate(7) ;
   console.log( token );
   const cipher = crypto.createCipheriv(algorithm, key , iv);
   let encryptedData = cipher.update( token , "utf-8", "hex");
   encryptedData += cipher.final("hex");
   const base64data = Buffer.from(iv, 'binary').toString('base64');
   return [ encryptedData , base64data ] ;
}

function encrypt_data( data )
{  
   const cipher = crypto.createCipheriv(algorithm, key , iv);
   let encryptedData = cipher.update( data , "utf-8", "hex");
   encryptedData += cipher.final("hex");
   const base64data = Buffer.from(iv, 'binary').toString('base64');
   return [ encryptedData , base64data ] ;
}

function decrypt_data( data , vector ) 
{
   const origionalData = Buffer.from( vector , 'base64') ;
   const decipher = crypto.createDecipheriv(  'aes-256-cbc' , key, origionalData );
   let decryptedData = decipher.update( data , "hex", "utf-8");
   decryptedData += decipher.final("utf8");
   return decryptedData ;
}

module.exports = { generate_token , encrypt_data , decrypt_data } ;