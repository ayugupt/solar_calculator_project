const express = require('express');
const cookie = require('cookie-parser')
const app = express();
const axios = require('axios')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.js')
const compiler = webpack(config)
const webpackHotReload = require('webpack-hot-middleware')

const path = require('path')
const Error = require('./utils/error.js')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

app.use(function(req, res, next){
    if(!req.cookies.SameSite){
        res.cookie("SameSite", "Lax")
    }
    next()
})

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    writeToDisk: true
}))
app.use(webpackHotReload(compiler))

app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function(req, res, next){
    res.sendFile(path.join(__dirname, "./public/pages/main.html"))
})

app.post("/getPredictionData", async function(req, res, next){
    try{
        let result = await axios.post("http://79f24cb4-8892-441e-b0ed-e2e698cbb2ab.centralindia.azurecontainer.io/score", req.body)
        res.send(result.data)
    }catch(e){
        console.log(e)
        next(new Error(400, e))
    }
})

app.use(function(req, res){
    throw new Error(404, "Page not found")
})

app.use(function(error, req, res, next){
    let statusCode = error.status || 400;
    let message = error.message
    res.status(statusCode).send(!message?error:`${message}`);
})


module.exports = app;