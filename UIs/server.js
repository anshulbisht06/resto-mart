var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('../UIs'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(7000, function(){
  console.log('UI server up');
});
