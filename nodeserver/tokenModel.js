var mongoose = require('mongoose');
var NewSchema = new mongoose.Schema({
    userId: 
    {
        type: String ,
        required: true,
    } ,
    email: 
    {
        type: String ,
        required: true,
    } ,
    mobile_number : 
    {
        type: String ,
        required: true,
    } ,
    token :
    {
        type : String ,
        required : true 
    } ,
    vector :
    {
        type : String ,
        required : true 
    } ,
    Created :
    {
        type : Date ,
        default : Date.now ,
        expires : 500
    }
    });
    
module.exports = mongoose.model('TokenData' , NewSchema , 'TokenData');
 