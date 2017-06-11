var Db = require('mongodb').Db,
  Server = require('mongodb').Server,
  test = require('assert');
// Connect using single Server
var db = new Db('test', new Server('localhost', 27010));
db.open(function(err, db) {
  if(err){
      console.log(err);
  }
  // Get an additional db
  db.close();
});