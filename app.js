let express = require('express');
let app = express();
let port = 3000;

app.get('/', function(req, res) {
  res.send('Hello World.');
});

app.listen(port, function() {
  console.log('Server listening on port:' + port);
});

