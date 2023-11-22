
var email = doccument.getElementById('Email1');
var password = doccument.getElementById('Password');

if( email.value == "" || email.value == null )
{
    alert("Enter your email");
}
if( password.length < 6 )
{
    alert("Password is too short");
}