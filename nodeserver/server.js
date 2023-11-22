var express = require("express")

const app = express();
app.get( '/home' , (req,res) => {
    res.send("hello world motherfucker");
});

app.listen(8000 , ()=> {
    console.log("server is listening")
})