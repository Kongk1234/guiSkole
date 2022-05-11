const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fs = require('fs');
const {Hash, verifyHash} = require('simple-node-crypto');
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let username = "test"
let username2 = "test2"
let passwordsalt = "b73a8e1f4f362a83ca23e1e5ce2cdfcd"
let passwordhash = "3b2629050ebcb5b8a88239b3fd5b85bffad03cfddac5dce16335fb1a2950cd1eb4b2b3d7798e6fe6e2513ad71a1157f1addf0ee8a88eabba62c4ebac0913de4e"

class users {
    constructor(name, longitude, latitude, me) {
      this.name = name;
      this.longitude = longitude;
      this.latitude = latitude;
      this.me = me;
    }
}
let usersArray = [] 

app.get('/', function(req, res) {
    if (req.cookies.signedIn) {
        res.sendFile('./public/forside.html', { root: __dirname })              
    }
    else{
        res.redirect('./login')
    }
});


app.get('/login', function(req, res) {
    if (req.cookies.signedIn) {
        res.sendFile('./public/forside.html', { root: __dirname })              
    }
    else{
        res.sendFile('./public/index.html', { root: __dirname })              
    }
});

app.post('/postData', (req, res) => {
    console.log(req.body);
    let data = new users(req.body.name, req.body.longitude, req.body.latitude, "")
    for (let index = 0; index < usersArray.length; index++) {
        const element = usersArray[index];
        if(element.name == req.body.name){
            usersArray.splice(index, 1)
        }
    }
    usersArray.push(data)
    console.log(usersArray);
});

app.get('/getData', function(req, res) {
    res.send(usersArray)
});



app.post('/login', (req, res) => {
        if (req.body.username == username || req.body.username == username2 && verifyHash(req.body.password, passwordsalt, passwordhash)) {
            res.writeHead(200, ['Set-Cookie', `signedIn=${req.body.username}; Max-Age=1800; Path=/;`])  
            res.write(fs.readFileSync('./public/forside.html'))
            res.end()
        }
        else{
            res.redirect('./index.html')
            res.end()
        }
});



app.listen('4000', () => {console.log('server is listening at port 4000');})