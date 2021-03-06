var apiKey = "AIzaSyAAXAiJ5WgWHoaxL1QG9E1w9dJLA6eH1MQ";
var searchID ="008182633033430538347:isqigawv_v8";
const GoogleImages = require('google-images'); 
const client = new GoogleImages(searchID, apiKey);
const express = require('express')
var multer  = require('multer')
//var upload = multer({ dest: './uploads/' })
var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/'); // Make sure this folder exists
        },
        filename: function(req, file, cb) {
            var ext = file.originalname.split('.').pop();
            cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
        }
    });
var upload = multer({ storage: storage }).single('upl');



const moment = require('moment')
const app = express()
app.use(upload);
// const os = require( 'os' );
// var networkInterfaces = os.networkInterfaces( );
// console.log( networkInterfaces );
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var query = {"name": "seq_id"  };
//var newvalues = { "address": 1, "name":"seq_id"  };
var seq;
// MongoClient.connect(url, function(err, db) {
//   db.createCollection("searchLog");
// });
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
function sendSearchTermToLog(queryStr){
  //insert
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var myobj = { query: queryStr, when: Date.now() };
    db.collection("searchLog").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
    });
  });
}
app.get('/imageSearch/:query',function(req, res) {
  //save req.params.query to mongos 
    sendSearchTermToLog(req.params.query);
    client.search(req.params.query, {page: 2})
    .then(images => {
        console.log(images.length);
        res.send(images);
        // [{
        //     "url": "http://steveangello.com/boss.jpg",
        //     "type": "image/jpeg",
        //     "width": 1024,
        //     "height": 768,
        //     "size": 102451,
        //     "thumbnail": {
        //         "url": "http://steveangello.com/thumbnail.jpg",
        //         "width": 512,
        //         "height": 512
        //     }
        // }]
         
    });
})
app.get('/imageSearchTerms',function(req, res) {
    //guery last 10 search terms
    console.log("hihi");
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    
    db.collection("searchLog").find().toArray(function(err, result) {
      if (err) throw err;
      // if (qur){
      //   //seq=result;
      // }
      res.send(result);
      db.close();
    });
  
  });
})
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
});
app.get('/uploadFile' ,function(req, res) {
    console.log("Im here");
    res.sendFile(__dirname + "/" + 'file.html' );
    
}) ;
// app.post('/uploadFile', upload, function (req, res, next) {
//   console.log("hihi, I'm in the file " + req.file);// is the `avatar` file 
//   console.log('body:', req.avatar);
//   // req.body will hold the text fields, if there were any 
// })
app.post("/uploadFile",upload,function(req,res,next){
res.json({"Uploaded Successfull with file size" : req.file.size});
});
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