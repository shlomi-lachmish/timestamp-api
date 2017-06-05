const express = require('express')
const moment = require('moment')
const app = express()
// const os = require( 'os' );
// var networkInterfaces = os.networkInterfaces( );
// console.log( networkInterfaces );
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var query = {"name": "seq_id"  };
//var newvalues = { "address": 1, "name":"seq_id"  };
var seq;

//insert
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var myobj = { name: "seq_id", address: "1" };
//   db.collection("sUrl").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 record inserted");
//     db.close();
//   });
// });
//var that = this;

function getAllRec(qur) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    
    db.collection("sUrl").find(qur).toArray(function(err, result) {
      if (err) throw err;
      if (qur){
        seq=result[0].address;
      }
      console.log(result);
      db.close();
    });
  
  });
}
getAllRec(query);


var oDate = new Date();
app.get('/date/:date', function (req, res) {
  var resJson = {
    date:null,
    unix:null
  }
  if (moment(req.params.date, "DD-MM-YYYY", true).isValid()){ //we have a humen date detected
    resJson.date = req.params.date;
    var hDate =  moment(req.params.date, "DD-MM-YYYY");
    //build a unix time 
    var uTime = (hDate.valueOf() / 1000).toString(); 
    resJson.unix = uTime;
  }
  if (moment(req.params.date, "X", true).isValid()){ //we have a unix date detected
    resJson.unix = req.params.date;
    var uDate =  moment(req.params.date, "X");
    //build a humen time 
    var hTime = moment(uDate).format("DD-MM-YYYY"); 
    resJson.date = hTime;
  }
  res.send(resJson);
})
var jsonIP = {
  "ip":"",
  "lang":"",
  "software":""
}
app.get('/whoami', function(req, res){
  var arrIP = req.connection.remoteAddress.split(":");
  if (arrIP.length>2){
    jsonIP.ip=arrIP[3];
  }else{
    jsonIP.ip=req.connection.remoteAddress;
  }
  jsonIP.lang=req.acceptsLanguages()[0];
  jsonIP.software=req.headers["user-agent"];
  res.send(jsonIP);
})
app.get('/runSurl/:seq', function(req, res) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    
    db.collection("sUrl").find({seq : req.params.seq}).toArray(function(err, result) {
      if (err) throw err;
      var urlStr=result[0].address;
      console.log("hi" + urlStr);
      res.redirect(urlStr);
      db.close();
    });
  
  });
})
app.get('/surl/:urlProtocol//:urlStr', function(req, res) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var newSeq = seq + 1;
      console.log("newSeq= "+newSeq);
      var newvalues = { "address": newSeq, "name":"seq_id"  };
      db.collection("sUrl").update(query, newvalues, function(err1, res1) {
        if (err1) throw err;
        res1.result.nModified;
        var resJson1={original_url: req.params.urlProtocol + "//" + req.params.urlStr + " " +newSeq.toString(),
                  short_url: "https://api-chllenge-lachmish.c9users.io/runSurl/"+newSeq.toString()
        }
        res.send(resJson1);
        db.close();
      });
    });
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myobj = { seq: (++seq).toString(), address: req.params.urlProtocol + "//" + req.params.urlStr };
      db.collection("sUrl").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 record inserted");
        db.close();
      });
    });
    
})
getAllRec();
app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!')
})