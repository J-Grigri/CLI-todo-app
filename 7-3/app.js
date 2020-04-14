//define the app
const express = require ("express");
const app = express()
const hbs = require("hbs")


app.get("/", (request,response)=>{
    //request includes all things browser can receive. resoponse is what we send
    console.log(request)
    response.send("hello world")
})

app.listen(5000, ()=> {
    console.log("server is running on 5000")
})