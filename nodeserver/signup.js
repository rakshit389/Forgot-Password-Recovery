var mongoose = require('mongoose');
var NewSchema = new mongoose.Schema({
        email : {
            type : String ,
            required : true ,
        } ,
        mobile_number : {
            type : String ,
            required : true 
        } ,
        password : {
            type : String ,
            required : true 
        } 
    });
    
module.exports = mongoose.model('UsersData' , NewSchema , 'UsersData');
 

