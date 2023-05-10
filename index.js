const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const dbConfig = require('./core/config/db.config');
const auth = require("./core/authentication/auth");
const cors = require('cors')
const path = require('path')
const port = process.env.PORT || 3151;
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const mongoose = require('mongoose');

const userRouter = require('./router/user.router')
const adminRouter = require('./router/admin.router')

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database.', err);
  process.exit();
});


///////////////////// SSL CODE ADDED
// var fs = require('fs');
// var http = require('http');
// var https = require('https');
// var privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('ssl/fullchain.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
 
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

//////////////////////////////////////

/*router */
app.use(express.static(path.join(__dirname, 'public')))

app.use(auth, userRouter)
app.use(auth, adminRouter)

//app.use(express.static(__dirname + 'public'));
app.get('/', (req, res) => {
  res.json({ "message": "node is running" });
});

// app.listen(port, () => {
//   console.log(`Node server is listening on port ${port}`);
// });



if (module === require.main) {
     var server = app.listen(process.env.PORT || 3151, function () {
  //var server = httpsServer.listen(process.env.PORT || 3151, function () {
        var port = server.address().port;
        console.log("App listening on port %s", port);
    });
}